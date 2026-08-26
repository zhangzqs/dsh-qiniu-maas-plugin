export interface PublicModel {
  id: string;
  name: string;
  description?: string;
  contextWindow?: number;
  maxOutputTokens?: number;
  capabilities: string[];
}

export interface ApiKeyQuota {
  enabled: boolean;
  used: number;
  limit: number;
}

export interface ApiKeySummary {
  name: string;
  createdAt: string;
  lastUsed: string;
  enabled: boolean;
  totalTokens: number;
  maskedValue: string;
  quota: {
    daily: ApiKeyQuota;
    monthly: ApiKeyQuota;
    total: ApiKeyQuota;
  };
}

export interface UsageValue {
  time: string;
  value: number;
}

export interface UsageItem {
  model: string;
  name: string;
  unit: string;
  total: number;
  values: UsageValue[];
}

export interface UsageReport {
  start?: string;
  end?: string;
  items: UsageItem[];
}

export interface UsageParams {
  start?: string;
  end?: string;
  g?: 'month' | 'day' | 'hour' | 'five_minute' | 'minute';
  api_key?: string;
}

export interface BillParams {
  start: string;
  end: string;
  grain: 'month' | 'day' | 'hour' | 'five_minute' | 'minute';
  api_key?: string;
}

export interface BillItem {
  name: string;
  usage: { count: number; unit: string };
  fee: number;
  key?: string;
}

export interface BillTimeSeries {
  time: string;
  items: BillItem[];
  totalFee: number;
  totalRequests?: number;
}

export interface BillModel {
  modelId: string;
  timeSeries: BillTimeSeries[];
  totalFee: number;
  totalRequests?: number;
}

export interface BillReport {
  models: BillModel[];
}

export interface MarketplaceOptions {
  sort?: 'rank' | 'id';
  order?: 'asc' | 'desc';
  overseas?: 'true' | 'false';
  signal?: AbortSignal;
}

export interface MaaSClientOptions {
  fetch: typeof globalThis.fetch;
  accessKey?: string;
  secretKey?: string;
  signal?: AbortSignal;
}
