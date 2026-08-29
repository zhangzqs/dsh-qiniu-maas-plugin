import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { Model, QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';

export interface QiniuState {
  enabledModelIds: readonly string[];
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuActions {
  checkApiKeyConfigured: () => Promise<boolean>;
  fetchMarketModels: (region: QiniuRegion) => Promise<readonly Model[]>;
  setEnabledModels: (models: readonly Model[]) => Promise<void>;
  setApiKey: (value: string) => Promise<void>;
  setModelMarketRegion: (region: QiniuRegion) => Promise<void>;
  setInferenceProtocol: (protocol: QiniuInferenceProtocol) => Promise<void>;
}

export interface QiniuInjected extends QiniuActions {
  hooks: {
    snapshot: SnapshotStore<QiniuState>;
  };
}
