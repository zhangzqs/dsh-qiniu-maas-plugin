import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const modelAvatarKeys = {
  icon: 'model.avatar.icon',
} as const;

export const modelAvatarMessages = {
  [modelAvatarKeys.icon]: {
    zh: '{name} 图标',
    en: '{name} icon',
  },
} satisfies QiniuLocaleMessages;
