import * as AjvModule from 'ajv/dist/2020.js'
import * as FormatsModule from 'ajv-formats/dist/index.js'
import type { ErrorObject, ValidateFunction } from 'ajv'
import createClient, { type Client } from 'openapi-fetch'
import { createQiniuAuthorization } from './auth.js'
import { MaaSError } from './errors.js'
import { operationSchemas, type OperationName } from './generated/operations.js'
import type { paths } from './generated/openapi.js'

type JsonSchema = Record<string, unknown>
type RuntimeOperation = { request?: { query?: JsonSchema; path?: JsonSchema; body?: JsonSchema }; response?: JsonSchema }
type OperationResult = { data?: unknown; error?: unknown; response: Response }
type AjvLike = { compile: (schema: JsonSchema) => ValidateFunction }
const AjvConstructor = (AjvModule as unknown as { default: new (options?: object) => AjvLike }).default
const addFormats = (FormatsModule as unknown as { default: (ajv: AjvLike) => AjvLike }).default

const operations = operationSchemas as Record<OperationName, RuntimeOperation>

function requestError(operation: string, errors: ErrorObject[] | null | undefined): MaaSError {
  const detail = errors?.map(error => `${error.instancePath || '/'} ${error.message ?? 'is invalid'}`).join('; ') || 'request validation failed'
  return new MaaSError({ operation, message: detail })
}

function providerCode(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const record = value as Record<string, unknown>
  for (const key of ['error_code', 'code']) if (typeof record[key] === 'string' || typeof record[key] === 'number') return String(record[key])
  return undefined
}

function requestId(response: Response): string | undefined {
  return response.headers.get('x-reqid') ?? response.headers.get('x-request-id') ?? undefined
}

export interface TransportOptions {
  baseUrl: string
  fetcher?: typeof globalThis.fetch
  accessKey?: string
  secretKey?: string
  signal?: AbortSignal
}

export class MaaSTransport {
  readonly client: Client<paths>
  private readonly fetcher: typeof globalThis.fetch
  private readonly accessKey?: string
  private readonly secretKey?: string
  private readonly signal?: AbortSignal
  private readonly validators = new Map<string, ValidateFunction>()
  private readonly ajv: AjvLike

  constructor(options: TransportOptions) {
    this.fetcher = options.fetcher ?? globalThis.fetch
    this.accessKey = options.accessKey
    this.secretKey = options.secretKey
    this.signal = options.signal
    this.ajv = new AjvConstructor({ allErrors: true, strict: false })
    addFormats(this.ajv)
    this.client = createClient<paths>({ baseUrl: options.baseUrl, fetch: request => this.dispatch(request) })
  }

  async call<T>(operation: OperationName, input: { query?: unknown; path?: unknown; body?: unknown }, request: () => Promise<OperationResult>): Promise<T> {
    const definition = operations[operation]
    this.validate(operation, definition.request?.query, input.query)
    this.validate(operation, definition.request?.path, input.path)
    this.validate(operation, definition.request?.body, input.body)
    let result: OperationResult
    try {
      result = await request()
    } catch {
      throw new MaaSError({ operation, message: 'Qiniu transport request failed' })
    }
    if (!result.response.ok) {
      throw new MaaSError({ operation, status: result.response.status, providerCode: providerCode(result.error), requestId: requestId(result.response), message: `Qiniu request failed (${result.response.status})` })
    }
    const payload = this.normalizePayload(result.data, definition.response)
    this.validate(operation, definition.response, payload)
    return payload as T
  }

  private validate(operation: string, schema: JsonSchema | undefined, value: unknown): void {
    if (!schema || value === undefined) return
    const key = operation + JSON.stringify(schema)
    const validator = this.validators.get(key) ?? this.ajv.compile(schema)
    this.validators.set(key, validator)
    if (!validator(value)) throw requestError(operation, validator.errors)
  }

  private normalizePayload(value: unknown, schema: JsonSchema | undefined): unknown {
    if (schema?.type !== 'object' || typeof value !== 'string') return value === undefined && schema?.type === 'object' ? {} : value
    if (!value.trim()) return {}
    try { return JSON.parse(value) } catch { return value }
  }

  private async dispatch(request: Request): Promise<Response> {
    const headers = new Headers(request.headers)
    headers.set('accept', 'application/json')
    headers.delete('authorization')
    if (this.accessKey && this.secretKey) {
      const body = await request.clone().text()
      headers.set('authorization', await createQiniuAuthorization(this.accessKey, this.secretKey, request.url, body))
    }
    const signedRequest = new Request(request, { headers, signal: request.signal ?? this.signal })
    return this.fetcher(signedRequest)
  }
}
