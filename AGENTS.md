# 项目约定

本文件只记录七牛 MaaS 插件的项目事实和业务约束。通用的 DSH 插件开发、React/TypeScript 代码风格、官方源码取证和生命周期实践，请先阅读：

- `.agents/skills/dsh-plugin-code-style/SKILL.md`
- `.agents/skills/dsh-plugin-development/SKILL.md`

## 项目与包

- 使用 pnpm workspace。Node.js 版本以 `.nvmrc` 为准，包管理器版本以根目录 `package.json` 的 `packageManager` 为准。
- 插件目录为 `packages/dsh-qiniu-maas-plugin`，npm 包名为 `@qiniu/dsh-qiniu-maas-plugin`。
- SDK 目录为 `packages/qiniu-maas-market-sdk`，npm 包名为 `qiniu-maas-market-sdk`。
- `qiniu-maas` 是 DSH 运行时 provider 和 settings namespace 的稳定标识，不随 npm 包或目录重命名改变。
- 插件构建产物必须兼容 DSH loader，并同时维护 Host 入口、Client 入口、`cordis.patch.yml`、`exports` 和分发文件清单的一致性。

## 七牛 MaaS 边界

- SDK 只负责模型市场公开接口、相关模型类型和区域 endpoint 常量，保持浅层封装：不依赖 DSH，不实现推理传输，不保存凭证，不读取环境变量或浏览器存储，不加入无需求的缓存、分页兼容、字段转换或实体映射。
- 模型市场响应只接受 `{ status: true, data: [...] }` 结构，不兼容未约定的数组响应或其他猜测格式。
- 模型市场是公开 GET 接口，可由 Client 直接调用；是否能被浏览器读取取决于服务端 CORS，不能仅凭 GET 方法判断跨域可用性。SDK 不增加额外的后端代理协议。
- 实际模型推理使用 DSH 原生 `llm` provider 机制，不在模型市场 SDK 中实现第二套 Chat Completions、SSE 或流式推理客户端。
- 插件不实现 AK/SK、管理鉴权、MaaS 管理 API、API Key 列表或默认模型。

## 配置与模型行为

- 区域、推理协议和已启用模型 ID 保存在 `qiniu-maas` settings namespace。
- `llm-pi-ai` namespace 只保存派生的 `providers` 配置。插件更新 `providers['qiniu-maas']` 时必须保留其他 provider。
- 用户启用模型后，插件应立即同步 DSH 原生模型列表，使模型无需重启即可出现在会话模型选择器中。具体会话使用哪个模型由该选择器决定。
- “启用/停用”是插件本地状态，不表示远程控制台开通或停用。停用模型应从已启用模型 ID 和 DSH 可选模型列表移除，但不应误删模型市场缓存或其他元数据。
- 当前产品以非空 `suggested_model` 作为模型退役的展示和启用限制依据；该字段表示退役后建议迁移的新模型 ID。退役模型不能被新启用，并应显示迁移警告。
- API Key 只能由用户在设置页面手动输入，并通过 DSH credentials 保存。Client 不读取或回读已保存的完整 API Key，只获取配置状态或提交用户输入。
- 完整 API Key、Authorization header、测试凭证和其他敏感值不得出现在 settings、日志、错误消息、截图、测试快照或提交历史中。

## 当前代码结构

- `src/client/index.ts` 是 Client 入口，只负责 DSH 注册、依赖注入和页面挂载。
- `src/client/controller/` 负责七牛业务动作、模型市场请求、settings 持久化、credentials 和 `llm-pi-ai` provider 同步；页面不直接读取原始 `SettingsScope`。
- `src/client/ui/page/Page.tsx` 组合页面 Header、Tabs 和两个面板：`panels/model-center/` 与 `panels/settings/`。
- 模型中心合并展示模型市场和已启用模型，支持搜索、筛选、排序、模型详情 Dialog 和列表上的启用/停用操作。默认按发布时间倒序排列。
- 设置面板只提供推理 API Key、模型市场区域和推理协议设置。区域变化只刷新模型中心面板，不触发整页刷新。
- 组件专属的 CSS 使用 CSS Module，并与组件文件就近放置；优先使用 DSH 官方 UI primitives、图标和交互组件。
- 涉及 React 组件、数据获取、渲染性能或 bundle 优化时，查阅 [Vercel React Best Practices 官方 Skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)；涉及 DSH runtime 契约时，遵循仓库内 `dsh-plugin-development` Skill，并以 DeepSeek Harness 当前源码为准。
- 用户可见文案使用“七牛 MaaS”“模型中心”“已启用模型”等业务名称；代码命名应明确表达数据形状，例如模型列表使用 `models`，模型 ID 集合使用带 `Ids` 的名称。

## 本地命令

提交或创建 PR 前按实际脚本执行：

```sh
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm build
pnpm test
pnpm typecheck
git diff --check
actionlint .github/workflows/ci.yml
```

根目录脚本的 CI 顺序是安装、格式检查、Lint、构建、测试、类型检查。涉及关键 UI 流程时，在现有环境可用的前提下使用 Playwright 做真实浏览器回归，检查深色模式、窄屏、滚动、焦点、模型图标、详情、启停和会话模型选择器；不要把临时浏览器产物提交。

## Git 与安全

- 分支从最新 `main` 创建，提交保持单一主题，提交前核对完整 diff，确保会话记录、构建产物和无关改动未被加入。
- 未经用户明确授权，不执行 commit、push、发布或修改远程 PR；得到授权后也必须先完成验证。
- PR 标题使用 Conventional Commits 格式，类型前缀使用英文，冒号后的描述使用中文，例如 `docs: 完善项目规范`。
- PR 正文使用中文，说明变更范围、关键设计决策、未改变的边界和实际执行过的验证命令。
- 绝不硬编码 API Key、AK/SK、token、密码或 Authorization header；绝不未经确认删除文件、覆盖用户改动或执行破坏性操作。
