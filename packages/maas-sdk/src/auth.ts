function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createQiniuAuthorization(
  accessKey: string,
  secretKey: string,
  url: string,
  body = ''
): Promise<string> {
  const parsed = new URL(url);
  const signingText = `${parsed.pathname}${parsed.search}\n${body}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingText));
  return `Qiniu ${accessKey}:${toBase64Url(signature)}`;
}
