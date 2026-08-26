# Task 3 Report

Status: complete

Implemented `packages/dsh-qiniu-maas` with:

- settings schema for `models` and `defaultModel`
- separate AK, SK, and inference API Key credential references
- immutable enabled-model snapshots and atomic replacement
- DSH adapter-shaped provider with request-time API Key resolution and native delegate boundary
- public marketplace model discovery
- private marketplace, model detail, API-key list/use, usage, settings, and redacted credential-status RPCs
- Fiber-owned RPC cleanup
- isolated provider tests covering empty models, enabled materialization, overrides, missing API Key, and atomic replacement

TDD evidence: focused provider tests were run RED before production source existed, then GREEN.

Verification:

- `pnpm test`: 3 files, 20 tests passed
- `pnpm exec vitest run packages/dsh-qiniu-maas/tests/provider.spec.ts`: 5 tests passed
- `pnpm typecheck`: passed
- `git diff --check`: passed

## Final Host Wiring Verification

- `pnpm test`
  - `Test Files 3 passed (3)`
  - `Tests 20 passed (20)`
- `pnpm exec vitest run packages/dsh-qiniu-maas/tests/provider.spec.ts`
  - `Test Files 1 passed (1)`
  - `Tests 5 passed (5)`
- `pnpm typecheck`
  - `packages/maas-sdk typecheck: Done`
  - `packages/dsh-qiniu-maas typecheck: Done`
- `git diff --check`
  - no output; exit code 0

Host wiring cleanup retains and disposes settings watchers, model discovery, provider registrations, configurable-provider registrations, and private RPC handlers. Host compile-error follow-up:

- The reported `src/host.ts:109` out-of-scope `settings` reference was already corrected to `args.settings` with the service held as `settingsService`.
- `pnpm test`: `Test Files 3 passed (3)`, `Tests 20 passed (20)`.
- `pnpm -r typecheck`: `packages/maas-sdk typecheck: Done`; `packages/dsh-qiniu-maas typecheck: Done`.
- `git diff --check`: no output, exit code 0.

## Commit Verification

- Command: `pnpm test`
  - Output: `Test Files 3 passed (3)`; `Tests 20 passed (20)`
- Command: `pnpm -r typecheck`
  - Output: `packages/maas-sdk typecheck: Done`; `packages/dsh-qiniu-maas typecheck: Done`
- Command: `git diff --check`
  - Output: no output; exit code 0
- Task 4/UI was not started.

## Task 3 Review-Fix Report

Fixed all Task 3 review findings:

- Removed the plaintext API-key RPC; inference API keys remain credential-service-only and are resolved at request time.
- Made `llm` a hard plugin dependency via `inject: ['llm']` and use the injected `ctx.llm` service.
- Made model resolution advisory: unknown model IDs retain provider/model identity for the native provider boundary.
- Added settings watcher and scope disposal, plus cleanup for configurable-provider, adapter, discovery, and RPC registrations.
- Added provider filtering and propagated discovery request cancellation signals through the MaaS SDK fetch call.
- Added structural validation for model-details, usage, and settings RPC payloads before network or settings operations.
- Completed the settings schema with model item fields, required fields, non-empty strings, and positive numeric constraints.
- Unified management/discovery fetch selection and typed the native delegate boundary without `any` casts.
- Kept the MaaS SDK limited to management APIs; inference continues through the native DSH delegate.
- Retained `tests/host.spec.ts` with service-fake apply coverage for lifecycle cleanup, payload validation, discovery cancellation/provider filtering, schema constraints, and absence of the secret RPC.

Review-fix verification:

- `pnpm test`: 4 files, 25 tests passed
- `pnpm exec vitest run packages/dsh-qiniu-maas/tests/host.spec.ts`: 1 file, 5 tests passed
- `pnpm -r typecheck`: `packages/maas-sdk` and `packages/dsh-qiniu-maas` passed
- `git diff --check`: passed

## Task 3 Review-Fix Final Report

- Host service tests: `packages/dsh-qiniu-maas/tests/host.spec.ts`, 6 tests passed.
- Full test suite: `pnpm test`, 4 files and 26 tests passed.
- Recursive typecheck: `pnpm -r typecheck`, `packages/maas-sdk` and `packages/dsh-qiniu-maas` passed.
- Formatting check: `git diff --check` passed.

## Task 3 Review-Fix Commit Report

- Full verification: `pnpm test` passed 4 files and 25 tests.
- Recursive typecheck: `pnpm -r typecheck` passed.
- Diff validation: `git diff --check` passed.
- Committed files include the six Task 3 source/package files and `packages/dsh-qiniu-maas/tests/host.spec.ts`.
- `packages/dsh-qiniu-maas/tests/provider.spec.ts` remains unchanged.
