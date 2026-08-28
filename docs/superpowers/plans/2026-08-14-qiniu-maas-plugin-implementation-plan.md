# Qiniu MaaS DSH Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a TypeScript Qiniu MaaS management SDK and DSH plugin that exposes the public model marketplace, optional AK/SK management features, API-key selection, and enabled Qiniu models through DSH's native `llm` provider mechanism.

**Architecture:** `packages/maas-sdk` is a DSH-independent management client for the OpenAPI server `https://api.qiniu.com/ai`; public marketplace requests are unauthenticated and privileged `/inapi` calls use AK/SK signing. `packages/dsh-qiniu-maas` adapts those management methods to DSH settings, credentials, `llm`, private RPC, and additive settings Slots; actual inference stays inside DSH's provider pipeline and uses the selected API Key.

**Tech Stack:** TypeScript, TSX, pnpm workspace, Vitest, Playwright CLI, DSH Cordis services and Slots, Web Fetch API.

**Spec:** `docs/superpowers/specs/2026-08-14-qiniu-maas-plugin-design.md`

## Global Constraints

- The SDK covers MaaS management APIs only. Actual model inference uses DSH's native `llm` provider mechanism.
- Public model-marketplace APIs are unauthenticated; privileged management APIs use AK/SK; inference uses API Key.
- Settings persist model IDs, enabled state, and user overrides, not complete model-detail snapshots.
- Credential values never appear in ordinary settings, RPC responses, logs, screenshots, Playwright state, reports, or git.
- The real E2E reads `/home/zzq/.config/dsh/qiniu-maas-e2e.json` only at runtime and never through coding-agent inspection tools.
- The real E2E uses the OpenAPI server and finds `deepseek-v4-flash` by exact returned model ID.
- Use `dsh-market` as a layout and information-density reference without copying its code or branding.
- Compile plugin output to JavaScript compatible with the DSH loader/runtime.

---

### Task 1: Workspace and SDK Contract

**Files:**

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `packages/maas-sdk/package.json`
- Create: `packages/maas-sdk/tsconfig.json`
- Create: `packages/maas-sdk/src/types.ts`
- Create: `packages/maas-sdk/src/errors.ts`
- Create: `packages/maas-sdk/src/auth.ts`
- Create: `packages/maas-sdk/src/client.ts`
- Create: `packages/maas-sdk/src/index.ts`
- Test: `packages/maas-sdk/tests/client.spec.ts`

**Interfaces:**

- Produces `MaaSClient`, `MaaSClientOptions`, `PublicModel`, `ApiKeySummary`, `UsageReport`, `MaaSError`, and explicit public/management request methods for later plugin tasks.

- [ ] Write failing tests for `GET /v1/market/models` without an Authorization header, typed normalized model output, and a privileged request receiving an AK/SK-generated Authorization value.
- [ ] Run `pnpm vitest run packages/maas-sdk/tests/client.spec.ts` and confirm failure because the SDK does not exist.
- [ ] Define the package scripts, strict TypeScript configuration, typed DTOs, redacted `MaaSError`, and injected-fetch client surface. Keep the server root constant at `https://api.qiniu.com/ai` and expose no chat/inference method.
- [ ] Implement the minimum public model request and AK/SK signing request needed by the tests, using the exact OpenAPI path `/v1/market/models`.
- [ ] Run the focused test and then `pnpm -r typecheck`; confirm both pass.
- [ ] Commit as `feat: add qiniu maas management sdk foundation`.

### Task 2: Complete MaaS Management Resources

**Files:**

- Modify: `packages/maas-sdk/src/client.ts`
- Modify: `packages/maas-sdk/src/types.ts`
- Modify: `packages/maas-sdk/src/index.ts`
- Modify: `packages/maas-sdk/tests/client.spec.ts`
- Create: `packages/maas-sdk/tests/fixtures.ts`

**Interfaces:**

- Consumes `MaaSClient` and auth types from Task 1.
- Produces `listApiKeys()`, `getUsage(params)`, `getBill(params)`, `getModelDetails(id)`, and model normalization used by the plugin.

- [ ] Add failing fixture-backed tests for `GET /inapi/v3/apikeys`, `GET /inapi/v3/stat/new`, `GET /inapi/v3/stat/bill/range`, and model marketplace pagination/filter parameters.
- [ ] Run the focused SDK tests and confirm the new methods fail before implementation.
- [ ] Implement exact OpenAPI query parameters: `start`, `end`, `g`, `api_key`, `month`, `grain`, `sort`, `order`, and `overseas`; normalize API-key metadata, usage items, billing series, and model capabilities without preserving unknown live response objects.
- [ ] Add HTTP status/code/request-id normalization and ensure thrown messages never include request headers or credential values.
- [ ] Run all SDK tests and typecheck; confirm pass.
- [ ] Commit as `feat: implement qiniu maas management resources`.

### Task 3: DSH Host Provider and Settings

**Files:**

- Create: `packages/dsh-qiniu-maas/package.json`
- Create: `packages/dsh-qiniu-maas/tsconfig.json`
- Create: `packages/dsh-qiniu-maas/src/settings.ts`
- Create: `packages/dsh-qiniu-maas/src/provider.ts`
- Create: `packages/dsh-qiniu-maas/src/host.ts`
- Create: `packages/dsh-qiniu-maas/src/index.ts`
- Create: `packages/dsh-qiniu-maas/tests/provider.spec.ts`

**Interfaces:**

- Consumes `MaaSClient` from `@qiniu/maas-sdk` and DSH `llm`, `settings`, and `credentials` service contracts.
- Produces a Cordis plugin that registers one Qiniu configurable provider, model discovery, settings namespace, and private RPC methods for marketplace/configuration operations.

- [ ] Add failing provider tests using service fakes for empty enabled models, enabled model materialization, user context/output overrides, missing API Key, and atomic replacement after settings updates.
- [ ] Run provider tests and verify they fail for absent plugin code.
- [ ] Implement the settings schema containing `models` and `defaultModel`; keep credentials in three separate DSH credential references for AK, SK, and inference API Key.
- [ ] Register the Qiniu provider with DSH `llm`; resolve the inference API Key at request time and route actual generation through DSH's existing provider adapter contract, without calling `MaaSClient` for inference.
- [ ] Add public marketplace RPC, model detail RPC, API-key list/use RPC, usage RPC, and redacted credential-status RPC. Management RPCs return an explicit `AK_SK_REQUIRED` result when AK/SK is absent.
- [ ] Register model discovery against the public marketplace endpoint and rebuild immutable provider/model snapshots when settings change.
- [ ] Run provider tests, SDK tests, and typecheck; confirm pass.
- [ ] Commit as `feat: register qiniu models with dsh llm`.

### Task 4: Settings UI and Model Marketplace

**Files:**

- Create: `packages/dsh-qiniu-maas/src/client/SettingsPage.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/ModelMarketplace.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/ApiKeyPanel.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/UsagePanel.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/styles.ts`
- Modify: `packages/dsh-qiniu-maas/src/index.ts`
- Create: `packages/dsh-qiniu-maas/tests/ui-models.spec.tsx`

**Interfaces:**

- Consumes Host RPC JSON from Task 3 and DSH Client `slots`, `theme`, and timer services.
- Produces a `settings.section` contribution with marketplace, detail, available-model list, API-key management, and usage/account sections.

- [ ] Add failing component tests for unauthenticated marketplace rendering, exact model add/enable/disable/remove flow, user override editing, AK/SK-required usage state, API-key list/use state, and masked-key refusal.
- [ ] Run the focused UI tests and confirm failure before implementation.
- [ ] Implement TSX with `React.createElement` or project-supported TSX compilation, using queried additive Slots and no shell-root replacement. Keep raw credential inputs transient and send only explicit Host credential operations.
- [ ] Render model cards with search/filter, detail metadata, capability badges, context/pricing fields, and an `Add` action. Render enabled selections separately with controls for enable state, removal, context window, and max output tokens.
- [ ] Render API Key rows with non-sensitive metadata and a `Use` action; show manual entry when the API returns only a masked value. Render usage/account panels with explicit loading, unavailable, AK/SK-required, error, and success states.
- [ ] Add package-local CSS using DSH theme variables and responsive dimensions, following `dsh-market` information density without copying its source or branding.
- [ ] Run UI tests, typecheck, and compile the client bundle.
- [ ] Commit as `feat: add qiniu maas settings marketplace ui`.

### Task 5: Packaging, Composition, and Documentation

**Files:**

- Create: `cordis.yml`
- Create: `README.md`
- Create: `.env.example`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**

- Consumes built SDK/plugin packages from Tasks 1-4.
- Produces documented install/build commands and a DSH composition example that mounts the plugin without embedding secrets.

- [ ] Add a packaging smoke test or script that imports the compiled plugin entry and confirms it exports a Cordis plugin factory.
- [ ] Run the smoke test before adding documentation and confirm it fails until package exports/build scripts are complete.
- [ ] Add build/typecheck/test scripts, package exports, and a `cordis.yml` row using the repository's actual package names and loader-compatible compiled output.
- [ ] Document public marketplace auth, optional AK/SK management auth, API Key inference auth, model enabling, usage limitations, and secret-file handling.
- [ ] Ensure `.env.example` contains names only and `.gitignore` excludes Playwright state, reports, credentials, and generated artifacts.
- [ ] Run the packaging smoke test, full unit suite, and build.
- [ ] Commit as `chore: package qiniu maas dsh plugin`.

### Task 6: Mock Browser E2E

**Files:**

- Create: `e2e/mock-qiniu-maas.spec.ts`
- Create: `e2e/mock-server.ts`
- Create: `playwright.config.ts`
- Modify: `package.json`

**Interfaces:**

- Consumes the mounted plugin and compiled Web app from Task 5.
- Produces a deterministic browser acceptance suite using mocked public and management endpoints.

- [ ] Write failing Playwright tests for marketplace-without-credentials, model add/edit/disable/remove, API-key list/use, masked-key refusal, AK/SK-required usage prompt, and model selector appearance.
- [ ] Run `pnpm test:e2e:mock` and verify failure because the browser flow is not implemented.
- [ ] Implement route mocks matching the exact OpenAPI paths and response shapes, then drive the settings page through `playwright-cli`-compatible Playwright commands.
- [ ] Add assertions that raw AK, SK, and API Key values never appear in DOM text, console messages, request URLs, screenshots, or test report attachments.
- [ ] Run the complete Mock E2E suite and confirm pass.
- [ ] Commit as `test: add qiniu maas mock browser acceptance`.

### Task 7: Real Qiniu Playwright Acceptance

**Files:**

- Create: `e2e/qiniu-real.spec.ts`
- Modify: `playwright.config.ts`
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `docs/e2e/qiniu-real-runbook.md`

**Interfaces:**

- Consumes the real plugin UI and the runtime-only secret file `/home/zzq/.config/dsh/qiniu-maas-e2e.json`.
- Produces an opt-in real acceptance command that targets the OpenAPI server and selects `deepseek-v4-flash` by exact returned model ID.

- [ ] Add a guarded test that skips with an explicit reason when the secret file is absent, while never printing its contents.
- [ ] Run the guarded test without exposing the secret file and confirm the skip/guard behavior.
- [ ] Implement runtime-only credential loading, AK/SK setup, marketplace loading, API-key listing and `Use` flow when usable key material is available, model selection, add-to-available-list, DSH model selector assertion, and optional usage verification.
- [ ] Use `playwright-cli` for the browser run, collect only redacted status, and delete temporary browser state and reports containing sensitive form history after completion.
- [ ] Run `pnpm test:e2e:qiniu` with the provided file, then run the Mock E2E and full unit suite again.
- [ ] Commit as `test: add real qiniu maas acceptance path`.

### Task 8: Whole-Branch Review and Verification

**Files:**

- Modify only files required by review findings.

- [ ] Run `pnpm test`, `pnpm typecheck`, and `pnpm build` from a clean working tree and record exit codes and counts.
- [ ] Run Mock E2E and the real Qiniu E2E with browser console/network inspection; confirm no sensitive values are emitted.
- [ ] Review the implementation against every section of `docs/superpowers/specs/2026-08-14-qiniu-maas-plugin-design.md`, especially authentication separation and SDK non-inference scope.
- [ ] Inspect `git diff --check`, `git status`, and tracked file list to ensure the sensitive file and generated reports are absent.
- [ ] Commit any final review fixes and document residual limitations in README.
