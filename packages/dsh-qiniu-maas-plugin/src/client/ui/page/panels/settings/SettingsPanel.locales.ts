import type { QiniuLocaleMessages } from '../../../i18n/namespace.ts';

export const settingsMessages = {
  'common.icon': { zh: '{name} 图标', en: '{name} icon' },
  'settings.apiKey': { zh: '推理 API Key', en: 'Inference API Key' },
  'settings.apiKeyCheckFailed': {
    zh: '检查失败：{error}',
    en: 'Check failed: {error}',
  },
  'settings.apiKeyChecking': {
    zh: '检查配置中...',
    en: 'Checking configuration...',
  },
  'settings.apiKeyConfigured': { zh: '已配置', en: 'Configured' },
  'settings.apiKeyDescription': {
    zh: '设置后，已启用模型可以在会话中调用。',
    en: 'Enabled models can be used in conversations after setup.',
  },
  'settings.apiKeyNotConfigured': { zh: '未配置', en: 'Not configured' },
  'settings.apiKeyPlaceholder': {
    zh: '输入推理 API Key',
    en: 'Enter inference API Key',
  },
  'settings.protocol': { zh: '推理协议', en: 'Inference protocol' },
  'settings.region': { zh: '服务区域', en: 'Service region' },
  'settings.regionCn': { zh: '国内', en: 'Mainland China' },
  'settings.regionGlobal': { zh: '全球', en: 'Global' },
  'settings.saveApiKey': { zh: '保存 API Key', en: 'Save API Key' },
} satisfies QiniuLocaleMessages;
