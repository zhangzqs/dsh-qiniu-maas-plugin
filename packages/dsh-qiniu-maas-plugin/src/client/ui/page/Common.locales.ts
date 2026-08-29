import type { QiniuLocaleMessages } from '../i18n/index.ts';

export const commonKeys = {
  saving: 'common.loading.saving',
} as const;

export const commonMessages = {
  [commonKeys.saving]: {
    zh: '保存中...',
    en: 'Saving...',
  },
} satisfies QiniuLocaleMessages;
