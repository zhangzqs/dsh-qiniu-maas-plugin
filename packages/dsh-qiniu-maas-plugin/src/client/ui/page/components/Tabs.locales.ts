import type { QiniuLocaleMessages } from '../../i18n/index.ts';

export const tabsKeys = {
  modelCenter: 'page.tabs.modelCenter',
  settings: 'page.tabs.settings',
  aria: 'page.tabs.aria',
} as const;

export const tabsMessages = {
  [tabsKeys.modelCenter]: {
    zh: '模型中心',
    en: 'Model Center',
  },
  [tabsKeys.settings]: {
    zh: '设置',
    en: 'Settings',
  },
  [tabsKeys.aria]: {
    zh: '七牛 MaaS 设置',
    en: 'Qiniu MaaS settings',
  },
} satisfies QiniuLocaleMessages;
