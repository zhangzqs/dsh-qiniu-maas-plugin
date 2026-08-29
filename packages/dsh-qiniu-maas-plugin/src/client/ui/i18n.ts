import type { LocaleId } from '@deepseek-ai/dsh-client-locale/client';
import type {
  LocaleDictOf,
  TranslateNS,
} from '@deepseek-ai/dsh-client-ui-slots';
import { createContext, useContext } from 'react';

export type QiniuLocaleKey =
  | 'brand'
  | 'subtitle'
  | 'portal'
  | 'model.closeDetails'
  | 'model.noDescription'
  | 'model.enabled'
  | 'model.disabled'
  | 'model.retiredMigration'
  | 'model.modelDocumentation'
  | 'model.integrationDocumentation'
  | 'tabs.modelCenter'
  | 'tabs.settings'
  | 'tabs.aria'
  | 'model.sort'
  | 'model.sortNewest'
  | 'model.sortOldest'
  | 'model.nameAsc'
  | 'model.nameDesc'
  | 'model.filter'
  | 'model.enabledOnly'
  | 'model.showRetired'
  | 'model.search'
  | 'model.searchPlaceholder'
  | 'model.count'
  | 'model.refresh'
  | 'model.saveFailed'
  | 'model.loading'
  | 'model.loadFailed'
  | 'model.retry'
  | 'model.empty'
  | 'model.enable'
  | 'model.disable'
  | 'model.retired'
  | 'model.saving'
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
  | 'settings.region'
  | 'settings.regionCn'
  | 'settings.regionGlobal'
  | 'settings.protocol'
  | 'settings.apiKey'
  | 'settings.apiKeyDescription'
  | 'settings.apiKeyConfigured'
  | 'settings.apiKeyNotConfigured'
  | 'settings.apiKeyChecking'
  | 'settings.apiKeyCheckFailed'
  | 'settings.apiKeyPlaceholder'
  | 'settings.saveApiKey'
  | 'common.icon';

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'qiniu-maas': QiniuLocaleKey;
  }
}

export type QiniuTranslator = TranslateNS<'qiniu-maas'>;

export const QiniuLocaleContext = createContext<QiniuTranslator | null>(null);

export function useQiniuT(): QiniuTranslator {
  const t = useContext(QiniuLocaleContext);
  if (t === null) throw new Error('Qiniu locale context is not available');
  return t;
}

export const qiniuMessages: Record<LocaleId, LocaleDictOf<'qiniu-maas'>> = {
  zh: {
    brand: '七牛 MaaS',
    subtitle: '管理七牛 AI 大模型推理服务。',
    portal: '前往七牛 AI 大模型控制台',
    'tabs.modelCenter': '模型中心',
    'tabs.settings': '设置',
    'tabs.aria': '七牛 MaaS 设置',
    'model.sort': '模型排序',
    'model.sortNewest': '发布时间：最新',
    'model.sortOldest': '发布时间：最早',
    'model.nameAsc': '名称：A-Z',
    'model.nameDesc': '名称：Z-A',
    'model.filter': '筛选',
    'model.enabledOnly': '仅显示已启用模型',
    'model.showRetired': '显示已退役模型',
    'model.search': '搜索模型',
    'model.searchPlaceholder': '搜索模型名称或 ID',
    'model.count': '{count} 个模型',
    'model.refresh': '刷新模型',
    'model.saveFailed': '模型设置保存失败：{error}',
    'model.loading': '模型加载中...',
    'model.loadFailed': '模型加载失败：{error}',
    'model.retry': '重试',
    'model.empty': '没有匹配的模型。',
    'model.enable': '启用',
    'model.disable': '停用',
    'model.retired': '已退役',
    'model.saving': '保存中...',
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
    'model.enabled': '已启用',
    'model.disabled': '未启用',
    'model.retiredMigration': '已退役，建议迁移到 {model}',
    'model.modelDocumentation': '模型文档',
    'model.integrationDocumentation': '接入文档',
    'settings.region': '服务区域',
    'settings.regionCn': '国内',
    'settings.regionGlobal': '全球',
    'settings.protocol': '推理协议',
    'settings.apiKey': '推理 API Key',
    'settings.apiKeyDescription': '设置后，已启用模型可以在会话中调用。',
    'settings.apiKeyConfigured': '已配置',
    'settings.apiKeyNotConfigured': '未配置',
    'settings.apiKeyChecking': '检查配置中...',
    'settings.apiKeyCheckFailed': '检查失败：{error}',
    'settings.apiKeyPlaceholder': '输入推理 API Key',
    'settings.saveApiKey': '保存 API Key',
    'common.icon': '{name} 图标',
  },
  en: {
    brand: 'Qiniu MaaS',
    subtitle: 'Manage Qiniu AI model inference services.',
    portal: 'Open Qiniu AI console',
    'tabs.modelCenter': 'Model Center',
    'tabs.settings': 'Settings',
    'tabs.aria': 'Qiniu MaaS settings',
    'model.sort': 'Sort models',
    'model.sortNewest': 'Release date: newest',
    'model.sortOldest': 'Release date: oldest',
    'model.nameAsc': 'Name: A-Z',
    'model.nameDesc': 'Name: Z-A',
    'model.filter': 'Filter',
    'model.enabledOnly': 'Show enabled models only',
    'model.showRetired': 'Show retired models',
    'model.search': 'Search models',
    'model.searchPlaceholder': 'Search model name or ID',
    'model.count': '{count} models',
    'model.refresh': 'Refresh models',
    'model.saveFailed': 'Failed to save model settings: {error}',
    'model.loading': 'Loading models...',
    'model.loadFailed': 'Failed to load models: {error}',
    'model.retry': 'Retry',
    'model.empty': 'No matching models.',
    'model.enable': 'Enable',
    'model.disable': 'Disable',
    'model.retired': 'Retired',
    'model.saving': 'Saving...',
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
    'model.enabled': 'Enabled',
    'model.disabled': 'Disabled',
    'model.retiredMigration': 'Retired. Migrate to {model}.',
    'model.modelDocumentation': 'Model documentation',
    'model.integrationDocumentation': 'Integration documentation',
    'settings.region': 'Service region',
    'settings.regionCn': 'Mainland China',
    'settings.regionGlobal': 'Global',
    'settings.protocol': 'Inference protocol',
    'settings.apiKey': 'Inference API Key',
    'settings.apiKeyDescription':
      'Enabled models can be used in conversations after setup.',
    'settings.apiKeyConfigured': 'Configured',
    'settings.apiKeyNotConfigured': 'Not configured',
    'settings.apiKeyChecking': 'Checking configuration...',
    'settings.apiKeyCheckFailed': 'Check failed: {error}',
    'settings.apiKeyPlaceholder': 'Enter inference API Key',
    'settings.saveApiKey': 'Save API Key',
    'common.icon': '{name} icon',
  },
};

export function translateWithMessages(
  locale: LocaleId,
  key: QiniuLocaleKey,
  params?: Record<string, unknown>,
): string {
  const template = qiniuMessages[locale][key];
  return template.replace(/\{(\w+)\}/g, (_match: string, name: string) =>
    String(params?.[name] ?? `{${name}}`),
  );
}
