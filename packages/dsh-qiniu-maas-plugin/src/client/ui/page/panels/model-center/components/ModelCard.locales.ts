import type { QiniuLocaleMessages } from '../../../../i18n/index.ts';

export const modelCardMessages = {
  'model.card.disable': { zh: '停用', en: 'Disable' },
  'model.card.disabled': { zh: '未启用', en: 'Disabled' },
  'model.card.enable': { zh: '启用', en: 'Enable' },
  'model.card.enabled': { zh: '已启用', en: 'Enabled' },
  'model.card.viewDetails': { zh: '查看详情', en: 'View details' },
  'model.card.noDescription': {
    zh: '暂无描述',
    en: 'No description available',
  },
  'model.card.retired': { zh: '已退役', en: 'Retired' },
  'model.card.retiredMigration': {
    zh: '已退役，建议迁移到 {model}',
    en: 'Retired. Migrate to {model}.',
  },
} satisfies QiniuLocaleMessages;
