import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const apiKeySettingMessages = {
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
  'settings.saveApiKey': { zh: '保存 API Key', en: 'Save API Key' },
} satisfies QiniuLocaleMessages;
