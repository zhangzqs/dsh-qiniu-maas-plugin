import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
import {
  QINIU_LLM_BASE_URLS,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-model-market';
import type {
  PiAiModelProfile,
  PiAiProviderProfile,
} from '@deepseek-ai/dsh-llm-pi-ai';
import {
  QINIU_API_KEY_REF,
  QINIU_PROVIDER,
  type QiniuInferenceProtocol,
} from '../qiniu-config.ts';
import { type PiAiSettings } from '../state/qiniu-state.ts';

function modelProfile(
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

/** 从模型列表中筛选过滤模型 */
export function selectEnabledModels(
  models: readonly Model[],
  enabledModelIds: readonly string[],
): Model[] {
  const enabledModelIdsSet = new Set(enabledModelIds);
  return models.filter((model) => enabledModelIdsSet.has(model.id));
}

/** 从dsh配置中获取可用模型 ID 列表 */
export function settingsWithModels(
  settings: SettingsScope<PiAiSettings>,
  models: readonly Model[],
  region: QiniuRegion = 'cn',
  protocol: QiniuInferenceProtocol = 'openai-completions',
): Record<string, unknown> {
  const providers = settings.getSnapshot().value?.providers ?? {};
  if (models.length === 0) {
    const otherProviders = { ...providers };
    delete otherProviders[QINIU_PROVIDER];
    return otherProviders;
  }
  const profile: PiAiProviderProfile = {
    displayName: 'Qiniu MaaS',
    apiKeyEnv: QINIU_API_KEY_REF,
    api: protocol,
    baseURL: QINIU_LLM_BASE_URLS[region],
    models: models.map(modelProfile),
  };
  return { ...providers, [QINIU_PROVIDER]: profile };
}

export function settingsWithEndpoint(
  settings: SettingsScope<PiAiSettings>,
  region: QiniuRegion,
  protocol: QiniuInferenceProtocol,
): Record<string, unknown> {
  const providers = settings.getSnapshot().value?.providers ?? {};
  const profile = providers[QINIU_PROVIDER];
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return providers;
  }

  return {
    ...providers,
    [QINIU_PROVIDER]: {
      ...profile,
      api: protocol,
      baseURL: QINIU_LLM_BASE_URLS[region],
    },
  };
}
