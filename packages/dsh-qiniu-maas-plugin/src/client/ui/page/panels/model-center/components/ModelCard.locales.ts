import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const modelCardKeys = {
  disable: 'model.card.disable',
  disabled: 'model.card.disabled',
  enable: 'model.card.enable',
  enabled: 'model.card.enabled',
  viewDetails: 'model.card.viewDetails',
  noDescription: 'model.card.noDescription',
  retired: 'model.card.retired',
  retiredMigration: 'model.card.retiredMigration',
} as const;

export const modelCardMessages = {
  [modelCardKeys.disable]: {
    zh: '停用',
    en: 'Disable',
  },
  [modelCardKeys.disabled]: {
    zh: '未启用',
    en: 'Disabled',
  },
  [modelCardKeys.enable]: {
    zh: '启用',
    en: 'Enable',
  },
  [modelCardKeys.enabled]: {
    zh: '已启用',
    en: 'Enabled',
  },
  [modelCardKeys.viewDetails]: {
    zh: '查看详情',
    en: 'View details',
  },
  [modelCardKeys.noDescription]: {
    zh: '暂无描述',
    en: 'No description available',
  },
  [modelCardKeys.retired]: {
    zh: '已退役',
    en: 'Retired',
  },
  [modelCardKeys.retiredMigration]: {
    zh: '已退役，建议迁移到 {model}',
    en: 'Retired. Migrate to {model}.',
  },
} satisfies QiniuLocaleMessages;
