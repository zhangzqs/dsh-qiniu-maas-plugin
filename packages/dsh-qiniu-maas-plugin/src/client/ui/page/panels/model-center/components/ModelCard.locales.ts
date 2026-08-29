import type { QiniuLocaleMessages } from '../../../../i18n/namespace.ts';

export const modelCardMessages = {
  'model.disable': { zh: '停用', en: 'Disable' },
  'model.disabled': { zh: '未启用', en: 'Disabled' },
  'model.enable': { zh: '启用', en: 'Enable' },
  'model.enabled': { zh: '已启用', en: 'Enabled' },
  'model.viewDetails': { zh: '查看详情', en: 'View details' },
  'model.noDescription': { zh: '暂无描述', en: 'No description available' },
  'model.retired': { zh: '已退役', en: 'Retired' },
  'model.retiredMigration': {
    zh: '已退役，建议迁移到 {model}',
    en: 'Retired. Migrate to {model}.',
  },
  'model.saving': { zh: '保存中...', en: 'Saving...' },
} satisfies QiniuLocaleMessages;
