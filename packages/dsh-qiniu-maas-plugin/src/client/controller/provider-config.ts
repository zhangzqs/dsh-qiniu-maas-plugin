import { QINIU_LLM_BASE_URLS, type Model } from 'qiniu-maas-market-sdk';
import type {
  PiAiModelProfile,
  PiAiProviderProfile,
} from '@deepseek-ai/dsh-llm-pi-ai';
import type { PiAiSettings } from './settings/pi-ai.ts';
import type { QiniuSettingsValue } from './settings/qiniu.ts';
import { QINIU_MAAS_NAMESPACE } from '../../shared.ts';

export const QINIU_API_KEY_REF = 'QINIU_MAAS_API_KEY';
type PiAiProviders = NonNullable<PiAiSettings['providers']>;

function toPiAiModelProfile(
  model: Pick<Model, 'id' | 'name' | 'architecture' | 'model_constraints'>,
): PiAiModelProfile {
  const name = model.name ?? model.id;
  const contextWindow = model.model_constraints?.context_length;
  const maxTokens = model.model_constraints?.max_tokens;
  return {
    id: model.id,
    name,
    ...(contextWindow === undefined ? {} : { contextWindow }),
    ...(maxTokens === undefined ? {} : { maxTokens }),
    input: ['text'],
  };
}

/** 将七牛设置和可选的模型市场快照同步到七牛 provider。 */
export function syncQiniuProvider(
  providers: PiAiSettings['providers'],
  settings: QiniuSettingsValue,
  marketModels: readonly Model[],
): PiAiProviders {
  const currentProviders = providers ?? {};
  const enabledModelIds = new Set(settings.enabledModelIds);
  const models = marketModels.filter((model) => enabledModelIds.has(model.id));
  if (models.length === 0) {
    const otherProviders = { ...currentProviders };
    delete otherProviders[QINIU_MAAS_NAMESPACE];
    return otherProviders;
  }
  const profile: PiAiProviderProfile = {
    displayName: 'Qiniu MaaS',
    apiKeyEnv: QINIU_API_KEY_REF,
    api: settings.inferenceProtocol,
    baseURL: QINIU_LLM_BASE_URLS[settings.region][settings.inferenceProtocol],
    models: models.map(toPiAiModelProfile),
  };
  return { ...currentProviders, [QINIU_MAAS_NAMESPACE]: profile };
}
