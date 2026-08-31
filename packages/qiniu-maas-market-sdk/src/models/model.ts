import type { ModelArchitecture } from './architecture.ts';
import type { ModelConstraints } from './constraints.ts';
import type { ModelFiling } from './filing.ts';
import type { Issuer } from './issuer.ts';
import type { PricingRule } from './pricing.ts';
import type { RateLimit } from './rate-limit.ts';

/** 模型支持的 API 协议。 */
export type QiniuModelApiProtocol =
  | 'openai'
  | 'anthropic'
  | 'fal_ai'
  | 'google'
  | 'openai-image'
  | 'openai_video';

/** 模型市场中的模型配置详情。 */
export interface Model {
  /** 模型唯一标识。 */
  id: string;
  /** 模型名称。 */
  name: string;
  /** 模型描述。 */
  description: string;
  /** 模型创建时间。 */
  created_time: string;
  /** 模型图标 URL。 */
  avatar: string;
  /** 热门标签。 */
  hot_tags: string[];
  /** 功能特性。 */
  features: string[];
  /** 是否为私有模型。 */
  private: boolean;
  model_constraints: ModelConstraints;
  issuer: Issuer;
  architecture: ModelArchitecture;
  /** 已弃用的 V1 定价规则列表。 */
  pricing_rules: PricingRule[];
  /** V2 定价规则列表。 */
  pricing_rules_v2?: PricingRule[];
  /** 已弃用的限流配置。 */
  rate_limit: RateLimit;
  model_filing: ModelFiling;
  /** 已弃用的支持请求参数列表。 */
  supported_parameters: string[];
  /** 支持的 API 协议列表。 */
  support_api_protocols: QiniuModelApiProtocol[];
  /** 模型排序权重。 */
  rank: number;
  /** 模型退役时间，空字符串表示未设定。 */
  retirement_at: string;
  /** 模型发布时间。 */
  release_at: string;
  /** 模型退役后建议使用的新模型 ID。 */
  suggested_model: string;
  model_alias?: string;
  pricing_page_url?: string;
  integration_doc_url?: string;
  model_doc_url?: string;
}
