import type { ModelAbility } from './ability.ts';

/** 模型市场支持的输入模态。 */
export type QiniuModelInputModality =
  | 'audio'
  | 'file'
  | 'image'
  | 'text'
  | 'video';

/** 模型市场支持的输出模态。 */
export type QiniuModelOutputModality = 'image' | 'text' | 'video';

/** 模型架构信息。 */
export interface ModelArchitecture {
  /** 输入模态列表。 */
  input_modalities: QiniuModelInputModality[];
  /** 输出模态列表。 */
  output_modalities: QiniuModelOutputModality[];
  schema_output?: ModelAbility;
  function_calling?: ModelAbility;
  reasoning?: ModelAbility;
  content_cache?: ModelAbility;
}
