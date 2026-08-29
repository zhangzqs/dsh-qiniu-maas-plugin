import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const modelDetailKeys = {
  capabilities: 'model.detail.capabilities',
  close: 'model.detail.close',
  context: 'model.detail.context',
  kicker: 'model.detail.kicker',
  documents: 'model.detail.documents',
  functionCalling: 'model.detail.functionCalling',
  info: 'model.detail.info',
  input: 'model.detail.input',
  integrationDocumentation: 'model.detail.integrationDocumentation',
  issuer: 'model.detail.issuer',
  limits: 'model.detail.limits',
  maxOutput: 'model.detail.maxOutput',
  modelDocumentation: 'model.detail.modelDocumentation',
  output: 'model.detail.output',
  protocols: 'model.detail.protocols',
  reasoning: 'model.detail.reasoning',
  releaseAt: 'model.detail.releaseAt',
  structuredOutput: 'model.detail.structuredOutput',
  unknown: 'model.detail.unknown',
} as const;

export const modelDetailMessages = {
  [modelDetailKeys.capabilities]: {
    zh: '支持能力',
    en: 'Capabilities',
  },
  [modelDetailKeys.close]: {
    zh: '关闭详情',
    en: 'Close details',
  },
  [modelDetailKeys.context]: {
    zh: '上下文',
    en: 'Context',
  },
  [modelDetailKeys.kicker]: {
    zh: 'MODEL DETAILS',
    en: 'MODEL DETAILS',
  },
  [modelDetailKeys.documents]: {
    zh: '相关文档',
    en: 'Documentation',
  },
  [modelDetailKeys.functionCalling]: {
    zh: '函数调用',
    en: 'Function calling',
  },
  [modelDetailKeys.info]: {
    zh: '模型信息',
    en: 'Model information',
  },
  [modelDetailKeys.input]: {
    zh: '输入',
    en: 'Input',
  },
  [modelDetailKeys.integrationDocumentation]: {
    zh: '接入文档',
    en: 'Integration documentation',
  },
  [modelDetailKeys.issuer]: {
    zh: '发行方',
    en: 'Issuer',
  },
  [modelDetailKeys.limits]: {
    zh: '模型限制',
    en: 'Model limits',
  },
  [modelDetailKeys.maxOutput]: {
    zh: '最大输出',
    en: 'Max output',
  },
  [modelDetailKeys.modelDocumentation]: {
    zh: '模型文档',
    en: 'Model documentation',
  },
  [modelDetailKeys.output]: {
    zh: '输出',
    en: 'Output',
  },
  [modelDetailKeys.protocols]: {
    zh: '支持协议',
    en: 'Supported protocols',
  },
  [modelDetailKeys.reasoning]: {
    zh: '推理',
    en: 'Reasoning',
  },
  [modelDetailKeys.releaseAt]: {
    zh: '发布时间',
    en: 'Release date',
  },
  [modelDetailKeys.structuredOutput]: {
    zh: '结构化输出',
    en: 'Structured output',
  },
  [modelDetailKeys.unknown]: {
    zh: '未知',
    en: 'Unknown',
  },
} satisfies QiniuLocaleMessages;
