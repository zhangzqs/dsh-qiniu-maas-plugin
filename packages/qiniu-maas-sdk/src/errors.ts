/** Redacted error raised by the MaaS SDK. */
export class MaaSError extends Error {
  readonly operation: string
  readonly status?: number
  readonly providerCode?: string
  readonly requestId?: string

  constructor(input: { operation: string; message: string; status?: number; providerCode?: string; requestId?: string }) {
    super(input.message.replace(/[\r\n]/g, ' '))
    this.name = 'MaaSError'
    this.operation = input.operation
    this.status = input.status
    this.providerCode = input.providerCode
    this.requestId = input.requestId
  }
}
