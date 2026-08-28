/** 模型能力标记。 */
export interface ModelAbility {
  /** 是否支持该能力。 */
  supported: boolean;
  /** 能力描述，支持 Markdown 格式。 */
  description?: string;
}
