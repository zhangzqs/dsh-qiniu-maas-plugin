# 项目开发规范

本文件是本仓库后续开发、重构和代码审查的共同约定。项目级约定优先于个人习惯；如果工具链或 DSH 官方契约发生变化，应先更新本文件，再修改代码。

## 基本原则

- 使用 KISS：优先选择最简单、可读、可验证的方案。
- 使用 YAGNI：只实现当前需求，不为猜测中的未来需求预留复杂抽象。
- 使用 DRY：复用已有类型、组件和工具函数；只有在抽象能消除真实重复时才新增抽象。
- 遵循 SOLID：每个模块保持单一职责，通过清晰的类型和接口协作。
- 变更保持最小化、可独立验证，不借机进行无关重构。
- 先阅读现有实现、官方类型和构建配置，再决定代码结构；不要根据名称或旧文档臆造运行时契约。

## 工作区与包边界

- 使用 pnpm workspace。Node.js 版本以 `.nvmrc` 为准，包管理器版本以根目录 `package.json` 的 `packageManager` 为准。
- 插件包为 `packages/dsh-qiniu-maas-plugin`，npm 包名为 `@qiniu/dsh-qiniu-maas-plugin`。
- SDK 包为 `packages/qiniu-maas-market-sdk`，npm 包名为 `qiniu-maas-market-sdk`。
- `qiniu-maas` 是运行时 provider 和设置 namespace 标识。它表达 DSH 中的运行时身份，不随 npm 包或目录重命名而改变。
- SDK 与 DSH 插件保持独立。插件调用 SDK，不把模型市场的 HTTP 传输逻辑复制进插件。
- SDK 只负责模型市场公开接口、相关模型类型和区域 endpoint 常量，保持浅层封装：不依赖 DSH，不实现推理传输，不保存凭证，不读取环境变量或浏览器存储，不加入无需求的缓存、分页兼容、字段转换或实体映射。
- 模型市场响应只接受明确的 `{ status: true, data: [...] }` 结构。不要为了兼容猜测的数组响应或未约定的响应形态。
- 模型市场是公开 GET 接口，可以由 Client 直接调用；但是否允许浏览器读取取决于服务端 CORS 响应，不能仅凭 GET 方法判断跨域可用性。服务端未提供 CORS 时，应通过已有 Host 能力解决，不在 SDK 中偷偷增加第二套代理协议。
- 实际模型推理使用 DSH 原生 `llm` provider 机制。插件不在模型市场 SDK 中实现第二套 Chat Completions、SSE 或流式推理客户端。

## DSH 集成与数据职责

- 插件自己的区域、推理协议和已选择的模型 ID 保存在 `qiniu-maas` settings namespace。
- `llm-pi-ai` namespace 只维护派生的 `providers` 配置。插件根据自己的 settings 生成或更新 `providers['qiniu-maas']`，不得把七牛私有配置塞进该 namespace。
- 更新七牛配置时只替换自己的 provider 条目，必须保留其他 provider 配置。
- 模型广场负责发现模型；用户启用模型后，插件应立即将其同步到 DSH 原生模型列表，使模型无需重启即可出现在会话选择器中。
- 插件不保存默认模型。具体会话使用哪个模型由 DSH 会话界面的模型选择器决定。
- “启用/停用”是插件本地状态，不表示远程 MaaS 控制台的开通或停用。停用模型应从本地已启用模型 ID 和 DSH 可选模型列表中移除，但不应误删模型市场缓存或其他模型元数据。
- 当前产品以非空 `suggested_model` 作为模型已退役的展示和启用限制依据；该字段本身表示退役后建议迁移的新模型 ID。退役模型不能被新启用，并应向用户展示迁移警告。
- API Key 只允许用户在设置页面手动输入，并通过 DSH credentials 保存。插件不实现 AK/SK、管理鉴权、API Key 列表或完整密钥展示。
- Client 不读取或回读已保存的完整 API Key；用户输入只通过 credentials 的保存动作提交，配置状态通过 credentials 查询获得。错误信息、日志、截图和测试产物中不得出现密钥、Authorization header 或其他敏感值。

## TypeScript 规范

- SDK 和插件源码统一使用 TypeScript/TSX；React 组件使用 `.tsx`。
- TypeScript/JavaScript 字符串统一使用单引号，由 Prettier 负责格式化；JSX 属性遵循当前 Prettier 配置使用双引号。
- 优先使用 `import type`，让运行时依赖和类型依赖清晰可见。
- 优先复用 DSH 官方导出的类型，例如 `@deepseek-ai/dsh-llm-pi-ai` 的配置和模型类型；不要重复手写同义的公共类型。
- 相对导入遵循当前 TypeScript 配置，源码使用 `.ts`/`.tsx` 扩展名并交给 `rewriteRelativeImportExtensions` 生成可运行产物；不要仅凭 Node 运行时直觉改成 `.js`。
- 顶层函数、导出的函数和公共回调显式标注返回类型；类型能从上下文自然推导且不会影响公共契约时，可以保留推导。
- 普通函数优先使用 `function` 声明；只有需要闭包、回调或稳定引用时才使用箭头函数。
- 避免嵌套三元表达式、密集的一行逻辑和隐式类型转换；多分支逻辑使用清晰的 `if`/`else` 或 `switch`。
- 函数和类型就近放置，按职责拆分文件。只使用一次且不会降低可读性的逻辑不要强行抽象。
- 默认不导出实现细节。单文件私有函数保持私有；只有存在跨文件复用或明确公共契约时才 `export`。
- `index.ts` 作为模块边界的集中导出入口，避免从多个内部路径暴露同一实现。
- 不使用 `unknown` 逃避建模。外部 API 的确未定义字段可以保留 `unknown`，但应在边界处说明原因，并在实际使用前完成类型收窄。

## 命名规范

- 命名优先表达业务语义，而不是当前实现方式或某个 UI 状态。
- 集合使用复数名词：`models` 表示模型列表，避免使用含义过窄的 `market`。
- ID 集合明确带上 `Ids`，例如 `modelIds`；不要用 `enabledIds` 这类无法说明 ID 对象的缩写。只有确实表达状态时才使用 `enabled`，模型列表业务概念应使用“已启用模型”等清晰名称。
- 组件名称、文件名和目录名必须与职责一致：详情对话框命名为 `Dialog`，不要命名为 `Drawer`；模型市场与已启用模型合并时使用 `model-center`，只有真正独立的功能域才使用 `model-market`，不要使用含义模糊的 `market`。
- 页面组件使用 `Page`，模型管理面板使用 `ModelCenterPanel`，设置面板使用 `SettingsPanel`；不要为了层级或实现细节添加多余的 `Model`、`Center`、`Manager` 后缀。
- 单组件文件中的 Props 类型通常就近命名为 `interface Props`。只有需要被页面组合或跨文件复用时才导出，并通过有语义的别名导入。
- 布尔值使用 `is`、`has`、`should` 等前缀表达判断语义；不要让 `enabled` 同时承担业务实体名和布尔状态名。
- 常量只在跨文件复用时提升到独立文件；只使用一次的常量就近定义。常量文件名必须反映内容，不要用 `config` 掩盖实际上只是协议、URL 或常量的文件。
- 设置读取和写入方法使用一致的动词体系，并明确对象范围，例如读取/更新设置、保存 API Key、设置模型 ID 列表。避免 `setModels` 同时表示“获取市场模型”和“保存已启用模型”。

## React 与 UI 规范

- Client 入口只负责 DSH 注册、依赖注入和页面挂载；不在入口中实现模型请求、设置读写或 provider 组合逻辑。
- Controller 负责请求、业务动作、设置持久化、provider 同步和副作用；UI 组件负责展示与交互，不直接承担复杂业务逻辑。
- 设置读写应内聚在对应的 settings controller 中；provider 配置生成应内聚在 provider controller 中；页面不应跨层读取原始 `SettingsScope`。
- 共享快照用于跨组件共享的业务状态；组件内部的输入值、详情选择、菜单开关和单次异步 loading 状态优先由拥有该交互的组件维护，避免无必要地提升到父组件。
- 异步事件处理函数可以直接返回 `Promise<void>`。loading、错误和清理逻辑应由实际拥有该动作的组件或 controller 管理，减少父子之间的大型 Props 对象。
- Props 与组件就近定义。页面需要组合多个面板时，可以按领域导出 `ModelCenterPanelProps`、`SettingsPanelProps` 等复用类型，不要把所有字段扁平传递给更深层组件。
- 组件按功能域组织，优先“页面 -> 面板 -> 面板内部组件”的树形结构。不要为了形式上的分层建立横向的 `components`、`hooks`、`services` 大目录，也不要把只属于一个面板的组件放到全局目录。
- CSS Module 与组件文件跟随放置，样式只服务于所属组件；优先复用 DSH 官方 UI 组件和现有设计 token，避免重复手写按钮、菜单、输入框和通用交互样式。
- 使用官方 DSH UI 组件库提供的 Button、Input、Menu 等控件；工具按钮使用现成图标并提供 `aria-label`/`title`，熟悉的操作优先使用图标表达。
- 详情信息通过点击打开对话框；详情对话框只展示模型信息，启用/停用操作放在模型列表卡片上。
- 模型广场和已启用模型列表统一展示模型图标；图片缺失或加载失败时使用统一占位。图标图片背景固定为白色，避免深色模式下透明图标底色异常。
- UI 必须兼容深色模式、窄屏和键盘操作。使用 `:focus-visible`、合理的 `aria-*`、Escape 关闭、reduced motion 等无障碍行为。
- 区域或协议切换只刷新受影响的模型中心面板，不触发整页刷新。刷新按钮使用图标并靠右放置，不显示会让用户误以为页面卡死的全局加载状态。
- 模型列表的内容区域独立滚动，不影响上方标题、筛选、排序和设置区域。工具栏、筛选和排序控件尽量保持单行，并通过下拉多选承载不断增加的筛选条件。
- 模型列表默认按发布时间倒序，排序和筛选逻辑保持为可测试的纯函数。筛选结果数量、空状态、加载状态和错误状态都应有明确且不互相遮挡的 UI。
- “已启用”和“停用”等状态/操作使用有明显区分的颜色，确保文字与背景满足可读性，不使用语义诡异或对比度不足的配色。

## 错误、异步和生命周期

- 在系统边界显式处理错误：HTTP 非成功响应、异常响应结构、设置写入失败和 provider 更新失败都必须向上返回可诊断错误。
- 不吞掉 rejection，不使用空 `catch`；错误文案不得泄露敏感数据。
- 并发请求需要防止旧响应覆盖新状态，例如使用请求序号、取消请求或等价的竞态控制。
- 所有 settings observer、事件监听、定时器、DOM 节点、React root、Slot 注册、provider 注册和 watcher 都必须在 dispose/卸载时清理。
- provider 配置更新应尽量通过一次快照替换完成，失败时保留上一次有效配置，避免会话看到半更新状态。

## 测试与验证

- 先读取根目录和各包的 `scripts`，只执行项目实际声明的命令，不假设存在未声明的脚本。
- 纯函数测试覆盖排序、筛选、模型启停、配置生成和边界数据；controller 测试覆盖设置持久化、provider 同步、错误分支和状态迁移。
- SDK 测试使用注入的 `fetch`，覆盖区域 URL、请求参数、无凭证请求、固定成功响应、非 2xx 响应和异常响应结构。
- UI 测试覆盖 Tab 切换、模型加载/刷新、搜索/筛选/排序、详情对话框、启用/停用、退役模型限制、API Key 设置和错误/空状态。
- 涉及关键 UI 流程时，使用仓库已有的 Playwright 测试基础设施或可用的 Playwright CLI 做真实浏览器回归，至少检查桌面/窄屏、深色模式、滚动边界、键盘交互、模型图标、模型详情、会话模型选择器和浏览器控制台错误；没有对应基础设施时，不要为一次改动擅自引入整套测试框架。
- 构建验证必须在没有本地遗留 `lib` 产物的干净环境中可重复，不能依赖未提交文件或上一次构建生成的声明文件。
- 提交或创建 PR 前至少执行：

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

- Playwright、覆盖率、构建产物和临时 profile 等验证文件不得污染源码或提交；使用 `.gitignore` 中已有的临时目录规则。

## Git、CI 与 PR

- CI 使用 `.nvmrc` 提供 Node 版本，`actions/setup-node` 使用 `node-version-file: '.nvmrc'` 和 pnpm cache；安装使用 `pnpm install --frozen-lockfile`。
- CI 顺序保持为安装、格式检查、Lint、构建、测试、类型检查；workflow 修改后使用 `actionlint` 验证。
- 分支应从最新 `main` 创建，提交保持单一主题，提交前检查 `git status` 和完整 diff。
- 未经用户明确授权，不执行 commit、push、发布或修改远程 PR；明确授权后仍必须先完成验证再提交。
- PR 标题使用 Conventional Commits 格式：类型前缀使用英文，冒号后的具体描述使用中文，例如 `refactor: 重构模型中心`。
- PR 正文使用中文，说明变更范围、关键设计决策、未改变的边界和实际执行过的验证命令。
- 不把会话记录、API Key、测试凭证、临时构建产物或无关文件加入提交。

## 安全红线

- 绝不在源码、测试、文档、日志、截图或提交历史中硬编码 API Key、AK/SK、token、密码或 Authorization header。
- 绝不把完整凭证写入普通 settings、Client 状态、URL、错误消息或测试快照。
- 绝不未经确认删除文件、覆盖用户改动或执行破坏性 Git/文件系统操作。
