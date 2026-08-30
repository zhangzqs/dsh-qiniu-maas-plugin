import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-market-sdk';
import { QINIU_API_KEY_REF, syncQiniuProvider } from './provider-config.ts';
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
  fetchMarketModels: (region: QiniuRegion) => Promise<readonly Model[]>;
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
  const fetchMarketModels = async (
    region: QiniuRegion,
  ): Promise<readonly Model[]> => {
    const models = await listModels({ region });
    return [...models].sort(
      (left, right) => (right.rank ?? 0) - (left.rank ?? 0),
    );
  };

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

  const setEnabledModels = async (models: readonly Model[]): Promise<void> => {
    const settings = qiniuSettings.read();
    const enabledModelIds = new Set(settings.enabledModelIds);
    const marketModelIds = new Set(models.map((model) => model.id));
    const enabledModels = models.filter(
      (model) => !model.suggested_model || enabledModelIds.has(model.id),
    );
    const unavailableModelIds = settings.enabledModelIds.filter(
      (modelId) => !marketModelIds.has(modelId),
    );
    const nextEnabledModelIds = [
      ...unavailableModelIds,
      ...enabledModels.map((model) => model.id),
    ];
    await qiniuSettings.setEnabledModelIds(nextEnabledModelIds);
    await piAiSettings.setProviders(
      syncQiniuProvider(
        piAiSettings.read().providers,
        qiniuSettings.read(),
        enabledModels,
      ),
    );
    store.update((state) => {
      state.enabledModelIds = nextEnabledModelIds;
    });
  };

  const setRegion = async (region: QiniuRegion): Promise<void> => {
    const marketModels = await fetchMarketModels(region);
    await qiniuSettings.setRegion(region);
    await piAiSettings.setProviders(
      syncQiniuProvider(
        piAiSettings.read().providers,
        qiniuSettings.read(),
        marketModels,
      ),
    );
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
    await piAiSettings.setProviders(
      syncQiniuProvider(
        piAiSettings.read().providers,
        qiniuSettings.read(),
        marketModels,
      ),
    );
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
