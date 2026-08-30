import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const apiKeySettingKeys = {
  title: 'settings.apiKey.title',
  checkFailed: 'settings.apiKey.checkFailed',
  checking: 'settings.apiKey.checking',
  configured: 'settings.apiKey.configured',
  description: 'settings.apiKey.description',
  notConfigured: 'settings.apiKey.notConfigured',
  placeholder: 'settings.apiKey.placeholder',
  save: 'settings.apiKey.save',
} as const;

export const apiKeySettingMessages = {
  [apiKeySettingKeys.title]: {
    zh: '推理 API Key',
    en: 'Inference API Key',
  },
  [apiKeySettingKeys.checkFailed]: {
    zh: '检查失败：{error}',
    en: 'Check failed: {error}',
  },
  [apiKeySettingKeys.checking]: {
    zh: '检查配置中...',
    en: 'Checking configuration...',
  },
  [apiKeySettingKeys.configured]: {
    zh: '已配置',
    en: 'Configured',
  },
  [apiKeySettingKeys.description]: {
    zh: '设置后，已启用模型可以在会话中调用。',
    en: 'Enabled models can be used in conversations after setup.',
  },
  [apiKeySettingKeys.notConfigured]: {
    zh: '未配置',
    en: 'Not configured',
  },
  [apiKeySettingKeys.placeholder]: {
    zh: '输入推理 API Key',
    en: 'Enter inference API Key',
  },
  [apiKeySettingKeys.save]: {
    zh: '保存 API Key',
    en: 'Save API Key',
  },
} satisfies QiniuLocaleMessages;
