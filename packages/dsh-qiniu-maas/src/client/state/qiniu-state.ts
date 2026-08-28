import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import type { Config as PiAiConfig } from '@deepseek-ai/dsh-llm-pi-ai';
import type {
  SettingsScope,
  SnapshotStore,
} from '@deepseek-ai/dsh-client-runtime/client';
import type { Model } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import { QINIU_PROVIDER } from '../qiniu-config.ts';

export interface PiAiSettings {
  providers?: PiAiConfig['providers'];
  modelMarketRegion?: QiniuRegion;
  inferenceProtocol?: QiniuInferenceProtocol;
}

export interface QiniuState {
  status: 'loading' | 'ready' | 'error';
  refreshing: boolean;
  market: readonly Model[];
  enabledModelIds: readonly string[];
  error: string | null;
  apiKeyConfigured: boolean;
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuInjected {
  api: Pick<IApiClient, 'credentials'>;
  settings: SettingsScope<PiAiSettings>;
  hooks: {
    snapshot: SnapshotStore<QiniuState>;
  };
  refresh: () => Promise<void>;
  saveModels: (models: readonly Model[]) => Promise<void>;
  setApiKey: (value: string) => Promise<void>;
  apiKeyRef: string;
  setModelMarketRegion: (region: QiniuRegion) => Promise<void>;
  setInferenceProtocol: (protocol: QiniuInferenceProtocol) => Promise<void>;
}

export type QiniuController = Pick<
  QiniuInjected,
  | 'refresh'
  | 'saveModels'
  | 'setApiKey'
  | 'setModelMarketRegion'
  | 'setInferenceProtocol'
>;

export function modelMarketRegionOf(
  settings: SettingsScope<PiAiSettings>,
): QiniuRegion {
  return settings.getSnapshot().value?.modelMarketRegion ?? 'cn';
}

export function enabledModelIdsOf(
  settings: SettingsScope<PiAiSettings>,
): string[] {
  const providers = settings.getSnapshot().value?.providers;
  const profile = providers?.[QINIU_PROVIDER];
  if (!profile || typeof profile !== 'object' || Array.isArray(profile))
    return [];
  const models = (profile as { models?: unknown }).models;
  if (!Array.isArray(models)) return [];
  return models.flatMap((model) => {
    if (!model || typeof model !== 'object' || Array.isArray(model)) return [];
    const item = model as { id?: unknown };
    return typeof item.id === 'string' ? [item.id] : [];
  });
}

export function inferenceProtocolOf(
  settings: SettingsScope<PiAiSettings>,
): QiniuInferenceProtocol {
  return (
    settings.getSnapshot().value?.inferenceProtocol ?? 'openai-completions'
  );
}
