import type { Context, Volatile } from '@deepseek-ai/cordis';
import type {} from '@deepseek-ai/dsh-settings';
import z from '@deepseek-ai/schemastery';
import type {
  QiniuInferenceProtocol,
  QiniuRegion,
} from 'qiniu-maas-market-sdk';

export const name = '@qiniu/dsh-qiniu-maas-plugin';
export const inject: string[] = [];

export interface Config {
  enabledModelIds: Volatile<string[]>;
  hasAutoEnabledDefaultModels: Volatile<boolean>;
  region: Volatile<QiniuRegion>;
  inferenceProtocol: Volatile<QiniuInferenceProtocol>;
}

export const Config = z.object({
  enabledModelIds: z.array(z.string()).default([]).volatile(),
  hasAutoEnabledDefaultModels: z.boolean().default(false).volatile(),
  region: z
    .union(['cn', 'global'] satisfies QiniuRegion[])
    .default('cn')
    .volatile(),
  inferenceProtocol: z
    .union([
      'openai-completions',
      'anthropic-messages',
    ] satisfies QiniuInferenceProtocol[])
    .default('openai-completions')
    .volatile(),
});

export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.effect(
      () => settingsCtx.settings.configure({ auto: false }, ctx.fiber),
      'qiniu-maas: settings presentation',
    );
  });
}
