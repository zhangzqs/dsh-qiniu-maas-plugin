# Qiniu MaaS DSH Plugin 裁剪版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现公开模型广场、我的模型、API Key 设置三个 Tab，并让启用模型立即出现在 DSH 原生 `llm` 模型选择列表中。

**Architecture:** `qiniu-maas-model-market` 是无 DSH 依赖的浏览器请求包，只调用公开模型市场 GET 接口。DSH 插件 Host 负责 settings、credentials 和 `LlmAdapter`，Client 负责三 Tab UI；启用模型通过 Host 更新配置并刷新同一个 adapter 的模型目录。

**Tech Stack:** TypeScript, TSX, React, Vitest, DSH Cordis/`@deepseek-ai/dsh-llm`, DSH settings Slots, pnpm workspace.

**Spec:** `docs/superpowers/specs/2026-08-28-qiniu-maas-plugin-design.md`

## Global Constraints

- 模型广场直接访问 `https://api.qnaigc.com/v1/market/models` 或 `https://openai.sufy.com/v1/market/models`。
- 模型广场不携带任何凭证；插件只允许用户手动设置推理 API Key。
- 不实现 AK/SK、API Key 列表、MaaS 管理接口、账单、用量或第二套推理客户端。
- 已启用模型必须通过 DSH 原生 `llm` provider 出现在会话模型选择器中。
- 模型详情使用点击打开的侧面面板，不实现悬浮详情。
- 不保存默认模型；会话模型由用户在会话界面选择。
- 不恢复当前工作区中用户删除的旧 `packages/maas-sdk` 文件。

---

### Task 1: 建立公开模型市场包

**Files:**

- Create: `packages/qiniu-maas-model-market/package.json`
- Create: `packages/qiniu-maas-model-market/tsconfig.json`
- Create: `packages/qiniu-maas-model-market/src/index.ts`
- Test: `packages/qiniu-maas-model-market/tests/index.spec.ts`
- Modify: `pnpm-workspace.yaml`

**Interfaces:**

- Produces `listModels(options?: ModelMarketOptions): Promise<Model[]>`。
- `Model` 至少提供 id、name、description、avatar、tags、features、issuer、constraints、architecture、pricingRules 和 supportApiProtocols。

- [ ] **Step 1: Write failing tests**

测试注入 fetch，断言默认国内 URL、global URL、query 参数、无 Authorization header、响应归一化和非 2xx 错误。

- [ ] **Step 2: Run focused tests and verify the missing export failure**

Run: `pnpm vitest run packages/qiniu-maas-model-market/tests/index.spec.ts`

Expected: FAIL because the package source and `listModels` export do not exist。

- [ ] **Step 3: Implement the minimal package**

实现公开 GET 请求、响应 `data` 校验、字段转换和错误类型；不加入缓存、DSH import 或凭证参数。

- [ ] **Step 4: Run focused tests and typecheck**

Run: `pnpm vitest run packages/qiniu-maas-model-market/tests/index.spec.ts && pnpm exec tsc -p packages/qiniu-maas-model-market/tsconfig.json --noEmit`

Expected: PASS and exit code 0。

### Task 2: 实现 Host 模型配置和 LLM provider

**Files:**

- Create: `packages/dsh-qiniu-maas/package.json`
- Create: `packages/dsh-qiniu-maas/tsconfig.json`
- Create: `packages/dsh-qiniu-maas/src/settings.ts`
- Create: `packages/dsh-qiniu-maas/src/provider.ts`
- Create: `packages/dsh-qiniu-maas/src/host.ts`
- Create: `packages/dsh-qiniu-maas/src/index.ts`
- Test: `packages/dsh-qiniu-maas/tests/provider.spec.ts`

**Interfaces:**

- Host settings namespace stores `{ models: Array<{ id: string; enabled: boolean; contextWindow?: number; maxOutputTokens?: number }> }`。
- Provider adapter implements `listModels(provider)` and `stream(options)` using DSH's native adapter contract。
- RPC exposes model add/update/remove and API Key set/status only; raw API Key never returns to Client。

- [ ] **Step 1: Write failing provider tests**

覆盖空模型、启用模型目录、停用/删除、settings 变更后的原子目录刷新和缺失 API Key 状态。

- [ ] **Step 2: Run focused tests and verify failure**

Run: `pnpm vitest run packages/dsh-qiniu-maas/tests/provider.spec.ts`

Expected: FAIL because the adapter and Host plugin do not exist。

- [ ] **Step 3: Implement settings and provider**

使用 DSH `LlmAdapter`、settings 和 credentials 服务；注册一个固定 Qiniu provider，保留 registration handle，通过 `replace` 更新模型路由。推理请求委托给 Qiniu OpenAI-compatible endpoint，并把 API Key 在请求时从 credentials 解析。

- [ ] **Step 4: Run focused tests and typecheck**

Run: `pnpm vitest run packages/dsh-qiniu-maas/tests/provider.spec.ts && pnpm exec tsc -p packages/dsh-qiniu-maas/tsconfig.json --noEmit`

Expected: PASS and exit code 0。

### Task 3: 实现三个 Tab 和模型详情面板

**Files:**

- Create: `packages/dsh-qiniu-maas/src/client/index.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/ModelMarketplace.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/MyModels.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/SettingsPanel.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/ModelDetailDrawer.tsx`
- Create: `packages/dsh-qiniu-maas/src/client/styles.css`
- Test: `packages/dsh-qiniu-maas/tests/client.spec.tsx`

**Interfaces:**

- Client 直接调用 `listModels()`。
- 模型状态由 settings 中的本地模型集合派生。
- 卡片点击详情按钮打开侧面面板；面板操作调用 Host RPC。

- [ ] **Step 1: Write failing component tests**

覆盖三个 Tab、模型图标/占位图标、未启用/已启用标识、点击打开详情、详情面板启用和 API Key 手动设置。

- [ ] **Step 2: Run focused tests and verify failure**

Run: `pnpm vitest run packages/dsh-qiniu-maas/tests/client.spec.tsx`

Expected: FAIL because the Client components do not exist。

- [ ] **Step 3: Implement the UI**

使用 DSH theme variables 和现有 settings Slot；模型市场使用卡片网格和搜索栏，详情使用可关闭侧面面板，设置页只提供 API Key 密码输入和已配置状态。不要提供默认模型控件、凭证列表或悬浮详情。

- [ ] **Step 4: Run focused tests and typecheck**

Run: `pnpm vitest run packages/dsh-qiniu-maas/tests/client.spec.tsx && pnpm exec tsc -p packages/dsh-qiniu-maas/tsconfig.json --noEmit`

Expected: PASS and exit code 0。

### Task 4: 集成、文档和运行验收

**Files:**

- Modify: `README.md`
- Modify: `cordis.yml`
- Test: `e2e/qiniu-maas.spec.ts`

- [ ] **Step 1: Add mock browser acceptance coverage**

mock 模型市场响应，验证无需 API Key 浏览、点击详情、启用模型、切换 Tab、设置 API Key 和模型出现在 DSH 会话选择列表。

- [ ] **Step 2: Run package tests, typecheck and build**

Run: `pnpm test && pnpm typecheck && pnpm build`

Expected: all commands exit 0。

- [ ] **Step 3: Start DSH Web and inspect with Playwright CLI**

在 `/home/zzq/code/repo/deepseek-ai/deepseek-harness` 执行 `nvm use v24.19.0` 和 `pnpm dsh web`，加载插件后使用 `playwright-cli` 验证三 Tab、详情点击、模型启用和会话模型选择器。

- [ ] **Step 4: Run a real API smoke check without persisting the secret**

仅在运行时通过 Playwright 页面填写用户提供的 API Key，验证一个已启用模型的原生 DSH `llm` 调用；不保存浏览器状态，不打印请求头，不把 Key 写入仓库。
