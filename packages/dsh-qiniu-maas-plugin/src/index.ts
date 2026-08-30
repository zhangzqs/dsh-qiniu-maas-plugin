import type { Context } from '@deepseek-ai/cordis';
import {
  installSettingsSection,
  settingsNamespace,
} from '@deepseek-ai/dsh-settings';
import z from '@deepseek-ai/schemastery';

export const name = '@qiniu/dsh-qiniu-maas-plugin';
export const inject: string[] = [];

const SETTINGS_NAMESPACE = settingsNamespace('qiniu-maas');

export interface Config {
  enabledModelIds?: string[];
  region?: 'cn' | 'global';
  inferenceProtocol?:
    | 'openai-completions'
    | 'openai-responses'
    | 'anthropic-messages';
}

export const Config: z<Config> = z.object({
  enabledModelIds: z.array(z.string()).default([]),
  region: z.union(['cn', 'global']).default('cn'),
  inferenceProtocol: z
    .union(['openai-completions', 'openai-responses', 'anthropic-messages'])
    .default('openai-completions'),
});

export function apply(ctx: Context, config: Config): void {
  installSettingsSection(ctx, SETTINGS_NAMESPACE, Config, config, {
    setSource: () => {},
    onChange: () => {},
  });
}
