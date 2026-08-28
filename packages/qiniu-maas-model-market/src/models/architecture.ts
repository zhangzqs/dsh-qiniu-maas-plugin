import type { ModelAbility } from './ability.ts';

/** 模型架构信息。 */
export interface ModelArchitecture {
  /** 输入模态列表。 */
  input_modalities: string[];
  /** 输出模态列表。 */
  output_modalities: string[];
  schema_output?: ModelAbility;
  function_calling?: ModelAbility;
  reasoning?: ModelAbility;
  content_cache?: ModelAbility;
}
