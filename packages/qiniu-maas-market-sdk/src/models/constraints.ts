/** 模型约束参数。 */
export interface ModelConstraints {
  /** 模型上下文长度。 */
  context_length: number;
  /** 模型最大输出 token 数。 */
  max_completion_tokens: number;
  /** 模型最大输出 token 数，可能与 max_completion_tokens 不同。 */
  max_tokens: number;
  /** 模型默认最大输出 token 数。 */
  max_default_completion_tokens: number;
  /** 模型最大思考链长度。 */
  max_chain_of_thought_length: number;
}

/** 按最大值、兼容值和默认值顺序获取有效的输出 token 数。 */
export function getModelMaxTokens(
  constraints: Partial<ModelConstraints> | undefined,
): number | undefined {
  return [
    constraints?.max_completion_tokens,
    constraints?.max_tokens,
    constraints?.max_default_completion_tokens,
  ].find(
    (value): value is number =>
      value !== undefined && Number.isInteger(value) && value > 0,
  );
}
