# Qiniu MaaS Client Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Qiniu MaaS Client into a feature-oriented, single-responsibility structure while preserving the existing model center behavior and DSH client bundle contract.

**Architecture:** Keep `client/index.ts` as a thin DSH registration entry. Move state creation and side effects into a controller, keep provider/settings transformations in focused modules, and organize UI by model-center feature with reusable model presentation components.

**Tech Stack:** TypeScript, React 18, DSH client runtime `SnapshotStore`, `qiniu-maas-model-market`, Vitest, Playwright, tsdown, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-08-28-qiniu-maas-plugin-design.md`

## Global Constraints

- Preserve the DSH client entry output at `lib/client.js`.
- Preserve the three tabs: model market, enabled models, and settings.
- Preserve direct model-market GET requests through `qiniu-maas-model-market`.
- Preserve `QiniuRegion`, inference protocol selection, API Key storage, and `llm-pi-ai.providers` updates.
- Do not add a new global state library or backend API.
- Do not commit `packages/dsh-qiniu-maas/src/client/` or any test files unless explicitly requested.

---

### Task 1: Extract Client State and Controller

**Files:**

- Create: `packages/dsh-qiniu-maas/src/client/state/qiniu-state.ts`
- Create: `packages/dsh-qiniu-maas/src/client/controller/qiniu-controller.ts`
- Create: `packages/dsh-qiniu-maas/src/client/controller/credentials-controller.ts`
- Create: `packages/dsh-qiniu-maas/src/client/controller/provider-controller.ts`
- Modify: `packages/dsh-qiniu-maas/src/client/index.ts`
- Modify: `packages/dsh-qiniu-maas/src/client/refresh-state.ts`
- Test: `packages/dsh-qiniu-maas/tests/controller.spec.ts`

**Interfaces:**

- `qiniu-state.ts` exports `PiAiSettings`, `QiniuState`, and `QiniuInjected`.
- `qiniu-controller.ts` exports `createQiniuController(ctx, settings, store)` with `refresh`, `saveModels`, `setModelMarketRegion`, and `setInferenceProtocol`.
- `credentials-controller.ts` exports `createCredentialsController(api, store)` with `refresh` and `setApiKey`.
- `provider-controller.ts` exports `settingsWithModels(settings, models, region, protocol)`.

- [ ] Write tests for preserving old models during refresh and for provider updates after enabling a model.
- [ ] Run the controller tests and observe the missing controller exports.
- [ ] Extract the controller code without changing public behavior.
- [ ] Run controller tests, full tests, and typecheck.

### Task 2: Reorganize Model-Center UI by Feature

**Files:**

- Create: `packages/dsh-qiniu-maas/src/client/model-center/market/ModelMarketPanel.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/model-center/market/ModelMarketToolbar.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/model-center/enabled/EnabledModelsPanel.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/model-center/settings/ModelSettingsPanel.tsx`
- Move/refactor: `packages/dsh-qiniu-maas/src/client/model-center/ModelCenter.tsx`
- Move/refactor: `packages/dsh-qiniu-maas/src/client/model-center/ModelTabs.tsx`
- Modify: `packages/dsh-qiniu-maas/src/client/QiniuSettingsSection.tsx`

**Interfaces:**

- `ModelCenter` receives one view model and one actions object.
- Market, enabled-model, and settings panels only receive the data/actions needed by their own feature.
- `ModelTabs` owns only tab selection rendering.

- [ ] Add or update component tests for tab switching and panel rendering.
- [ ] Move search/count, enabled filtering, and settings form into their feature folders.
- [ ] Reduce `ModelCenter` and `QiniuSettingsSection` to composition and DSH adaptation.
- [ ] Run component tests and typecheck.

### Task 3: Consolidate Reusable Model Presentation

**Files:**

- Create: `packages/dsh-qiniu-maas/src/client/model/ModelCard.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/model/ModelAvatar.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/model/ModelDetailDialog.tsx`
- Move CSS Modules beside the new components.
- Modify all panel imports.

**Interfaces:**

- `ModelCard` owns card layout and action callbacks.
- `ModelAvatar` owns image fallback and size variants.
- `ModelDetailDialog` owns only modal presentation and close behavior.

- [ ] Verify card action callbacks and dialog close behavior with component tests.
- [ ] Move components and CSS without changing visual states or labels.
- [ ] Run tests and format checks.

### Task 4: Simplify Entrypoint and Verify Real Client Behavior

**Files:**

- Modify: `packages/dsh-qiniu-maas/src/client/index.ts`
- Modify: `packages/dsh-qiniu-maas/tsdown.config.ts` only if required by moved CSS imports.
- Test: `packages/dsh-qiniu-maas/tests/client.spec.tsx`

- [ ] Confirm the entry only binds DSH services, creates the controller/store, and registers the settings section.
- [ ] Build the DSH client bundle.
- [ ] Start a local DSH-compatible dev environment using the existing project workflow.
- [ ] Use Playwright to verify desktop and mobile layouts, all three tabs, model details, enable/disable actions, API Key settings, region/protocol controls, refresh behavior, and dark mode.
- [ ] Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm format:check`, and the plugin build.
- [ ] Review the final diff and leave Client/test changes uncommitted.
