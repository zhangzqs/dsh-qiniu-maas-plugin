import type {
  ApiKeyItem, GetBillByRangeResponse, GetUsageResponse, MarketModelsResponse,
  components, ListApiKeysResponse,
} from 'qiniu-maas-sdk'
import type { MarketplaceModel } from './client/ModelMarketplace.js'

export interface ApiKeySummary { name: string; maskedValue: string; enabled: boolean; createdAt?: string; lastUsed?: string }
export interface UsageReport { start?: string; end?: string; items: Array<{ model: string; name: string; unit: string; total: number; values: Array<{ time: string; value: number }> }> }
export interface BillReport { models: Array<{ modelId: string; timeSeries: Array<{ time: string; items: Array<{ name: string; usage: { count: number; unit: string }; fee: number }>; totalFee: number; totalRequests?: number }>; totalFee: number; totalRequests?: number }> }

type Model = components['schemas']['ModelDTO']

function capabilities(model: Model): string[] {
  const result = [...model.features]
  for (const modality of model.architecture.input_modalities) result.push(`${modality}-input`)
  for (const modality of model.architecture.output_modalities) result.push(`${modality}-output`)
  for (const [key, label] of [['function_calling', 'function-calling'], ['reasoning', 'reasoning']] as const) {
    if (model.architecture[key]?.supported) result.push(label)
  }
  return [...new Set(result)]
}

export function mapMarketModels(response: MarketModelsResponse): MarketplaceModel[] {
  return response.data.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description,
    contextWindow: model.model_constraints.context_length,
    maxOutputTokens: model.model_constraints.max_tokens,
    capabilities: capabilities(model),
  }))
}

export function mapApiKeys(response: ListApiKeysResponse): ApiKeySummary[] {
  return response.data.map((item: ApiKeyItem) => ({ name: item.name, maskedValue: item.key, enabled: item.enabled, createdAt: item.createdAt, lastUsed: item.lastUsed }))
}

export function mapUsage(response: GetUsageResponse): UsageReport {
  return { items: response.data.flatMap(model => model.items.map(item => ({ model: model.name, name: item.name, unit: item.unit, total: item.total, values: item.values }))) }
}

export function mapBill(response: GetBillByRangeResponse): BillReport {
  return { models: (response.models ?? []).map(model => ({ modelId: model.model_id ?? '', totalFee: model.total_fee ?? 0, totalRequests: model.total_requests, timeSeries: (model.time_series ?? []).map(series => ({ time: series.time ?? '', totalFee: series.total_fee ?? 0, totalRequests: series.total_requests, items: (series.items ?? []).map(item => ({ name: item.name ?? '', usage: { count: item.usage?.count ?? 0, unit: item.usage?.unit ?? 'default' }, fee: item.fee ?? 0 })) })) })) }
}
