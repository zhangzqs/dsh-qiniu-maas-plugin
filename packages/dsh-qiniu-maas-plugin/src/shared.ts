import type { QiniuRegion } from 'qiniu-maas-market-sdk';

export const QINIU_SETTINGS_NAMESPACE = 'qiniu-maas' as const;

export type QiniuInferenceProtocol =
  | 'openai-completions'
  | 'openai-responses'
  | 'anthropic-messages';

export interface QiniuSettings {
  enabledModelIds?: string[];
  region?: QiniuRegion;
  inferenceProtocol?: QiniuInferenceProtocol;
}
