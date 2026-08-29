import type { QiniuLocaleMessages } from '../../../i18n/index.ts';

export const modelCenterMessages = {
  'model.center.count': { zh: '{count} 个模型', en: '{count} models' },
  'model.center.empty': { zh: '没有匹配的模型。', en: 'No matching models.' },
  'model.center.enabledOnly': {
    zh: '仅显示已启用模型',
    en: 'Show enabled models only',
  },
  'model.center.filter': { zh: '筛选', en: 'Filter' },
  'model.center.loadFailed': {
    zh: '模型加载失败：{error}',
    en: 'Failed to load models: {error}',
  },
  'model.center.loading': { zh: '模型加载中...', en: 'Loading models...' },
  'model.center.nameAsc': { zh: '名称：A-Z', en: 'Name: A-Z' },
  'model.center.nameDesc': { zh: '名称：Z-A', en: 'Name: Z-A' },
  'model.center.refresh': { zh: '刷新模型', en: 'Refresh models' },
  'model.center.retry': { zh: '重试', en: 'Retry' },
  'model.center.saveFailed': {
    zh: '模型设置保存失败：{error}',
    en: 'Failed to save model settings: {error}',
  },
  'model.center.search': { zh: '搜索模型', en: 'Search models' },
  'model.center.searchPlaceholder': {
    zh: '搜索模型名称或 ID',
    en: 'Search model name or ID',
  },
  'model.center.showRetired': {
    zh: '显示已退役模型',
    en: 'Show retired models',
  },
  'model.center.sort': { zh: '模型排序', en: 'Sort models' },
  'model.center.sortNewest': {
    zh: '发布时间：最新',
    en: 'Release date: newest',
  },
  'model.center.sortOldest': {
    zh: '发布时间：最早',
    en: 'Release date: oldest',
  },
} satisfies QiniuLocaleMessages;
