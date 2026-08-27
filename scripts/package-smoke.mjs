import assert from 'node:assert/strict'

const host = await import('../packages/dsh-qiniu-maas/lib/index.js')
assert.equal(typeof host.apply, 'function', 'host package must export apply')
assert.ok(Array.isArray(host.inject), 'host package must export inject')
assert.equal(typeof host.name, 'string', 'host package must export name')
assert.equal('default' in host, false, 'loader entry must not collapse to a default export')

const client = await import('../packages/dsh-qiniu-maas/lib/client/index.js')
assert.equal(typeof client.apply, 'function', 'client package must export apply')
assert.ok(Array.isArray(client.injectClient), 'client package must export injectClient')
console.log('package smoke: compiled host and client entries are loader-compatible')
