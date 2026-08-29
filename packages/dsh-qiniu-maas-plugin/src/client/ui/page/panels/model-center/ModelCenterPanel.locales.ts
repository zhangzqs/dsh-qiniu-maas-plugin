import type { QiniuLocaleMessages } from '../../../i18n/namespace.ts';

export const modelCenterMessages = {
  'model.count': { zh: '{count} 个模型', en: '{count} models' },
  'model.empty': { zh: '没有匹配的模型。', en: 'No matching models.' },
  'model.enabledOnly': {
    zh: '仅显示已启用模型',
    en: 'Show enabled models only',
  },
  'model.filter': { zh: '筛选', en: 'Filter' },
  'model.loadFailed': {
    zh: '模型加载失败：{error}',
    en: 'Failed to load models: {error}',
  },
  'model.loading': { zh: '模型加载中...', en: 'Loading models...' },
  'model.nameAsc': { zh: '名称：A-Z', en: 'Name: A-Z' },
  'model.nameDesc': { zh: '名称：Z-A', en: 'Name: Z-A' },
  'model.refresh': { zh: '刷新模型', en: 'Refresh models' },
  'model.retry': { zh: '重试', en: 'Retry' },
  'model.saveFailed': {
    zh: '模型设置保存失败：{error}',
    en: 'Failed to save model settings: {error}',
  },
  'model.search': { zh: '搜索模型', en: 'Search models' },
  'model.searchPlaceholder': {
    zh: '搜索模型名称或 ID',
    en: 'Search model name or ID',
  },
  'model.showRetired': { zh: '显示已退役模型', en: 'Show retired models' },
  'model.sort': { zh: '模型排序', en: 'Sort models' },
  'model.sortNewest': { zh: '发布时间：最新', en: 'Release date: newest' },
  'model.sortOldest': { zh: '发布时间：最早', en: 'Release date: oldest' },
} satisfies QiniuLocaleMessages<
  | 'model.count'
  | 'model.empty'
  | 'model.enabledOnly'
  | 'model.filter'
  | 'model.loadFailed'
  | 'model.loading'
  | 'model.nameAsc'
  | 'model.nameDesc'
  | 'model.refresh'
  | 'model.retry'
  | 'model.saveFailed'
  | 'model.search'
  | 'model.searchPlaceholder'
  | 'model.showRetired'
  | 'model.sort'
  | 'model.sortNewest'
  | 'model.sortOldest'
>;
