# Task 2 Report: Complete MaaS Management Resources

## Result

Implemented and committed Task 2 as:

- Commit: `feat: implement qiniu maas management resources`
- Scope: `@qiniu/maas-sdk` management resources only

The SDK now provides public marketplace options and model-detail filtering, API-key listing, usage retrieval, and range billing retrieval. It does not add account endpoints or inference methods.

## Implemented

- `listModels(options)` serializes the documented public `sort`, `order`, and `overseas` query options, sends no Authorization header, consumes the public `data` array response, and returns owned normalized model metadata.
- `getModelDetails(id)` filters the public model list because the supplied API has no model-detail endpoint.
- `listApiKeys()` calls `GET /inapi/v3/apikeys` with AK/SK signing and normalizes masked key metadata and daily/monthly/total quotas, including the OpenAPI `total.enables` spelling.
- `getUsage(params)` calls `GET /inapi/v3/stat/new` with exact `start`, `end`, `g`, and `api_key` parameters and flattens model usage items into owned DTOs.
- `getBill(params)` calls `GET /inapi/v3/stat/bill/range` with exact `start`, `end`, `grain`, and optional `api_key` parameters and normalizes billing models, series, items, fees, and request counts.
- Model capability normalization derives owned capability strings from architecture modalities and supported function-calling/reasoning flags; unknown response fields are discarded.
- Structured provider failures expose only operation, HTTP status, provider code, and request ID with a constant redacted message. Credential/header/response secrets are not copied into thrown errors.
- Added exported DTO and parameter types in `src/types.ts` and `src/index.ts`.

## TDD Evidence

1. Added the resource contract tests to `packages/maas-sdk/tests/resources.spec.ts`; `packages/maas-sdk/tests/client.spec.ts` was updated only for the authoritative marketplace `data: [...]` fixture and the obsolete-shape regression while retaining the existing Task 1 assertions.
2. Ran the required RED test before production edits:

   `pnpm exec vitest run packages/maas-sdk/tests/resources.spec.ts`

   Result: 1 failed file, 6 passed tests, 1 failed test. The failure was the expected unmasked full API key in the DTO.

3. Ran the client regression test after adding the obsolete-shape assertion; it failed because the implementation still accepted `data.items`.
4. Implemented the resource methods and normalization.
5. Focused GREEN resource run passed with 7 tests.

## Verification

- `pnpm exec vitest run packages/maas-sdk/tests/resources.spec.ts`: 1 file, 7 tests passed.
- `pnpm exec vitest run packages/maas-sdk/tests/client.spec.ts`: 1 file, 8 tests passed; existing Task 1 assertions retained.
- `pnpm test`: 2 files, 15 tests passed.
- `pnpm -r typecheck`: passed for `@qiniu/maas-sdk`.
- `git diff --check`: passed.

The existing untracked `packages/maas-sdk/tests/fixtures.ts` was validated, used by the new resource tests, and included in the Task 2 commit. The prohibited credential configuration file was not read.

## Continuation Regression Fix

The checkout already contained the Task 2 implementation at commit `5e26c30`. An additional contract test was added in `packages/maas-sdk/tests/resources.spec.ts` for provider codes returned in non-success JSON response bodies.

TDD evidence:

- RED: the new test failed 1/7 with HTTP 429 producing `providerCode: undefined` instead of `QUOTA_EXCEEDED`.
- GREEN: the client now reads only the provider-code fields (`code`, `error_code`, or `errorCode`) from a cloned JSON error body, while retaining a constant redacted message and excluding body text.
- Focused resources test: 7/7 passed.
- Existing client test: 8/8 passed; Task 1 assertions retained.
- Recursive typecheck: passed.

## Fix Verification

- Full `sk-live-super-secret-abcd` fixture is normalized to `sk-live***abcd`; neither the returned DTO nor `JSON.stringify` contains the full key.
- Billing test asserts the exact encoded `start`, `end`, `grain`, and `api_key` query and the signed `Authorization` header.
- Marketplace tests use authoritative `data: [...]` and reject the obsolete `data.items` response shape.
- Final suite count is 7 resource tests and 15 total tests.
- `pnpm -r typecheck` passed.
- `git diff --check` passed.

## Independent Verification Follow-up

Independent verification reported the baseline Task 2 suite at 14/14 tests passing, recursive typecheck passing, and `git diff --check` passing before this report update.

## Final Review-Fix Verification

- `pnpm exec vitest run packages/maas-sdk/tests/resources.spec.ts`: 1 file, 7 tests passed.
- `pnpm exec vitest run packages/maas-sdk/tests/client.spec.ts`: 1 file, 8 tests passed.
- `pnpm test`: 2 files, 15 tests passed.
- `pnpm -r typecheck`: passed.
- `git diff --check`: passed.
