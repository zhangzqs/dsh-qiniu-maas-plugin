import type { Context } from '@deepseek-ai/cordis';
import {
  installSettingsSection,
  settingsNamespace,
} from '@deepseek-ai/dsh-settings';
import z from '@deepseek-ai/schemastery';
import {
  QINIU_MAAS_NAMESPACE,
  type QiniuInferenceProtocol,
  type QiniuSettings,
} from './shared.ts';
import type { QiniuRegion } from 'qiniu-maas-market-sdk';

export const name = '@qiniu/dsh-qiniu-maas-plugin';
export const inject: string[] = [];

const SETTINGS_NAMESPACE = settingsNamespace(QINIU_MAAS_NAMESPACE);

export type Config = QiniuSettings;

export const Config: z<Config> = z.object({
  enabledModelIds: z.array(z.string()).default([]),
  region: z.union(['cn', 'global'] satisfies QiniuRegion[]).default('cn'),
  inferenceProtocol: z
    .union([
      'openai-completions',
      'anthropic-messages',
    ] satisfies QiniuInferenceProtocol[])
    .default('openai-completions'),
});

export function apply(ctx: Context, config: Config): void {
  installSettingsSection(ctx, SETTINGS_NAMESPACE, Config, config, {
    setSource: () => {},
    onChange: () => {},
  });
}
