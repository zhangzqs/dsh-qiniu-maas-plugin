# Qiniu MaaS DSH Plugin 裁剪版设计

## 1. 目标

将 Qiniu MaaS DSH Plugin 裁剪为一个面向模型管理的设置页面：用户可以浏览模型广场、添加和管理模型、设置推理 API Key；模型启用后立即出现在 DSH 的模型列表中，并通过 DSH 原生 `llm` provider 使用。

本版本不建设完整 MaaS 管理控制台，也不新增一套模型推理客户端。

## 2. 范围

### 保留

- 模型广场
  - 浏览公开模型列表
  - 搜索和刷新
  - 在模型卡片中展示模型图标
  - 查看模型详情
  - 启用模型
- 我的模型
  - 查看已添加模型
  - 启用、停用、删除模型
  - 修改必要的本地模型参数
- 设置
  - 选择模型市场 endpoint（国内 / 全球）
  - 选择推理协议（OpenAI Chat Completions / OpenAI Responses / Anthropic Messages）
  - 手动设置推理 API Key
  - 查看 API Key 是否已配置
- DSH provider 接入
  - 已启用模型立即注册到 DSH 模型列表
  - 实际推理使用 DSH 原生 `llm` 机制

### 移除

- 用量、账单、账户和配额页面
- MaaS 管理接口和管理 SDK
- 第二套 Chat Completions、SSE 或流式推理客户端
- 模型广场以外的公开模型详情后端 RPC
- 本版本专用的真实 Qiniu E2E 流程

## 3. 页面结构

页面使用类似 `dsh-market` 的 Tab 面板布局，只借鉴信息密度和资源管理方式，不复制代码或品牌。

三个 Tab 固定为：

1. `模型广场`
2. `我的模型`
3. `设置`

详情统一使用点击打开的侧面详情面板，不使用悬浮详情。这样桌面端和移动端使用相同交互，也避免详情内容因鼠标移动意外消失。

## 4. 模型状态和交互

模型广场中的模型卡片根据本地配置显示状态：

| 本地状态     | 卡片标识 | 详情操作 |
| ------------ | -------- | -------- |
| 未添加       | 未启用   | 启用     |
| 已添加且启用 | 已启用   | 停用     |
| 已添加但停用 | 未启用   | 重新启用 |

“启用”是插件本地状态，表示模型会被注册到 DSH；它不表示调用 MaaS 远程启用接口。

用户点击卡片右侧的详情按钮后，打开模型详情侧面板。模型卡片和详情面板均展示接口返回的模型图标；图标缺失或加载失败时使用统一占位图标。面板至少展示：模型名称、模型 ID、发行方、描述、能力标签、输入输出模态、上下文限制、最大输出限制、支持的 API 协议和价格信息（若接口返回）。面板底部提供启用、停用或重新启用按钮。

启用流程：

1. Client 调用 Host 的模型配置 RPC。
2. Host 只保存模型 ID 和用户修改的本地参数。
3. Host 原子更新 settings。
4. Host 根据全部已启用模型重建不可变的 Qiniu provider 模型快照。
5. 新模型立即出现在 DSH 原生模型选择器中。

停用只从 DSH 可用模型列表中移除，不删除本地模型配置。删除才会移除本地配置；删除后模型回到模型广场的“未启用”状态。

## 5. 模型广场访问方式

经实测，模型广场是公开接口，浏览器可直接访问并读取响应：

- 国内：`GET https://api.qnaigc.com/v1/market/models`
- 全球：`GET https://openai.sufy.com/v1/market/models`

两个服务均返回 `200`，并返回允许跨域读取的 `Access-Control-Allow-Origin`。模型广场请求不携带任何凭证。

OpenAPI 文件的全局 `security` 配置与该接口的实际行为及接口描述不一致。实现以真实模型广场服务行为为准，但应将 endpoint 配置集中在 npm 包中，便于服务地址变化时调整。

不使用 `https://api.qiniu.com/ai/v1/market/models`：该地址实测返回 `401`，不是模型广场的实际访问地址。

## 6. `qiniu-maas-model-market` npm 包

新增独立的 `qiniu-maas-model-market` 包。该包只封装模型广场公开接口，不依赖 DSH，不读取环境变量、浏览器存储或任何凭证，不实现模型推理。

建议公开接口：

```ts
export interface ModelMarketOptions {
  endpoint?: 'cn' | 'global';
  fetch?: typeof globalThis.fetch;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  created_time?: string;
  avatar?: string;
  hot_tags: string[];
  features: string[];
  rank?: number;
  issuer?: {
    name: string;
    avatar?: string;
    model_page?: string;
  };
  constraints?: {
    context_length?: number;
    max_completion_tokens?: number;
    max_tokens?: number;
  };
  architecture?: {
    input_modalities: string[];
    output_modalities: string[];
    reasoning?: { supported?: boolean; description?: string };
    function_calling?: { supported?: boolean; description?: string };
  };
  pricing_rules?: unknown[];
  pricing_rules_v2?: unknown[];
  support_api_protocols: string[];
}

export function listModels(options?: ModelMarketOptions): Promise<Model[]>;
```

默认 endpoint 为国内服务。包负责：

- 根据 endpoint 发起请求
- 发起无鉴权 GET 请求
- 校验响应为模型数组
- 提供与接口字段一致的 TypeScript 类型，不转换下划线字段
- 将 HTTP 错误转换为不包含敏感数据的错误

包不负责：

- 添加、删除或远程启用模型
- 保存用户选择
- 凭证管理
- DSH provider 注册
- 缓存完整模型数据

模型广场 Client 直接调用该包；Host 不为公开模型列表增加中转 RPC。
模型列表接口返回全量数据，模型排序由 DSH 插件按 `rank` 降序完成。

## 7. DSH Plugin 架构

插件分为 Host 和 Client 两部分。

### Host

Host 负责：

- 读取和保存模型选择配置
- 读取和保存推理 API Key 到 DSH credentials
- 注册 Qiniu `llm` provider
- 根据已启用模型构造 DSH 模型声明
- 在 settings 变化后原子刷新 provider 快照
- 提供模型配置和 API Key 配置 RPC

Host 不向 Client 返回完整 API Key。API Key 只在实际推理需要时从 DSH credentials 读取。

### Client

Client 负责：

- 渲染三个 Tab
- 调用 `qiniu-maas-model-market` 获取模型广场数据
- 展示模型卡片、状态标识和点击打开的详情面板
- 通过 RPC 修改模型选择和 API Key 配置
- 展示加载、空数据、错误和缺少 API Key 状态

## 8. Settings 与 Credentials

settings 只保存模型选择和用户控制的本地覆盖参数，不保存完整市场模型响应：

```ts
interface QiniuModelSelection {
  id: string;
  enabled: boolean;
  contextWindow?: number;
  maxOutputTokens?: number;
}

interface QiniuSettings {
  models: QiniuModelSelection[];
  modelMarketEndpoint: 'cn' | 'global';
  inferenceProtocol:
    | 'openai-completions'
    | 'openai-responses'
    | 'anthropic-messages';
}
```

推理 API Key 存储在 DSH credentials 中，仅用于实际模型推理。模型广场不需要任何凭证。

没有 API Key 时，模型仍然可以启用并出现在 DSH 模型选择器中；实际调用前由 provider 返回明确的缺少凭证错误。

## 9. Provider 与推理

插件注册一个 Qiniu DSH `llm` provider。provider 的模型列表只包含 settings 中 `enabled: true` 的模型。

模型市场 endpoint 和推理协议由用户在设置页选择并持久化。endpoint 同时决定模型广场请求地址和 provider 的 `baseURL`；推理协议映射为 DSH 原生的 `api` 配置，并在设置变更后重建 provider。

插件不保存默认模型。启用模型只负责将模型加入 DSH 会话界面的模型选择列表，当前会话使用哪个模型由用户在会话界面自行选择。

模型启用或停用后，Host 使用新的 settings 快照重建 provider 模型列表，确保：

- 新启用模型无需重启即可出现在 DSH 模型选择器
- 停用模型不再出现在可选模型列表
- 删除模型同时清除本地配置
- 已开始的推理请求不受后续配置变更影响

实际生成、流式处理、取消、重试、会话记录和错误展示继续使用 DSH 原生 `llm` 能力。插件不调用模型广场包执行推理，也不实现第二套 HTTP 推理协议。

## 10. 错误处理

- 模型广场请求失败只影响模型广场 Tab，已保存的我的模型仍可使用。
- 模型广场返回异常结构时，包返回可识别的响应错误，不将原始响应直接暴露给 UI。
- settings 或 provider 更新失败时，保留上一次有效 provider 快照，并向 UI 返回失败原因。
- 缺少 API Key 时，在推理前返回 `API_KEY_REQUIRED` 类明确错误。
- API Key 未配置时，设置页面显示配置提示，不影响模型广场和我的模型展示。
- 所有错误均不得包含完整 API Key 或 Authorization header。

## 11. 测试

### 模型广场包

使用注入的 `fetch` 测试：

- 默认国内 endpoint
- 全球 endpoint
- 查询参数编码
- 无 Authorization 请求
- 成功响应归一化
- 非 2xx 响应
- 缺少 `data` 或模型 ID 的异常响应

### Plugin Host

使用 DSH service fake 测试：

- 添加模型后 settings 正确保存
- 添加模型后 provider 模型列表立即更新
- 停用模型后从 DSH 模型列表移除
- 删除模型后配置清理
- API Key 的配置、更新和缺失状态
- provider 快照原子替换
- 插件停止时释放 RPC、settings observer、Slot 和 provider 注册

### UI

测试：

- 无 API Key 加载模型广场
- 模型卡片展示图标，缺失图标时展示占位图标
- 未添加模型显示“未启用”
- 已启用模型显示“已启用”
- 点击详情按钮打开侧面详情面板
- 从详情面板启用、停用模型
- 三个 Tab 切换
- 设置 API Key 后只展示配置状态，不展示原始值
- 添加模型后 DSH 模型选择器出现该模型

## 12. 交付结构

```text
packages/qiniu-maas-model-market/
packages/dsh-qiniu-maas/
tests/
docs/superpowers/specs/2026-08-28-qiniu-maas-plugin-design.md
README.md
```

README 需要说明：模型广场为公开接口、实际 endpoint、三 Tab 功能、模型启用与 DSH provider 的关系、API Key 的手动设置方式，以及模型广场直连需要服务端持续支持 CORS。

## 13. 非目标

本版本不承诺：

- 在插件内展示 MaaS 账户余额、用量、账单或配额
- 在浏览器中保存或读取完整 API Key
- 通过模型广场接口创建或远程管理模型
- 由 npm 包承担推理功能
- 为 DSH 原生 `llm` provider 增加新的协议抽象
