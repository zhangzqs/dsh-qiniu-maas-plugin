import type { LocaleId } from '@deepseek-ai/dsh-client-locale/client';
import type { QiniuLocaleKey } from '../../i18n/namespace.ts';

type Messages = Record<
  Extract<QiniuLocaleKey, 'tabs.modelCenter' | 'tabs.settings' | 'tabs.aria'>,
  Record<LocaleId, string>
>;

export const tabsMessages = {
  'tabs.modelCenter': { zh: '模型中心', en: 'Model Center' },
  'tabs.settings': { zh: '设置', en: 'Settings' },
  'tabs.aria': { zh: '七牛 MaaS 设置', en: 'Qiniu MaaS settings' },
} satisfies Messages;
