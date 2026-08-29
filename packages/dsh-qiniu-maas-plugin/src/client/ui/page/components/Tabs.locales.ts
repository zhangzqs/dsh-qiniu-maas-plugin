import type { QiniuLocaleKey } from '../../i18n/namespace.ts';
type Messages = Pick<
  Record<QiniuLocaleKey, string>,
  'tabs.modelCenter' | 'tabs.settings' | 'tabs.aria'
>;
export const tabsZh = {
  'tabs.modelCenter': '模型中心',
  'tabs.settings': '设置',
  'tabs.aria': '七牛 MaaS 设置',
} satisfies Messages;
export const tabsEn = {
  'tabs.modelCenter': 'Model Center',
  'tabs.settings': 'Settings',
  'tabs.aria': 'Qiniu MaaS settings',
} satisfies Messages;
