import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-model-market';
import { QINIU_API_KEY_REF } from '../qiniu-config.ts';
import {
  selectEnabledModels,
  settingsWithEndpoint,
  settingsWithModels,
} from './provider-controller.ts';
import {
  inferenceProtocolOf,
  regionOf,
  type PiAiSettings,
  type QiniuController,
  type QiniuSettings,
  type QiniuState,
} from '../state/qiniu-state.ts';
import type {
  SettingsScope,
  SnapshotStore,
} from '@deepseek-ai/dsh-client-runtime/client';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';

export function createQiniuController(
  connection: ConnectionHandle,
  qiniuSettings: SettingsScope<QiniuSettings>,
  piAiSettings: SettingsScope<PiAiSettings>,
  store: SnapshotStore<QiniuState>,
): QiniuController {
  let cachedModels: readonly Model[] = [];

  const fetchModels = async (
    region: QiniuRegion,
  ): Promise<readonly Model[]> => {
    const models = await listModels({ region });
    cachedModels = [...models].sort(
      (left, right) => (right.rank ?? 0) - (left.rank ?? 0),
    );
    return cachedModels;
  };

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

  const saveModels = async (models: readonly Model[]): Promise<void> => {
    const enabledModelIds = new Set(store.getSnapshot().enabledModelIds);
    const modelsToSave = models.filter(
      (model) => !model.suggested_model || enabledModelIds.has(model.id),
    );
    await qiniuSettings.set(
      'enabledModelIds',
      modelsToSave.map((model) => model.id),
    );
    await piAiSettings.set(
      'providers',
      settingsWithModels(piAiSettings, modelsToSave),
    );
    cachedModels = modelsToSave;
    store.update((state) => {
      state.enabledModelIds = modelsToSave.map((model) => model.id);
    });
  };

  const setApiKey = async (value: string): Promise<void> => {
    const trimmed = value.trim();
    if (trimmed.length === 0) throw new Error('API Key 不能为空');
    const response = await connection.api.credentials.set({
      ref: QINIU_API_KEY_REF,
      value: trimmed,
    });
    if (!response.result.ok) throw new Error(response.result.error.message);
  };

  const updateProviderSettings = async (): Promise<void> => {
    const current = store.getSnapshot();
    const models =
      cachedModels.length > 0
        ? selectEnabledModels(cachedModels, current.enabledModelIds)
        : undefined;
    await piAiSettings.set(
      'providers',
      models === undefined
        ? settingsWithEndpoint(
            piAiSettings,
            regionOf(qiniuSettings),
            inferenceProtocolOf(qiniuSettings),
          )
        : settingsWithModels(
            piAiSettings,
            models,
            regionOf(qiniuSettings),
            inferenceProtocolOf(qiniuSettings),
          ),
    );
  };

  const setModelMarketRegion = async (region: QiniuRegion): Promise<void> => {
    await qiniuSettings.set('region', region);
    await updateProviderSettings();
    store.update((state) => {
      state.modelMarketRegion = region;
    });
  };

  const setInferenceProtocol = async (
    protocol: QiniuInferenceProtocol,
  ): Promise<void> => {
    await qiniuSettings.set('inferenceProtocol', protocol);
    await updateProviderSettings();
    store.update((state) => {
      state.inferenceProtocol = protocol;
    });
  };

  return {
    checkApiKeyConfigured,
    fetchModels,
    saveModels,
    setApiKey,
    setModelMarketRegion,
    setInferenceProtocol,
  };
}
