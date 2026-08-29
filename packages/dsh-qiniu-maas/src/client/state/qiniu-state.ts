import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import type { Config as PiAiConfig } from '@deepseek-ai/dsh-llm-pi-ai';
import type {
  SettingsScope,
  SnapshotStore,
} from '@deepseek-ai/dsh-client-runtime/client';
import type { Model, QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';

export type PiAiSettings = Pick<PiAiConfig, 'providers'>;

export interface QiniuSettings {
  enabledModelIds?: readonly string[];
  region?: QiniuRegion;
  inferenceProtocol?: QiniuInferenceProtocol;
}

export interface QiniuState {
  enabledModelIds: readonly string[];
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuInjected {
  api: Pick<IApiClient, 'credentials'>;
  settings: SettingsScope<QiniuSettings>;
  hooks: {
    snapshot: SnapshotStore<QiniuState>;
  };
  checkApiKeyConfigured: () => Promise<boolean>;
  fetchModels: (region: QiniuRegion) => Promise<readonly Model[]>;
  saveModels: (models: readonly Model[]) => Promise<void>;
  setApiKey: (value: string) => Promise<void>;
  apiKeyRef: string;
  setModelMarketRegion: (region: QiniuRegion) => Promise<void>;
  setInferenceProtocol: (protocol: QiniuInferenceProtocol) => Promise<void>;
}

export type QiniuController = Pick<
  QiniuInjected,
  | 'checkApiKeyConfigured'
  | 'fetchModels'
  | 'saveModels'
  | 'setApiKey'
  | 'setModelMarketRegion'
  | 'setInferenceProtocol'
>;

export function regionOf(settings: SettingsScope<QiniuSettings>): QiniuRegion {
  return settings.getSnapshot().value?.region ?? 'cn';
}

export function enabledModelIdsOf(
  settings: SettingsScope<QiniuSettings>,
): string[] {
  const modelIds = settings.getSnapshot().value?.enabledModelIds;
  return Array.isArray(modelIds)
    ? modelIds.filter(
        (modelId): modelId is string => typeof modelId === 'string',
      )
    : [];
}

export function inferenceProtocolOf(
  settings: SettingsScope<QiniuSettings>,
): QiniuInferenceProtocol {
  return (
    settings.getSnapshot().value?.inferenceProtocol ?? 'openai-completions'
  );
}
