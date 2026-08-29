import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-model-market';
import { QINIU_API_KEY_REF } from '../qiniu-config.ts';
import {
  selectEnabledModels,
  settingsWithModels,
} from './provider-controller.ts';
import {
  enabledModelIdsOf,
  inferenceProtocolOf,
  modelMarketRegionOf,
  type PiAiSettings,
  type QiniuController,
  type QiniuState,
} from '../state/qiniu-state.ts';
import type {
  SettingsScope,
  SnapshotStore,
} from '@deepseek-ai/dsh-client-runtime/client';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';

interface RefreshState {
  status: 'loading' | 'ready' | 'error';
  models: readonly Model[];
  error?: string | null;
}

function beginRefresh(state: RefreshState): RefreshState {
  return {
    ...state,
    status: state.models.length === 0 ? 'loading' : 'ready',
    error: undefined,
  };
}

function finishRefresh(state: RefreshState, error: unknown): RefreshState {
  return {
    ...state,
    status: state.models.length === 0 ? 'error' : 'ready',
    error: error instanceof Error ? error.message : String(error),
  };
}

export function createQiniuController(
  connection: ConnectionHandle,
  settings: SettingsScope<PiAiSettings>,
  store: SnapshotStore<QiniuState>,
): QiniuController {
  const refreshModels = async (region: QiniuRegion): Promise<void> => {
    store.update((state) => {
      state.error = null;
      state.modelMarketRegion = region;
    });
    try {
      const models = await listModels({ region });
      store.update((state) => {
        state.status = 'ready';
        state.models = models;
        state.enabledModelIds = enabledModelIdsOf(settings);
        state.modelMarketRegion = region;
      });
    } catch (error) {
      store.update((state) => {
        state.error = error instanceof Error ? error.message : String(error);
        state.modelMarketRegion = region;
      });
    }
  };

  const refresh = async (): Promise<void> => {
    store.update((state) => {
      Object.assign(state, beginRefresh(state));
      state.error = null;
    });
    try {
      const modelMarketRegion = modelMarketRegionOf(settings);
      const [models, credentialResponse] = await Promise.all([
        listModels({ region: modelMarketRegion }).then((models) =>
          [...models].sort(
            (left, right) => (right.rank ?? 0) - (left.rank ?? 0),
          ),
        ),
        connection.api.credentials.describe({ refs: [QINIU_API_KEY_REF] }),
      ]);
      const credential = credentialResponse.result.ok
        ? credentialResponse.result.value.credentials[QINIU_API_KEY_REF]
        : undefined;
      store.set({
        status: 'ready',
        models,
        enabledModelIds: enabledModelIdsOf(settings),
        error: null,
        apiKeyConfigured: credential?.configured === true,
        modelMarketRegion,
        inferenceProtocol: inferenceProtocolOf(settings),
      });
    } catch (error) {
      store.update((state) => {
        Object.assign(state, finishRefresh(state, error));
        state.enabledModelIds = enabledModelIdsOf(settings);
        state.modelMarketRegion = modelMarketRegionOf(settings);
        state.inferenceProtocol = inferenceProtocolOf(settings);
      });
    }
  };

  const saveModels = async (models: readonly Model[]): Promise<void> => {
    const enabledModelIds = new Set(store.getSnapshot().enabledModelIds);
    const modelsToSave = models.filter(
      (model) => !model.suggested_model || enabledModelIds.has(model.id),
    );
    await settings.set('providers', settingsWithModels(settings, modelsToSave));
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
    store.update((state) => {
      state.apiKeyConfigured = true;
    });
  };

  const updateProviderSettings = async (): Promise<void> => {
    const current = store.getSnapshot();
    const models = selectEnabledModels(current.models, current.enabledModelIds);
    await settings.set(
      'providers',
      settingsWithModels(
        settings,
        models,
        modelMarketRegionOf(settings),
        inferenceProtocolOf(settings),
      ),
    );
  };

  const setModelMarketRegion = async (region: QiniuRegion): Promise<void> => {
    await settings.set('modelMarketRegion', region);
    await updateProviderSettings();
    await refreshModels(region);
  };

  const setInferenceProtocol = async (
    protocol: QiniuInferenceProtocol,
  ): Promise<void> => {
    await settings.set('inferenceProtocol', protocol);
    await updateProviderSettings();
    store.update((state) => {
      state.inferenceProtocol = protocol;
    });
  };

  return {
    refresh,
    saveModels,
    setApiKey,
    setModelMarketRegion,
    setInferenceProtocol,
  };
}
