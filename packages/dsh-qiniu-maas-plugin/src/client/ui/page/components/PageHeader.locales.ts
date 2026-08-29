import type { QiniuLocaleKey } from '../../i18n/namespace.ts';
type Messages = Pick<
  Record<QiniuLocaleKey, string>,
  'brand' | 'subtitle' | 'portal'
>;
export const pageHeaderZh = {
  brand: '七牛 MaaS',
  subtitle: '管理七牛 AI 大模型推理服务。',
  portal: '前往七牛 AI 大模型控制台',
} satisfies Messages;
export const pageHeaderEn = {
  brand: 'Qiniu MaaS',
  subtitle: 'Manage Qiniu AI model inference services.',
  portal: 'Open Qiniu AI console',
} satisfies Messages;
