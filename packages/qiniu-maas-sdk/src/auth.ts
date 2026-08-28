function base64Url(bytes: ArrayBuffer): string {
  let binary = ''
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Create the documented Qiniu MaaS Bearer signature for an HTTP request. */
export async function createQiniuAuthorization(accessKey: string, secretKey: string, url: string, body = ''): Promise<string> {
  const parsed = new URL(url)
  const signingText = `${parsed.pathname}${parsed.search}\n${body}`
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secretKey), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingText))
  return `Bearer Qiniu ${accessKey}:${base64Url(signature)}`
}
