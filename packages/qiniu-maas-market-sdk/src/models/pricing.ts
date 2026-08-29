/** 定价详情项。 */
export interface PricingItem {
  /** 定价单位名称。 */
  unit_name: string;
  /** 定价单位量。 */
  unit_size: number;
  /** 每单位定价，单位为人民币。 */
  unit_price: number;
  /** 每单位定价，单位为美元。 */
  unit_price_usd: number;
  /** 计费项中文名称。 */
  name: string;
}

/** 定价模式，区分实时推理和批量推理。 */
export interface PricingMode {
  real_time?: PricingItem;
  batch?: PricingItem;
}

/** 用量计费明细，V1 格式。 */
export interface UsageItem {
  total_prompt_tokens?: PricingMode;
  total_completion_tokens?: PricingMode;
  prompt_tokens?: PricingMode;
  completion_tokens?: PricingMode;
  reasoning_prompt_tokens?: PricingMode;
  reasoning_completion_tokens?: PricingMode;
  tts_bytes?: PricingMode;
  asr_minutes?: PricingMode;
  image_req_count?: PricingMode;
  cached_hit?: PricingMode;
  cache_storage?: PricingMode;
}

/** 用量计费明细，V2 格式。 */
export interface UsageItemV2 {
  input?: PricingItem;
  output?: PricingItem;
  cache?: PricingItem;
  th_input?: PricingItem;
  th_output?: PricingItem;
  nth_input?: PricingItem;
  nth_output?: PricingItem;
  i_input?: PricingItem;
  i_output?: PricingItem;
  a_input?: PricingItem;
  a_output?: PricingItem;
  v_duration?: PricingItem;
  av_duration?: PricingItem;
  minute?: PricingItem;
  hbyte?: PricingItem;
  req?: PricingItem;
}

/** 定价规则。区间边界中的 -1 表示无上限。 */
export interface PricingRule {
  /** 成本渠道名称，仅成本项使用。 */
  name?: string | null;
  /** 输入区间左右边界。 */
  input_range: number[];
  /** 输出区间左右边界。 */
  output_range: number[];
  /** 输入计费项类型。 */
  input_item_type: string;
  /** 输出计费项类型。 */
  output_item_type: string;
  /** 已弃用的 V1 计费明细。 */
  details: UsageItem;
  /** V2 计费明细。 */
  details_v2: UsageItemV2;
}
