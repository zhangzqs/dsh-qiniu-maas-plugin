import type { QiniuLocaleKey } from '../../../i18n/namespace.ts';
type Messages = Pick<
  Record<QiniuLocaleKey, string>,
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
  | 'common.icon'
>;
export const settingsZh = {
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
} satisfies Messages;
export const settingsEn = {
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
} satisfies Messages;
