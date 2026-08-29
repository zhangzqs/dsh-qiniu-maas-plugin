import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-model-market';
import { QINIU_API_KEY_REF } from '../qiniu-config.ts';
import {
  selectEnabledModels,
  settingsWithEnabledModels,
  settingsWithInferenceEndpoint,
} from './provider-controller.ts';
import type { PiAiSettingsController } from './settings/pi-ai-settings-controller.ts';
import type { QiniuSettingsController } from './settings/qiniu-settings-controller.ts';
import { type QiniuActions, type QiniuState } from './qiniu-state.ts';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';

export type QiniuController = QiniuActions;

export function createQiniuController(
  connection: ConnectionHandle,
  qiniuSettings: QiniuSettingsController,
  piAiSettings: PiAiSettingsController,
  store: SnapshotStore<QiniuState>,
): QiniuController {
  let cachedMarketModels: readonly Model[] = [];

  const fetchMarketModels = async (
    region: QiniuRegion,
  ): Promise<readonly Model[]> => {
    const models = await listModels({ region });
    cachedMarketModels = [...models].sort(
      (left, right) => (right.rank ?? 0) - (left.rank ?? 0),
    );
    return cachedMarketModels;
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

  const setEnabledModels = async (models: readonly Model[]): Promise<void> => {
    const settings = qiniuSettings.read();
    const enabledModelIds = new Set(settings.enabledModelIds);
    const enabledModels = models.filter(
      (model) => !model.suggested_model || enabledModelIds.has(model.id),
    );
    await qiniuSettings.setEnabledModelIds(
      enabledModels.map((model) => model.id),
    );
    await piAiSettings.setProviders(
      settingsWithEnabledModels(
        piAiSettings.read().providers,
        enabledModels,
        settings.region,
        settings.inferenceProtocol,
      ),
    );
    cachedMarketModels = enabledModels;
    store.update((state) => {
      state.enabledModelIds = enabledModels.map((model) => model.id);
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
    const state = store.getSnapshot();
    const enabledModels =
      cachedMarketModels.length > 0
        ? selectEnabledModels(cachedMarketModels, state.enabledModelIds)
        : undefined;
    const qiniuSettingsValue = qiniuSettings.read();
    const providers = piAiSettings.read().providers;
    await piAiSettings.setProviders(
      enabledModels === undefined
        ? settingsWithInferenceEndpoint(
            providers,
            qiniuSettingsValue.region,
            qiniuSettingsValue.inferenceProtocol,
          )
        : settingsWithEnabledModels(
            providers,
            enabledModels,
            qiniuSettingsValue.region,
            qiniuSettingsValue.inferenceProtocol,
          ),
    );
  };

  const setModelMarketRegion = async (region: QiniuRegion): Promise<void> => {
    await qiniuSettings.setRegion(region);
    await updateProviderSettings();
    store.update((state) => {
      state.modelMarketRegion = region;
    });
  };

  const setInferenceProtocol = async (
    protocol: QiniuInferenceProtocol,
  ): Promise<void> => {
    await qiniuSettings.setInferenceProtocol(protocol);
    await updateProviderSettings();
    store.update((state) => {
      state.inferenceProtocol = protocol;
    });
  };

  return {
    checkApiKeyConfigured,
    fetchMarketModels,
    setEnabledModels,
    setApiKey,
    setModelMarketRegion,
    setInferenceProtocol,
  };
}
