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
  /** 已启用的模型ID列表 */
  enabledModelIds?: string[];
  /** 是否已经自动启用了默认模型列表 */
  hasAutoEnabledDefaultModels?: boolean;
  /** 服务区域 */
  region?: QiniuRegion;
  /** 推理协议 */
  inferenceProtocol?: QiniuInferenceProtocol;
}
