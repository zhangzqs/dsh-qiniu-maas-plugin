import {
  getModelMaxTokens,
  QINIU_LLM_BASE_URLS,
  type Model,
} from 'qiniu-maas-market-sdk';
import type {
  PiAiModelProfile,
  PiAiProviderProfile,
} from '@deepseek-ai/dsh-llm-pi-ai';
import type { PiAiSettings, PiAiSettingsController } from './settings/pi-ai.ts';
import type {
  QiniuSettingsController,
  QiniuSettingsValue,
} from './settings/qiniu.ts';
import { QINIU_MAAS_NAMESPACE } from '../../shared.ts';

export const QINIU_API_KEY_REF = 'QINIU_MAAS_API_KEY';

/** 将七牛模型实体转换为pi-ai模型配置 */
function toPiAiModelProfile(
  model: Pick<Model, 'id' | 'name' | 'architecture' | 'model_constraints'>,
): PiAiModelProfile {
  const name = model.name ?? model.id;
  const contextWindow = model.model_constraints?.context_length;
  const maxTokens = getModelMaxTokens(model.model_constraints);
  const input = model.architecture?.input_modalities.filter(
    (modality) => modality === 'text' || modality === 'image',
  );
  return {
    id: model.id,
    name,
    ...(isPositiveInteger(contextWindow) ? { contextWindow } : {}),
    ...(isPositiveInteger(maxTokens) ? { maxTokens } : {}),
    ...(input === undefined || input.length === 0 ? {} : { input }),
  };
}

function isPositiveInteger(value: number | undefined): value is number {
  return value !== undefined && Number.isInteger(value) && value > 0;
}

/** 根据七牛设置和模型市场快照生成七牛 provider 配置。 */
function createQiniuProviderSettings(
  providers: PiAiSettings['providers'], // pi_ai provider配置列表
  settings: QiniuSettingsValue, // 插件设置
  marketModels: readonly Model[], // 模型广场列表，可能并不包含所有已启用的模型
): NonNullable<PiAiSettings['providers']> {
  const currentProviders = providers ?? {};

  // 过滤出所有可以启用的模型
  const models = (() => {
    const enabledModelIds = new Set(settings.enabledModelIds);
    return marketModels.filter((model) => enabledModelIds.has(model.id));
  })();

  // 没有可以启用的模型就直接移除这个provider
  if (models.length === 0) {
    const otherProviders = { ...currentProviders };
    delete otherProviders[QINIU_MAAS_NAMESPACE];
    return otherProviders;
  }

  // 构建provider配置
  const profile: PiAiProviderProfile = {
    displayName: 'Qiniu MaaS',
    apiKeyEnv: QINIU_API_KEY_REF,
    api: settings.inferenceProtocol,
    baseURL: QINIU_LLM_BASE_URLS[settings.region][settings.inferenceProtocol],
    models: models.map(toPiAiModelProfile),
  };

  // 返回新的provider配置列表
  return {
    ...currentProviders,
    [QINIU_MAAS_NAMESPACE]: profile,
  };
}

/** 同步七牛 provider 配置到 pi-ai */
export async function syncProviderSettings(
  piAiSettings: PiAiSettingsController,
  qiniuSettings: QiniuSettingsController,
  marketModels: readonly Model[],
): Promise<void> {
  const settings = qiniuSettings.read();
  await piAiSettings.setProviders(
    createQiniuProviderSettings(
      piAiSettings.read().providers,
      settings,
      marketModels,
    ),
  );
}
