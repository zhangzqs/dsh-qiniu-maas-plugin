import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const apiKeySettingMessages = {
  'settings.apiKey.title': { zh: '推理 API Key', en: 'Inference API Key' },
  'settings.apiKey.checkFailed': {
    zh: '检查失败：{error}',
    en: 'Check failed: {error}',
  },
  'settings.apiKey.checking': {
    zh: '检查配置中...',
    en: 'Checking configuration...',
  },
  'settings.apiKey.configured': { zh: '已配置', en: 'Configured' },
  'settings.apiKey.description': {
    zh: '设置后，已启用模型可以在会话中调用。',
    en: 'Enabled models can be used in conversations after setup.',
  },
  'settings.apiKey.notConfigured': { zh: '未配置', en: 'Not configured' },
  'settings.apiKey.placeholder': {
    zh: '输入推理 API Key',
    en: 'Enter inference API Key',
  },
  'settings.apiKey.save': { zh: '保存 API Key', en: 'Save API Key' },
} satisfies QiniuLocaleMessages;
