import type { QiniuLocaleKey } from '../../../../i18n/namespace.ts';
type Messages = Pick<
  Record<QiniuLocaleKey, string>,
  | 'model.enable'
  | 'model.disable'
  | 'model.retired'
  | 'model.saving'
  | 'model.noDescription'
  | 'model.enabled'
  | 'model.disabled'
  | 'model.retiredMigration'
  | 'model.info'
>;
export const modelCardZh = {
  'model.enable': '启用',
  'model.disable': '停用',
  'model.retired': '已退役',
  'model.saving': '保存中...',
  'model.noDescription': '暂无描述',
  'model.enabled': '已启用',
  'model.disabled': '未启用',
  'model.retiredMigration': '已退役，建议迁移到 {model}',
  'model.info': '查看详情',
} satisfies Messages;
export const modelCardEn = {
  'model.enable': 'Enable',
  'model.disable': 'Disable',
  'model.retired': 'Retired',
  'model.saving': 'Saving...',
  'model.noDescription': 'No description available',
  'model.enabled': 'Enabled',
  'model.disabled': 'Disabled',
  'model.retiredMigration': 'Retired. Migrate to {model}.',
  'model.info': 'View details',
} satisfies Messages;
