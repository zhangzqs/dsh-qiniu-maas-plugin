import type { QiniuLocaleMessages } from '../../../i18n/index.ts';

export const settingsKeys = {
  protocol: 'settings.panel.protocol',
  region: 'settings.panel.region',
  regionCn: 'settings.panel.region.cn',
  regionGlobal: 'settings.panel.region.global',
  version: 'settings.panel.version',
} as const;

export const settingsMessages = {
  [settingsKeys.protocol]: {
    zh: '推理协议',
    en: 'Inference protocol',
  },
  [settingsKeys.region]: {
    zh: '服务区域',
    en: 'Service region',
  },
  [settingsKeys.regionCn]: {
    zh: '国内',
    en: 'Mainland China',
  },
  [settingsKeys.regionGlobal]: {
    zh: '全球',
    en: 'Global',
  },
  [settingsKeys.version]: {
    zh: '插件版本：{version}',
    en: 'Plugin version: {version}',
  },
} satisfies QiniuLocaleMessages;
