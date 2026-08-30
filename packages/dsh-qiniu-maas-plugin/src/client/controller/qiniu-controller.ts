import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-market-sdk';
import { QINIU_API_KEY_REF, syncProviderSettings } from './provider-sync.ts';
import type { PiAiSettingsController } from './settings/pi-ai.ts';
import type { QiniuSettingsController } from './settings/qiniu.ts';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { QiniuInferenceProtocol } from 'qiniu-maas-market-sdk';

export interface QiniuState {
  enabledModelIds: readonly string[];
  region: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuActions {
  checkApiKeyConfigured: () => Promise<boolean>;
  fetchMarketModels: (
    region: QiniuRegion,
    forceRefresh?: boolean,
  ) => Promise<readonly Model[]>;
  setEnabledModels: (models: readonly Model[]) => Promise<void>;
  setApiKey: (value: string) => Promise<void>;
  setRegion: (region: QiniuRegion) => Promise<void>;
  setInferenceProtocol: (protocol: QiniuInferenceProtocol) => Promise<void>;
}

export type QiniuController = QiniuActions;

export function createQiniuController(
  connection: ConnectionHandle,
  qiniuSettings: QiniuSettingsController,
  piAiSettings: PiAiSettingsController,
  store: SnapshotStore<QiniuState>,
): QiniuController {
  // 获取当前区域可用模型列表
  const fetchMarketModels = (() => {
    const marketModelsCache = new Map<QiniuRegion, readonly Model[]>();
    return async function fetchMarketModels(
      region: QiniuRegion,
      forceRefresh = false,
    ): Promise<readonly Model[]> {
      const cachedModels = marketModelsCache.get(region);
      if (!forceRefresh && cachedModels !== undefined) {
        return cachedModels;
      }
      const models = await listModels({ region });
      const sortedModels = [...models].sort(
        (left, right) => (right.rank ?? 0) - (left.rank ?? 0),
      );
      marketModelsCache.set(region, sortedModels);
      return sortedModels;
    };
  })();

  // 查询dsh内的credentials配置，查询API Key是否已配置
  const checkApiKeyConfigured = async (): Promise<boolean> => {
    const response = await connection.api.credentials.describe({
      refs: [QINIU_API_KEY_REF],
    });
    if (!response.result.ok) {
      throw new Error(response.result.error.message);
    }
    return (
      response.result.value.credentials[QINIU_API_KEY_REF]?.configured === true
    );
  };

  // 设置API Key
  const setApiKey = async (value: string): Promise<void> => {
    const trimmed = value.trim();
    if (trimmed.length === 0) throw new Error('API Key 不能为空');
    const response = await connection.api.credentials.set({
      ref: QINIU_API_KEY_REF,
      value: trimmed,
    });
    if (!response.result.ok) throw new Error(response.result.error.message);
  };

  // 设置已启用的模型列表
  const setEnabledModels = async (models: readonly Model[]): Promise<void> => {
    const settings = qiniuSettings.read();

    // 当前区域可用模型中的用户启用的模型
    const enabledModels = (() => {
      const enabledModelIds = new Set(settings.enabledModelIds);
      return models.filter(
        (model) => !model.suggested_model || enabledModelIds.has(model.id),
      );
    })();

    // 当前用户已启用，但当前区域无法列举出来的模型
    const unavailableModelIds = (() => {
      const marketModelIds = new Set(models.map((model) => model.id));
      return settings.enabledModelIds.filter(
        (modelId) => !marketModelIds.has(modelId),
      );
    })();

    {
      // 将已启用的模型列表保存到settings
      const nextEnabledModelIds = [
        ...unavailableModelIds,
        ...enabledModels.map((model) => model.id),
      ];
      await qiniuSettings.setEnabledModelIds(nextEnabledModelIds);
      store.update((state) => {
        state.enabledModelIds = nextEnabledModelIds;
      });
    }

    // 更新pi-ai的provider配置
    await syncProviderSettings(piAiSettings, qiniuSettings, enabledModels);
  };

  // 设置服务区域
  const setRegion = async (region: QiniuRegion): Promise<void> => {
    const marketModels = await fetchMarketModels(region);
    await qiniuSettings.setRegion(region);
    await syncProviderSettings(piAiSettings, qiniuSettings, marketModels);
    store.update((state) => {
      state.region = region;
    });
  };

  // 设置推理协议
  const setInferenceProtocol = async (
    protocol: QiniuInferenceProtocol,
  ): Promise<void> => {
    const marketModels = await fetchMarketModels(qiniuSettings.read().region);
    await qiniuSettings.setInferenceProtocol(protocol);
    await syncProviderSettings(piAiSettings, qiniuSettings, marketModels);
    store.update((state) => {
      state.inferenceProtocol = protocol;
    });
  };

  return {
    checkApiKeyConfigured,
    fetchMarketModels,
    setEnabledModels,
    setApiKey,
    setRegion,
    setInferenceProtocol,
  };
}
