import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-model-market';
import { QINIU_API_KEY_REF } from '../qiniu-config.ts';
import {
  selectAvailableModels,
  settingsWithModels,
} from './provider-controller.ts';
import {
  availableModelIdsOf,
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
  market: readonly Model[];
  refreshing: boolean;
  error?: string | null;
}

function beginRefresh(state: RefreshState): RefreshState {
  return {
    ...state,
    status: state.market.length === 0 ? 'loading' : 'ready',
    refreshing: true,
    error: undefined,
  };
}

function finishRefresh(state: RefreshState, error: unknown): RefreshState {
  return {
    ...state,
    status: state.market.length === 0 ? 'error' : 'ready',
    refreshing: false,
    error: error instanceof Error ? error.message : String(error),
  };
}

export function createQiniuController(
  connection: ConnectionHandle,
  settings: SettingsScope<PiAiSettings>,
  store: SnapshotStore<QiniuState>,
): QiniuController {
  const refresh = async (): Promise<void> => {
    store.update((state) => {
      Object.assign(state, beginRefresh(state));
      state.error = null;
    });
    try {
      const modelMarketRegion = modelMarketRegionOf(settings);
      const [market, credentialResponse] = await Promise.all([
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
        refreshing: false,
        market,
        availableModelIds: availableModelIdsOf(settings),
        error: null,
        apiKeyConfigured: credential?.configured === true,
        modelMarketRegion,
        inferenceProtocol: inferenceProtocolOf(settings),
      });
    } catch (error) {
      store.update((state) => {
        Object.assign(state, finishRefresh(state, error));
        state.availableModelIds = availableModelIdsOf(settings);
        state.modelMarketRegion = modelMarketRegionOf(settings);
        state.inferenceProtocol = inferenceProtocolOf(settings);
      });
    }
  };

  const saveModels = async (models: readonly Model[]): Promise<void> => {
    await settings.set('providers', settingsWithModels(settings, models));
    store.update((state) => {
      state.availableModelIds = models.map((model) => model.id);
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
    const models = selectAvailableModels(
      current.market,
      current.availableModelIds,
    );
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
    await refresh();
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
