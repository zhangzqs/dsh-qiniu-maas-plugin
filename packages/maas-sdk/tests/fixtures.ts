export const marketplaceResponse = {
  status: true,
  data: [
    {
      id: 'deepseek-v4-flash',
      name: 'DeepSeek V4 Flash',
      description: 'Fast reasoning model',
      model_constraints: { context_length: 128000, max_tokens: 8192 },
      architecture: {
        input_modalities: ['text'],
        output_modalities: ['text'],
        function_calling: { supported: true },
        reasoning: { supported: true }
      },
      unknown_private_field: 'must not escape'
    }
  ]
};

export const apiKeysResponse = {
  status: true,
  data: [{
    key: 'sk-live***abcd',
    name: 'Production',
    createdAt: '2026-01-01T00:00:00+08:00',
    lastUsed: '',
    enabled: true,
    totalTokens: 1234,
    quota: {
      daily: { enabled: true, used: 12, limit: 100 },
      monthly: { enabled: false, used: 12, limit: -1 },
      total: { enables: true, used: 1234, limit: 10000 }
    }
  }]
};

export const usageResponse = {
  status: true,
  data: [{
    name: 'deepseek-v4-flash',
    items: [{
      name: 'input_tokens', unit: 'k/tokens', total: 4.5,
      values: [{ time: '2026-08-01T00:00:00+08:00', value: 4.5 }]
    }]
  }]
};

export const billResponse = {
  models: [{
    model_id: 'deepseek-v4-flash',
    time_series: [{
      time: '2026-08-01T00:00:00+08:00',
      items: [{ name: 'input_tokens', usage: { count: 4.5, unit: 'k/tokens' }, fee: 0.12, key: 'input' }],
      total_fee: 0.12,
      total_requests: 2
    }],
    total_fee: 0.12,
    total_requests: 2
  }]
};
