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

export function normalizeQiniuSettings(value: unknown): QiniuSettings {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const models = Array.isArray(input.models) ? input.models.map((item) => {
    if (!item || typeof item !== 'object') throw new TypeError('qiniu-maas models must contain objects')
    const model = item as Record<string, unknown>
    if (typeof model.id !== 'string' || model.id.length === 0 || typeof model.enabled !== 'boolean') {
      throw new TypeError('qiniu-maas model selections require id and enabled')
    }
    return {
      id: model.id,
      enabled: model.enabled,
      ...(typeof model.contextWindow === 'number' ? { contextWindow: model.contextWindow } : {}),
      ...(typeof model.maxOutputTokens === 'number' ? { maxOutputTokens: model.maxOutputTokens } : {}),
    }
  }) : []
  if (input.defaultModel !== undefined && typeof input.defaultModel !== 'string') {
    throw new TypeError('qiniu-maas defaultModel must be a string')
  }
  return { models, ...(typeof input.defaultModel === 'string' ? { defaultModel: input.defaultModel } : {}) }
}

export const QiniuSettingsSchema = Object.assign(
  (value: unknown) => normalizeQiniuSettings(value),
  { toJSON: () => ({ type: 'object', properties: { models: { type: 'array' }, defaultModel: { type: 'string' } } }) },
)
