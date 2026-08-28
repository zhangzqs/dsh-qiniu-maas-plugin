import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import SwaggerParser from '@apidevtools/swagger-parser'
import openapiTS, { astToString } from 'openapi-typescript'

const root = resolve(new URL('..', import.meta.url).pathname)
const sourcePath = resolve(root, 'openapi.json')
const generatedPath = resolve(root, 'src/generated')
const checkOnly = process.argv.includes('--check')

const source = JSON.parse(await readFile(sourcePath, 'utf8'))
const dereferenced = await SwaggerParser.dereference(source)
const types = astToString(await openapiTS(source))

const names = {
  'put /inapi/v2/apikey/enabled': 'updateApiKeyEnabled',
  'delete /inapi/v2/apikey': 'deleteApiKey',
  'post /inapi/v2/apikey': 'createApiKey',
  'get /inapi/v3/apikeys': 'listApiKeys',
  'put /inapi/v2/apikey/name': 'updateApiKeyName',
  'put /inapi/v2/apikey/quota/{api_key}': 'updateApiKeyQuota',
  'get /inapi/v3/stat/bill': 'getBillByKey',
  'get /inapi/v3/stat/bill/all_keys': 'getBillAllKeys',
  'get /inapi/v3/stat/bill/range': 'getBillByRange',
  'get /inapi/v3/stat/bill/range/all_keys': 'getBillAllKeysByRange',
  'get /inapi/v3/stat/log': 'getLogs',
  'get /inapi/v3/stat/log/detail': 'getLogDetail',
  'get /inapi/v3/stat/new': 'getUsage',
  'get /inapi/v3/market/pricingitems': 'getPricingItems',
  'get /v1/market/models': 'getMarketModels',
}

function schemaForParameters(operation, location) {
  const parameters = (operation.parameters ?? []).filter(parameter => parameter.in === location)
  if (parameters.length === 0) return undefined
  return {
    type: 'object',
    properties: Object.fromEntries(parameters.map(parameter => [parameter.name, parameter.schema ?? {}])),
    ...(parameters.some(parameter => parameter.required)
      ? { required: parameters.filter(parameter => parameter.required).map(parameter => parameter.name) }
      : {}),
  }
}

function successSchema(operation) {
  const response = Object.entries(operation.responses ?? {})
    .find(([status]) => /^2\d\d$/.test(status))?.[1]
  const content = response?.content
  if (!content) return undefined
  return Object.values(content)[0]?.schema
}

const operations = {}
for (const [path, pathItem] of Object.entries(dereferenced.paths ?? {})) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue
    const name = names[`${method} ${path}`]
    if (!name) throw new Error(`Missing generated operation name for ${method.toUpperCase()} ${path}`)
    const body = operation.requestBody?.content?.['application/json']?.schema
    operations[name] = {
      method: method.toUpperCase(),
      path,
      auth: path === '/v1/market/models' ? 'public' : 'management',
      request: {
        query: schemaForParameters(operation, 'query'),
        path: schemaForParameters(operation, 'path'),
        body,
      },
      response: successSchema(operation),
    }
  }
}

const operationSource = `/** Generated from openapi.json. Do not edit manually. */\nexport const operationSchemas = ${JSON.stringify(operations, null, 2)} as const\nexport type OperationName = keyof typeof operationSchemas\n`
const files = {
  'openapi.ts': types,
  'operations.ts': operationSource,
}

if (!checkOnly) await mkdir(generatedPath, { recursive: true })
for (const [name, content] of Object.entries(files)) {
  const target = resolve(generatedPath, name)
  if (checkOnly) {
    try { await access(target) } catch { throw new Error(`Generated file is missing: ${target}`) }
    const current = await readFile(target, 'utf8')
    if (current !== content) throw new Error(`Generated file is stale: ${target}`)
  } else {
    await writeFile(target, content)
  }
}

if (!checkOnly) console.log(`Generated ${Object.keys(files).length} OpenAPI artifacts from ${sourcePath}`)
