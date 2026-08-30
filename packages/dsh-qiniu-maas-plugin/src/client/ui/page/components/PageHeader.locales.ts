import type { QiniuLocaleMessages } from '../../i18n/index.ts';

export const pageHeaderKeys = {
  title: 'page.header.title',
  subtitle: 'page.header.subtitle',
  portal: 'page.header.portal',
} as const;

export const pageHeaderMessages = {
  [pageHeaderKeys.title]: {
    zh: '七牛 MaaS',
    en: 'Qiniu MaaS',
  },
  [pageHeaderKeys.subtitle]: {
    zh: '管理七牛 AI 大模型推理服务。',
    en: 'Manage Qiniu AI model inference services.',
  },
  [pageHeaderKeys.portal]: {
    zh: '前往七牛 AI 大模型控制台',
    en: 'Open Qiniu AI console',
  },
} satisfies QiniuLocaleMessages;
