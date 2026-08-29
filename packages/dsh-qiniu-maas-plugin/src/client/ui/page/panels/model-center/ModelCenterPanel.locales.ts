import type { QiniuLocaleKey } from '../../../i18n/namespace.ts';
type Messages = Pick<
  Record<QiniuLocaleKey, string>,
  | 'model.sort'
  | 'model.sortNewest'
  | 'model.sortOldest'
  | 'model.nameAsc'
  | 'model.nameDesc'
  | 'model.filter'
  | 'model.enabledOnly'
  | 'model.showRetired'
  | 'model.search'
  | 'model.searchPlaceholder'
  | 'model.count'
  | 'model.refresh'
  | 'model.saveFailed'
  | 'model.loading'
  | 'model.loadFailed'
  | 'model.retry'
  | 'model.empty'
>;
export const modelCenterZh = {
  'model.sort': '模型排序',
  'model.sortNewest': '发布时间：最新',
  'model.sortOldest': '发布时间：最早',
  'model.nameAsc': '名称：A-Z',
  'model.nameDesc': '名称：Z-A',
  'model.filter': '筛选',
  'model.enabledOnly': '仅显示已启用模型',
  'model.showRetired': '显示已退役模型',
  'model.search': '搜索模型',
  'model.searchPlaceholder': '搜索模型名称或 ID',
  'model.count': '{count} 个模型',
  'model.refresh': '刷新模型',
  'model.saveFailed': '模型设置保存失败：{error}',
  'model.loading': '模型加载中...',
  'model.loadFailed': '模型加载失败：{error}',
  'model.retry': '重试',
  'model.empty': '没有匹配的模型。',
} satisfies Messages;
export const modelCenterEn = {
  'model.sort': 'Sort models',
  'model.sortNewest': 'Release date: newest',
  'model.sortOldest': 'Release date: oldest',
  'model.nameAsc': 'Name: A-Z',
  'model.nameDesc': 'Name: Z-A',
  'model.filter': 'Filter',
  'model.enabledOnly': 'Show enabled models only',
  'model.showRetired': 'Show retired models',
  'model.search': 'Search models',
  'model.searchPlaceholder': 'Search model name or ID',
  'model.count': '{count} models',
  'model.refresh': 'Refresh models',
  'model.saveFailed': 'Failed to save model settings: {error}',
  'model.loading': 'Loading models...',
  'model.loadFailed': 'Failed to load models: {error}',
  'model.retry': 'Retry',
  'model.empty': 'No matching models.',
} satisfies Messages;
