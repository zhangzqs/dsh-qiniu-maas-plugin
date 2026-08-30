import {
  QINIU_LLM_BASE_URLS,
  type Model,
  type QiniuInferenceProtocol,
  type QiniuRegion,
} from 'qiniu-maas-market-sdk';
import type {
  PiAiModelProfile,
  PiAiProviderProfile,
} from '@deepseek-ai/dsh-llm-pi-ai';
import type { PiAiSettings } from './settings/pi-ai.ts';
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

/** 根据已启用模型生成七牛 provider 配置 */
export function settingsWithEnabledModels(
  providers: PiAiSettings['providers'],
  models: readonly Model[],
  region: QiniuRegion = 'cn',
  protocol: QiniuInferenceProtocol = 'openai-completions',
): PiAiProviders {
  const currentProviders = providers ?? {};
  if (models.length === 0) {
    const otherProviders = { ...currentProviders };
    delete otherProviders[QINIU_MAAS_NAMESPACE];
    return otherProviders;
  }
  const profile: PiAiProviderProfile = {
    displayName: 'Qiniu MaaS',
    apiKeyEnv: QINIU_API_KEY_REF,
    api: protocol,
    baseURL: QINIU_LLM_BASE_URLS[region][protocol],
    models: models.map(toPiAiModelProfile),
  };
  return { ...currentProviders, [QINIU_MAAS_NAMESPACE]: profile };
}

export function settingsWithInferenceEndpoint(
  providers: PiAiSettings['providers'],
  region: QiniuRegion,
  protocol: QiniuInferenceProtocol,
): PiAiProviders {
  const currentProviders = providers ?? {};
  const profile = currentProviders[QINIU_MAAS_NAMESPACE];
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return currentProviders;
  }

  return {
    ...currentProviders,
    [QINIU_MAAS_NAMESPACE]: {
      ...profile,
      api: protocol,
      baseURL: QINIU_LLM_BASE_URLS[region][protocol],
    },
  };
}
