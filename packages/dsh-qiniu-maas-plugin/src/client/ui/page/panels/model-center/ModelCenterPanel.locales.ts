import type { QiniuLocaleMessages } from '../../../i18n/index.ts';

export const modelCenterKeys = {
  count: 'model.center.count',
  empty: 'model.center.empty',
  enabledOnly: 'model.center.enabledOnly',
  filter: 'model.center.filter',
  loadFailed: 'model.center.loadFailed',
  loading: 'model.center.loading',
  nameAsc: 'model.center.nameAsc',
  nameDesc: 'model.center.nameDesc',
  refresh: 'model.center.refresh',
  retry: 'model.center.retry',
  saveFailed: 'model.center.saveFailed',
  search: 'model.center.search',
  searchPlaceholder: 'model.center.searchPlaceholder',
  showRetired: 'model.center.showRetired',
  sort: 'model.center.sort',
  sortNewest: 'model.center.sortNewest',
  sortOldest: 'model.center.sortOldest',
} as const;

export const modelCenterMessages = {
  [modelCenterKeys.count]: {
    zh: '{count} 个模型',
    en: '{count} models',
  },
  [modelCenterKeys.empty]: {
    zh: '没有匹配的模型。',
    en: 'No matching models.',
  },
  [modelCenterKeys.enabledOnly]: {
    zh: '仅显示已启用模型',
    en: 'Show enabled models only',
  },
  [modelCenterKeys.filter]: {
    zh: '筛选',
    en: 'Filter',
  },
  [modelCenterKeys.loadFailed]: {
    zh: '模型加载失败：{error}',
    en: 'Failed to load models: {error}',
  },
  [modelCenterKeys.loading]: {
    zh: '模型加载中...',
    en: 'Loading models...',
  },
  [modelCenterKeys.nameAsc]: {
    zh: '名称：A-Z',
    en: 'Name: A-Z',
  },
  [modelCenterKeys.nameDesc]: {
    zh: '名称：Z-A',
    en: 'Name: Z-A',
  },
  [modelCenterKeys.refresh]: {
    zh: '刷新模型',
    en: 'Refresh models',
  },
  [modelCenterKeys.retry]: {
    zh: '重试',
    en: 'Retry',
  },
  [modelCenterKeys.saveFailed]: {
    zh: '模型设置保存失败：{error}',
    en: 'Failed to save model settings: {error}',
  },
  [modelCenterKeys.search]: {
    zh: '搜索模型',
    en: 'Search models',
  },
  [modelCenterKeys.searchPlaceholder]: {
    zh: '搜索模型名称或 ID',
    en: 'Search model name or ID',
  },
  [modelCenterKeys.showRetired]: {
    zh: '显示已退役模型',
    en: 'Show retired models',
  },
  [modelCenterKeys.sort]: {
    zh: '模型排序',
    en: 'Sort models',
  },
  [modelCenterKeys.sortNewest]: {
    zh: '发布时间：最新',
    en: 'Release date: newest',
  },
  [modelCenterKeys.sortOldest]: {
    zh: '发布时间：最早',
    en: 'Release date: oldest',
  },
} satisfies QiniuLocaleMessages;
