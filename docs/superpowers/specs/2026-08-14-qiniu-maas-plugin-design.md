# Qiniu MaaS DSH Plugin Design

## Status

Approved design baseline for implementation planning.

## Goal

Build a persistent TypeScript DSH plugin that exposes Qiniu MaaS management capabilities, lets users browse and enable Qiniu models, and makes enabled models available through DSH's native LLM provider mechanism.

## Scope

The first release includes public model marketplace and model detail browsing; available-model management; optional AK/SK management authentication for privileged operations; API Key listing and selection when supported by the management API; DSH provider registration for enabled Qiniu models; usage presentation with explicit source labels; offline Mock E2E tests; and a real Qiniu Playwright CLI acceptance path.

The MaaS SDK does not implement Chat Completions, SSE, model generation, streaming, retries, session logging, or a second inference client. Actual inference is handled by DSH's existing `llm` provider mechanism.

## Architecture

### `packages/maas-sdk`

A DSH-independent TypeScript management SDK. Public model-marketplace calls send no credentials. Privileged management calls use Qiniu AK/SK signing as required by the supplied OpenAPI operation. Authentication is selected per operation rather than globally.

The SDK receives an injected `fetch` implementation and explicit credential material. It never reads DSH settings, environment variables, browser storage, or credential files. It exposes typed model, API-key, usage, quota, and account resources, plus normalized redacted errors.

### `packages/dsh-qiniu-maas`

A Cordis plugin consuming DSH `llm`, `settings`, `credentials`, and browser Slot services.

The Host half registers the Qiniu configurable provider and model discovery integration, reads configuration through a settings namespace, resolves credentials through DSH credentials at operation time, uses the SDK only for management calls, converts enabled selections into DSH provider/model entries, rebuilds provider snapshots atomically on configuration changes, and exposes package-private JSON RPC for marketplace, API-key selection, usage, and configuration status.

The Client half provides a settings section with credential status, marketplace, model details, available models, API-key management, and usage/account status. It uses additive DSH Slots and never receives raw credentials over RPC.

## Authentication Boundary

| Capability | Authentication |
| --- | --- |
| Model marketplace | None |
| Public model details/listing | None |
| Account, usage, quota, and privileged management operations | AK/SK when required by the OpenAPI operation |
| API-key listing/selection management operations | AK/SK when required by the OpenAPI operation |
| Actual model inference | API Key through DSH's native LLM provider mechanism |

AK/SK is optional. Without it, public marketplace features remain usable and privileged sections show an actionable configuration prompt. API Key is independently optional. Without it, models can be browsed and enabled, but inference remains unavailable until an API Key is configured.

The SDK must follow the exact endpoint-level authentication requirements in the supplied Qiniu MaaS OpenAPI document and must not assume that all operations share one auth mode.

## Settings and Credentials

Settings are the source of truth for routing configuration, not model-detail snapshots. A model selection stores only:

```ts
interface QiniuModelSelection {
  id: string
  enabled: boolean
  contextWindow?: number
  maxOutputTokens?: number
}

interface QiniuSettings {
  models: QiniuModelSelection[]
  defaultModel?: string
}
```

The base URL and endpoint paths come from the OpenAPI definition. They are not user-entered in the first release unless the specification proves an override is required.

Credential records are separate from settings:

- Qiniu access key.
- Qiniu secret key.
- Current inference API Key.

Credential values are never returned by RPC, placed in ordinary settings, logged, captured in screenshots, persisted in Playwright state, or committed to git.

## Model Marketplace Flow

1. Client requests the public model list through Host RPC.
2. Host calls the SDK public model resource without credentials.
3. Client displays searchable model cards and details.
4. The real acceptance path finds `deepseek-v4-flash` by exact model ID returned by the marketplace, not by assuming a display name.
5. User adds a model; Host writes only its ID and user-controlled overrides to settings.
6. Host rebuilds the DSH provider model snapshot.
7. The selected model appears in DSH's existing available-model selector.

Model metadata is refreshed when the page opens or when the user requests refresh. A temporary in-memory cache may avoid duplicate requests, but complete metadata is not persisted in configuration.

## API Key Selection

With AK/SK configured, the settings page loads the MaaS API-key list and displays non-sensitive metadata such as name, status, creation time, and available-model scope. The `Use` action asks the Host to obtain a usable key according to the OpenAPI contract and stores it through DSH credentials.

If the management API returns only a masked value, the masked value is never stored. The UI tells the user to enter the API Key manually. Manual entry remains available as a fallback.

## DSH Provider Integration

The plugin registers a Qiniu configurable provider with DSH's `llm` service and converts enabled selections into DSH model declarations. It does not call the MaaS SDK for inference.

The adapter resolves the current API Key through DSH credentials at request time and delegates generation, streaming, retries, cancellation, usage recording, and error presentation to DSH. Configuration changes rebuild immutable provider snapshots so an in-flight request is not changed by later settings updates. Missing API Key resolution produces a clear missing-credential diagnostic before network I/O.

## Usage and Account Data

Privileged usage, quota, and account calls use AK/SK and are optional UI features. Without AK/SK, the page renders an actionable configuration prompt rather than failing the entire settings page.

The UI distinguishes Qiniu management usage from DSH session usage. Qiniu values are returned by the MaaS management API. DSH session values come from DSH's native inference/provider pipeline. They are never silently combined. Missing fields are shown as unavailable rather than estimated.

## UI Design

The settings page follows a resource-management layout inspired by `dsh-market`: a credential/status header, searchable marketplace, model detail surface, available-model list, API-key management, and usage/account status. It uses DSH theme variables, additive `settings.section` and action Slots, compact cards only for repeated resources, and responsive controls. It does not replace shell root Slots.

## Error Handling

The SDK normalizes non-success responses into typed errors containing operation, HTTP status, provider code when available, request ID when available, and a redacted message. Authorization headers and credential values are excluded from all errors.

Marketplace failures affect only marketplace rendering and leave saved enabled models usable. Management authentication failures affect only management sections. Provider failures use DSH's normal error path.

All Host and Client registrations, RPC handlers, settings observers, timers, and Slot contributions are owned by the plugin Fiber and disposed on stop, update, or removal.

## Testing Strategy

### SDK tests

Use a local HTTP fixture and injected fetch to cover public requests without authorization, AK/SK signing on privileged requests, API-key response normalization, masked-key handling, pagination, malformed payload rejection, usage/quota/account normalization, and redacted non-2xx errors.

### Plugin tests

Use Cordis fakes for settings, credentials, llm, Slots, and RPC to cover provider registration, atomic model updates, missing AK/SK and API Key states, API-key selection, and lifecycle disposal.

### Mock browser E2E

Run with DSH Web and mocked Qiniu endpoints. Verify marketplace access without credentials; model search/detail/refresh; add/enable/disable/remove; user overrides; API-key listing and Use behavior; masked-key safety; usage authentication prompt; enabled model appearance in DSH's selector; and absence of secrets from DOM, console, requests, screenshots, and reports.

### Real Qiniu E2E

The test reads `/home/zzq/.config/dsh/qiniu-maas-e2e.json` only at runtime and never through the coding-agent inspection tools. The file contains only:

```json
{
  "accessKey": "...",
  "secretKey": "...",
  "apiKey": ""
}
```

The test does not use a user-supplied base URL or model ID. It uses the service address from the supplied OpenAPI definition and finds `deepseek-v4-flash` by exact returned model ID.

Using `playwright-cli`, the real test configures AK/SK, loads the marketplace, lists and uses an API Key when possible, adds the target model, and verifies its presence in DSH's available-model selector. It verifies management usage when permitted and accepts a clear permission/configuration error as a tested UI state. A missing secret file skips only the real test; Mock E2E remains mandatory.

The real test must never print credentials, persist Playwright state containing credentials, include secrets in screenshots or reports, or commit the secret file. Temporary state is deleted after the run.

## Deliverables

```text
packages/maas-sdk/
packages/dsh-qiniu-maas/
tests/
e2e/
README.md
package.json
pnpm-workspace.yaml
tsconfig.json
vitest.config.ts
cordis.yml
```

The README documents installation/mounting, authentication boundaries, model management, usage limitations, and Mock/real E2E commands.

## Source of Truth

The Qiniu MaaS OpenAPI document supplied by the user is authoritative for endpoint paths, request/response fields, signing details, API-key management behavior, usage fields, and the exact `deepseek-v4-flash` model identifier.
