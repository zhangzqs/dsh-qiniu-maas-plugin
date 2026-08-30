import type { QiniuLocaleMessages } from './i18n/index.ts';

export const qiniuSettingsSectionKeys = {
  label: 'settings.section.label',
} as const;

export const qiniuSettingsSectionMessages = {
  [qiniuSettingsSectionKeys.label]: {
    zh: '七牛 MaaS',
    en: 'Qiniu MaaS',
  },
} satisfies QiniuLocaleMessages;
