export interface QiniuModelSelection {
  id: string
  enabled: boolean
  contextWindow?: number
  maxOutputTokens?: number
}

export interface QiniuSettings {
  models: QiniuModelSelection[]
  defaultModel?: string
}

export const QINIU_SETTINGS_NS = 'qiniu-maas'
export const QINIU_CREDENTIAL_REFS = {
  accessKey: 'QINIU_ACCESS_KEY',
  secretKey: 'QINIU_SECRET_KEY',
  inferenceApiKey: 'QINIU_MAAS_API_KEY',
} as const

function positiveNumber(value: unknown, field: string): number | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) throw new TypeError(`qiniu-maas ${field} must be at least 1`)
  return value
}

export function normalizeQiniuSettings(value: unknown): QiniuSettings {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const models = Array.isArray(input.models) ? input.models.map(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new TypeError('qiniu-maas models must contain objects')
    const model = item as Record<string, unknown>
    if (typeof model.id !== 'string' || model.id.length === 0 || typeof model.enabled !== 'boolean') throw new TypeError('qiniu-maas model selections require id and enabled')
    const contextWindow = positiveNumber(model.contextWindow, 'contextWindow')
    const maxOutputTokens = positiveNumber(model.maxOutputTokens, 'maxOutputTokens')
    return { id: model.id, enabled: model.enabled, ...(contextWindow === undefined ? {} : { contextWindow }), ...(maxOutputTokens === undefined ? {} : { maxOutputTokens }) }
  }) : []
  if (input.defaultModel !== undefined && (typeof input.defaultModel !== 'string' || input.defaultModel.length === 0)) throw new TypeError('qiniu-maas defaultModel must be a non-empty string')
  return { models, ...(typeof input.defaultModel === 'string' ? { defaultModel: input.defaultModel } : {}) }
}

export const QiniuSettingsSchema = Object.assign(
  (value: unknown) => normalizeQiniuSettings(value),
  { toJSON: () => ({
    type: 'object',
    properties: {
      models: { type: 'array', items: { type: 'object', properties: { id: { type: 'string', minLength: 1 }, enabled: { type: 'boolean' }, contextWindow: { type: 'number', minimum: 1 }, maxOutputTokens: { type: 'number', minimum: 1 } }, required: ['id', 'enabled'] } },
      defaultModel: { type: 'string', minLength: 1 },
    },
    required: ['models'],
  }) },
)
