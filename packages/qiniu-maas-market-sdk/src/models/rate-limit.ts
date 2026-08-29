/** 限流项明细。 */
export interface RateLimitItem {
  /** 限流项名称。 */
  name: string;
  /** 限流数量。 */
  quantity: number;
  /** 限流单位名称。 */
  unit_name: string;
  /** 限流单位时间，单位为秒。 */
  unit_time: number;
}

/** 限流配置，key 为 rpm、tpm、ipm、qpm 等限流类型。 */
export type RateLimit = Record<string, RateLimitItem>;
