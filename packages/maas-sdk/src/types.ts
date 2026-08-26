export interface PublicModel {
  id: string;
  name: string;
  description?: string;
  contextWindow?: number;
  capabilities: string[];
}

export interface ApiKeySummary {
  id: string;
  name?: string;
  status?: string;
  createdAt?: string;
  models?: string[];
  maskedValue?: string;
}

export interface UsageReport {
  start?: string;
  end?: string;
  items: Array<Record<string, string | number | null>>;
}

export interface MaaSClientOptions {
  fetch: typeof globalThis.fetch;
  accessKey?: string;
  secretKey?: string;
}
