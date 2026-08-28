import { describe, expect, test } from 'vitest'
import { mapApiKeys, mapBill, mapMarketModels, mapUsage } from '../src/maas-adapter.js'

describe('MaaS raw response adapters', () => {
  test('maps the marketplace ModelDTO without changing the SDK response contract', () => {
    const response = {
      status: true,
      data: [{
        id: 'qwen-vl', name: 'Qwen VL', description: 'vision', features: ['文本生成'],
        model_constraints: { context_length: 32768, max_tokens: 4096 },
        architecture: {
          input_modalities: ['text', 'image'], output_modalities: ['text'],
          function_calling: { supported: true }, reasoning: { supported: false },
        },
      }],
    }
    expect(mapMarketModels(response as never)).toEqual([{
      id: 'qwen-vl', name: 'Qwen VL', description: 'vision', contextWindow: 32768,
      maxOutputTokens: 4096, capabilities: ['文本生成', 'text-input', 'image-input', 'text-output', 'function-calling'],
    }])
  })

  test('maps API keys, usage, and bill reports with documented raw field names', () => {
    expect(mapApiKeys({ status: true, data: [{ key: 'sk-ab***c', name: 'demo', enabled: true, createdAt: '2026-01-01', lastUsed: '' }] } as never)).toEqual([
      { name: 'demo', maskedValue: 'sk-ab***c', enabled: true, createdAt: '2026-01-01', lastUsed: '' },
    ])
    expect(mapUsage({ status: true, data: [{ name: 'qwen', items: [{ name: 'input', unit: 'tokens', total: 3, values: [{ time: '2026-01-01', value: 3 }] }] }] } as never)).toEqual({
      items: [{ model: 'qwen', name: 'input', unit: 'tokens', total: 3, values: [{ time: '2026-01-01', value: 3 }] }],
    })
    expect(mapBill({ models: [{ model_id: 'qwen', total_fee: 1.5, time_series: [{ time: '2026-01-01T00:00:00+08:00', total_fee: 1.5, items: [{ name: 'input', usage: { count: 10, unit: 'default' }, fee: 1.5 }] }] }] } as never)).toEqual({
      models: [{ modelId: 'qwen', totalFee: 1.5, totalRequests: undefined, timeSeries: [{ time: '2026-01-01T00:00:00+08:00', totalFee: 1.5, totalRequests: undefined, items: [{ name: 'input', usage: { count: 10, unit: 'default' }, fee: 1.5 }] }] }],
    })
  })
})
