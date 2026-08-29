import type { QiniuLocaleKey } from '../../../../i18n/namespace.ts';
type Messages = Pick<Record<QiniuLocaleKey, 'string'>, never> &
  Pick<
    Record<QiniuLocaleKey, string>,
    | 'model.unknown'
    | 'model.details'
    | 'model.info'
    | 'model.issuer'
    | 'model.releaseAt'
    | 'model.input'
    | 'model.output'
    | 'model.limits'
    | 'model.context'
    | 'model.maxOutput'
    | 'model.capabilities'
    | 'model.reasoning'
    | 'model.functionCalling'
    | 'model.structuredOutput'
    | 'model.protocols'
    | 'model.documents'
    | 'model.closeDetails'
    | 'model.noDescription'
    | 'model.modelDocumentation'
    | 'model.integrationDocumentation'
  >;
export const modelDetailZh = {
  'model.unknown': '未知',
  'model.details': 'MODEL DETAILS',
  'model.info': '模型信息',
  'model.issuer': '发行方',
  'model.releaseAt': '发布时间',
  'model.input': '输入',
  'model.output': '输出',
  'model.limits': '模型限制',
  'model.context': '上下文',
  'model.maxOutput': '最大输出',
  'model.capabilities': '支持能力',
  'model.reasoning': '推理',
  'model.functionCalling': '函数调用',
  'model.structuredOutput': '结构化输出',
  'model.protocols': '支持协议',
  'model.documents': '相关文档',
  'model.closeDetails': '关闭详情',
  'model.noDescription': '暂无描述',
  'model.modelDocumentation': '模型文档',
  'model.integrationDocumentation': '接入文档',
} satisfies Messages;
export const modelDetailEn = {
  'model.unknown': 'Unknown',
  'model.details': 'MODEL DETAILS',
  'model.info': 'Model information',
  'model.issuer': 'Issuer',
  'model.releaseAt': 'Release date',
  'model.input': 'Input',
  'model.output': 'Output',
  'model.limits': 'Model limits',
  'model.context': 'Context',
  'model.maxOutput': 'Max output',
  'model.capabilities': 'Capabilities',
  'model.reasoning': 'Reasoning',
  'model.functionCalling': 'Function calling',
  'model.structuredOutput': 'Structured output',
  'model.protocols': 'Supported protocols',
  'model.documents': 'Documentation',
  'model.closeDetails': 'Close details',
  'model.noDescription': 'No description available',
  'model.modelDocumentation': 'Model documentation',
  'model.integrationDocumentation': 'Integration documentation',
} satisfies Messages;
