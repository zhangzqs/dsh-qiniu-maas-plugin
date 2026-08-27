import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const host = await import('../packages/dsh-qiniu-maas/lib/index.js')
assert.equal(typeof host.apply, 'function', 'host package must export apply')
assert.ok(Array.isArray(host.inject), 'host package must export inject')
assert.equal(typeof host.name, 'string', 'host package must export name')
assert.equal('default' in host, false, 'loader entry must not collapse to a default export')

const clientCode = readFileSync(new URL('../packages/dsh-qiniu-maas/lib/client.js', import.meta.url), 'utf8')
let handoff
vm.runInNewContext(clientCode, {
  window: { __ModuleLoader__: { load: value => { handoff = value } } },
})
assert.equal(handoff.id, '@qiniu/dsh-qiniu-maas', 'client loader id must match package id')
const jsxRuntime = { jsx: () => null, jsxs: () => null, Fragment: Symbol('Fragment') }
const clientExports = handoff.factory(specifier => {
  if (specifier === 'react/jsx-runtime') return jsxRuntime
  throw new Error(`unexpected client external: ${specifier}`)
})
assert.equal(typeof clientExports.apply, 'function', 'client package must export apply')
assert.ok(Array.isArray(clientExports.injectClient), 'client package must export injectClient')
console.log('package smoke: compiled host and loader-compatible client entries')
