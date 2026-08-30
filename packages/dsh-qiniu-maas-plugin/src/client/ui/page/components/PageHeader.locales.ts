import type { QiniuLocaleMessages } from '../../i18n/index.ts';

export const pageHeaderKeys = {
  title: 'page.header.title',
  subtitle: 'page.header.subtitle',
  portal: 'page.header.portal',
  repository: 'page.header.repository',
  version: 'page.header.version',
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
  [pageHeaderKeys.repository]: {
    zh: '查看 GitHub 项目',
    en: 'View GitHub repository',
  },
  [pageHeaderKeys.version]: {
    zh: '插件版本：{version}',
    en: 'Plugin version: {version}',
  },
} satisfies QiniuLocaleMessages;
