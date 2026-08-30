import type {
  QiniuInferenceProtocol,
  QiniuRegion,
} from 'qiniu-maas-market-sdk';

export type {
  QiniuInferenceProtocol,
  QiniuRegion,
} from 'qiniu-maas-market-sdk';

export const QINIU_MAAS_NAMESPACE = 'qiniu-maas' as const;

export interface QiniuSettings {
  enabledModelIds?: string[];
  region?: QiniuRegion;
  inferenceProtocol?: QiniuInferenceProtocol;
}
