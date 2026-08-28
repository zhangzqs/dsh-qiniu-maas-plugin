# Qiniu MaaS DSH Plugin

A TypeScript DSH plugin for browsing the public Qiniu MaaS model marketplace, managing enabled models, and exposing those models through DSH's native `llm` provider mechanism.

## Build and Test

```sh
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm package:smoke
```

`package:smoke` builds both workspace packages and imports their compiled host and client entries with plain Node. Generated `lib/` output is ignored and is recreated by `pnpm build`.

## Browser Acceptance Tests

The mock suite intercepts Qiniu marketplace, API-key, and usage requests. It records request URLs and header names plus browser console messages only long enough to assert that credential-bearing query parameters, headers, or log assignments are absent; raw values are never printed or written to artifacts. It also verifies that masked API-key rows disable direct use and expose manual entry without treating the masked value as usable.

```sh
pnpm test:e2e:mock
pnpm test:e2e:qiniu
```

The real suite is opt-in and skips unless `QINIU_MAAS_REAL_E2E=1`, the external runtime credential marker exists at `/home/zzq/.config/dsh/qiniu-maas-e2e.json`, and the DSH GUI has the Qiniu MaaS plugin mounted. The marker is checked with filesystem metadata only: credential injection is performed externally by the runtime, and this repository never reads its contents. Real checks cover the mounted settings controls without filling or printing credential fields. Playwright traces, videos, screenshots, and reports remain disabled by `playwright.config.mts`.


`cordis.yml` is a small composition example that mounts `@qiniu/dsh-qiniu-maas`. Use it as an overlay on a DSH profile that already provides the standard `llm`, settings, credentials, host RPC, and web client Slot services:

```sh
dsh web --patch ./cordis.yml
```

The plugin package is `@qiniu/dsh-qiniu-maas`; its management SDK is `qiniu-maas-sdk`. The package exports compiled JavaScript from `lib/` and a browser companion at `@qiniu/dsh-qiniu-maas/client`.

The SDK exposes `QiniuMaaSClient` for authenticated management calls under `https://api.qiniu.com/ai` and `ModelMarketplaceClient` for the unauthenticated marketplace endpoint `https://api.qnaigc.com/v1/market/models`. Management requests use the documented `Bearer Qiniu <AK>:<HMAC-SHA1>` authorization signature; marketplace requests send no authorization header.

## Authentication

The public marketplace and public model details require no credentials. Users can browse and add model IDs without configuring Qiniu credentials.

AK/SK is optional and is used only for privileged MaaS management operations such as API-key listing and usage/billing data. When AK or SK is absent, those sections report `AK_SK_REQUIRED` and the marketplace remains usable. Credential values are stored through DSH's credential service and are never part of ordinary settings, RPC responses, logs, screenshots, or this repository.

The inference API Key is separate from AK/SK. It is resolved by the plugin at request time through DSH credentials and passed to DSH's native provider pipeline. The MaaS SDK does not implement inference, chat completions, streaming, retries, or a second model client.

## Model Management

Open the Qiniu MaaS settings section to search the marketplace, inspect model details, add a model, and enable or disable saved selections. Settings persist only model IDs, enabled state, the default model, and user overrides such as context window and maximum output tokens. Complete marketplace metadata is refreshed rather than persisted.

API-key rows show non-sensitive metadata only. A masked API-key value cannot be used or stored; enter a complete key manually through the credential action instead.

## Environment and Secrets

`.env.example` lists variable names for local setup documentation only. This plugin does not read Qiniu secrets from environment variables. Configure credentials through DSH's credential store or an explicit, runtime-only integration. Never commit a credential file, Playwright state, test report, or populated `.env`.

The optional real acceptance path is intentionally separate from this packaging task. It must load any local secret file only at test runtime and must keep raw values out of output and artifacts. Mock tests and unit tests do not need Qiniu credentials.

## Limitations

Usage, billing, account, and API-key operations depend on Qiniu's privileged management API and AK/SK. They are not combined with DSH session usage. Missing fields are shown as unavailable, and management failures do not disable saved models or public marketplace browsing.
