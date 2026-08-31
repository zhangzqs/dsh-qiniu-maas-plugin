import type { Model } from 'qiniu-maas-market-sdk';

export type ModelSortOrder =
  | 'release-newest'
  | 'release-oldest'
  | 'name-asc'
  | 'name-desc';

export function filterModels(
  models: readonly Model[],
  showEnabledOnly: boolean,
  enabledModelIds: readonly string[],
  query: string,
  includeRetired = false,
): Model[] {
  const enabledModelIdsSet = new Set(enabledModelIds);
  const needle = query.trim().toLowerCase();

  return models.filter((model) => {
    const isEnabled = !showEnabledOnly || enabledModelIdsSet.has(model.id);
    const isVisible = includeRetired || !model.suggested_model;
    const matchesQuery =
      needle.length === 0 ||
      `${model.id} ${model.name} ${model.description}`
        .toLowerCase()
        .includes(needle);
    return isEnabled && isVisible && matchesQuery;
  });
}

export function sortModels(
  models: readonly Model[],
  sortOrder: ModelSortOrder,
): Model[] {
  return [...models].sort((left, right) => {
    switch (sortOrder) {
      case 'release-newest':
        return right.release_at.localeCompare(left.release_at);
      case 'release-oldest':
        return left.release_at.localeCompare(right.release_at);
      case 'name-asc':
        return left.name.localeCompare(right.name);
      case 'name-desc':
        return right.name.localeCompare(left.name);
      default:
        return right.release_at.localeCompare(left.release_at);
    }
  });
}
