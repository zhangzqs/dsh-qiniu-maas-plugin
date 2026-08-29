---
name: dsh-plugin-code-style
description: 编写、重构或审查 DeepSeek Harness（DSH）插件时使用的通用代码规范。涵盖 Host/Client 边界、Cordis 注入与生命周期、React Client 组件、TypeScript 类型、bundle/profile 契约、测试和安全实践；当用户提到 DSH 插件、DeepSeek Harness、Cordis、Client slot、provider、plugin bundle 或要求按官方 Harness 源码实现时，必须使用本 Skill，并按需调用仓库内的 dsh-plugin-development 执行 Skill 和查阅官方 deepseek-harness 源码。
compatibility: 需要访问当前仓库、可用的 DSH 官方源码或其 Git 仓库；涉及浏览器交互时使用仓库已有的 Playwright 能力。
---

# DSH 插件代码规范

本 Skill 负责通用的设计判断和代码风格。它不替代运行时契约文档，也不把某个插件的业务规则写成通用规则。

## 路由到权威资料

在开始实现前先判断任务类型：

- 只涉及本项目业务规则时，读取项目根目录的 `AGENTS.md`，不引入本 Skill 的 DSH 运行时假设。
- 涉及插件加载、Host/Client、bundle、profile、Cordis service、Slot、Conversation Node、Client 构建或真实组合验证时，必须读取仓库内的 `.agents/skills/dsh-plugin-development/SKILL.md`。
- 涉及 React/Next.js 组件、Client 数据获取、渲染性能、重渲染或 bundle 体积时，查阅 Vercel React Best Practices 官方 Skill：<https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices>。如果当前 Agent 环境提供同名执行 Skill，可以按环境的 Skill 解析机制加载；否则直接以该 GitHub 入口为准。
- 不要把某个开发机路径当成插件运行时依赖。
- 遇到官方 API、类型、Slot 名称、构建器或 package manifest 不确定时，查阅 `https://github.com/deepseek-ai/deepseek-harness` 当前源码。优先使用已有官方 checkout；没有时在临时目录浅克隆，不需要为只读取证执行安装。
- 查阅官方源码时先读根 `AGENTS.md`，再读 `packages/README.md` 和目标包的 `README.md`、`src/`、测试。记录 `git rev-parse HEAD`，不要根据旧对话、旧文档或记忆猜测契约。

仓库内执行 Skill 负责“怎么接入 DSH”，React Skill 负责“如何优化 React Client”，官方源码负责“当前 DSH 实际是什么”；本 Skill 负责“如何把代码写得清晰、内聚、可维护”。四者边界不要混淆。

## 设计与边界

- 先列出需求、运行时所有权、可选依赖和验收证据，再选择实现方式。优先最小可用边界，不为猜测的未来需求引入状态框架、全局事件总线或第二套抽象。
- 把插件分成清晰的 Host 和 Client 两半。Host 负责服务、凭证、持久化、工具、HTTP 和业务副作用；Client 负责浏览器 UI、用户交互和 Client slot。不要让 Client 直接依赖 Host 实现，也不要让 Host 引入浏览器专属模块。
- 优先使用 DSH、Cordis 和官方插件已经提供的 service、slot、类型和 UI 组件。跨模块协作通过正式契约完成，不通过深层路径 import、全局变量或隐式单例传值。
- 入口文件只负责注册、依赖注入和组合；业务逻辑放在职责明确的 controller、service、domain helper 或 feature 目录中。
- 一个文件、组件或函数应有一个主要职责。按功能域就近组织目录，例如页面、面板和面板内部组件放在同一棵树中；不要为了形式上的分层建立空泛的 `utils`、`services` 或全局 `components` 目录。
- 只导出真实的模块契约。只使用一次的函数、常量和 Props 类型保持私有；需要跨文件复用时再通过边界清晰的 `index.ts` 导出。

## TypeScript 与命名

- 使用仓库现有的 TypeScript 配置、模块解析和 Prettier/ESLint 规则；先读 `package.json`、`tsconfig*.json` 和 lint 配置，不擅自引入另一套风格。
- 优先使用官方公共类型和 `import type`。外部数据在边界处校验和收窄；不要用 `unknown` 或宽泛的 `Record<string, any>` 掩盖未建模的业务字段。
- 顶层函数和公共 API 显式标注返回类型。普通函数优先使用 `function`；箭头函数用于回调、闭包或需要稳定引用的场景。
- 命名表达业务语义和数据形状：集合用复数，ID 集合明确使用 `Ids`，布尔值使用 `is`/`has`/`should` 前缀。避免用实现状态代替业务实体名称。
- 类型、Props、函数和组件就近放置。单组件文件通常使用 `interface Props`；只有页面组合或跨文件复用时才导出带语义的 Props 别名。
- 避免嵌套三元、隐式转换和过度压缩的一行逻辑。多分支使用清晰的 `if`/`else` 或 `switch`，让错误路径和边界条件可读、可测。

## React Client

- 组件负责渲染和交互，controller/service 负责请求、持久化和副作用。不要在 JSX 中直接编排复杂业务流程。
- 状态放在真正拥有它的最近组件或 controller 中：输入值、菜单开关、详情选择和单次异步 loading 通常不需要提升到页面。只有跨组件共享的业务快照才进入共享 store。
- 通过小而稳定的 Props 组合面板；当 Props 开始传递多个互相关联的字段时，按领域拆成子组件或 view model，而不是继续向下扁平传递。
- 异步事件处理函数可以返回 `Promise<void>`。必须处理 loading、失败和竞态；组件卸载后不能用过期响应覆盖状态。
- 使用官方 DSH UI primitives、图标和交互组件，不重复实现 Button、Input、Menu、Dialog 等通用控件。图标按钮提供 `aria-label` 和必要的 tooltip。
- CSS Module 与所属组件就近放置。样式兼容深色模式、窄屏、键盘焦点和 reduced motion；固定格式的列表、工具栏和面板要有稳定的尺寸与内部滚动边界。
- 用户可见的详情通过明确的点击交互打开 Dialog/Drawer；组件名称必须与实际交互一致。状态颜色需要有足够对比度，图片缺失需要统一占位方案。

## 生命周期与安全

- 所有注入的 service、Slot、route、listener、watcher、timer、DOM 节点、React root、socket 和临时文件都必须有明确的所有权和 disposer。
- 注册前确认依赖已就绪，避免轮询或抢跑初始化；注册函数返回的清理函数由创建方持有并在 fiber dispose 时执行。
- provider、registry 或配置快照更新尽量原子替换；失败时保留上一次有效状态，不把半更新结果暴露给会话。
- 系统边界显式处理 HTTP 错误、响应结构错误、持久化失败和异步 rejection。错误应可诊断但不能泄露凭证、Authorization header、用户隐私或内部路径。
- 不在源码、测试、日志、截图、URL、普通配置或提交历史中写入 API Key、AK/SK、token、密码或其他秘密。敏感值使用 DSH credentials 等专用机制，并遵守最小读取原则。

## 测试与交付

- 纯业务规则使用确定性的单元测试；service/controller 测试依赖注入、错误分支、状态迁移和 disposer；不要只测 happy path 或只验证 mock 被调用。
- 修改 DSH 集成时验证真实 Loader/patch 组合、bundle manifest、Host/Client 入口和模块依赖；不要只用手工 `ctx.plugin()` 证明插件可分发。
- 修改 Client UI 时，在现有环境可用的前提下用 Playwright 做真实浏览器回归，覆盖桌面/窄屏、深色模式、交互、滚动、焦点、控制台错误和 dispose 后清理。
- 构建必须在干净 checkout 中可重复，检查 `exports`、`files`、patch、sourcemap、CSS 资源和 DSH loader 产物是否一致。不要依赖本地遗留 `lib` 或未提交文件。
- 提交前读取项目实际脚本并运行格式检查、Lint、类型检查、测试、构建和与改动相关的集成验证。没有执行的验证不要写进提交或 PR 描述。
- commit、push、发布和 PR 操作需要用户授权；获得授权后仍先核对 `git diff`，确保会话记录、凭证、临时文件和无关改动未被提交。

## 完成前检查

回答或交付前逐项确认：

- 是否读取了仓库内执行 Skill，以及当前官方源码中对应的类型/契约？
- Host、Client、UI、业务逻辑和副作用的所有权是否清楚？
- 是否复用了官方类型和组件，避免了重复抽象和深层耦合？
- 是否覆盖了错误、竞态、卸载清理、窄屏/深色模式和敏感信息边界？
- 是否有与改动范围匹配的测试和真实组合验证？
- 是否只提交了用户要求的文件，并以实际命令结果描述验证状态？
