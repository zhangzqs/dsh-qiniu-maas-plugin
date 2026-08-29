import type { Model } from 'qiniu-maas-model-market';

export type ModelSort =
  | 'release-newest'
  | 'release-oldest'
  | 'name-asc'
  | 'name-desc';

export function filterModels(
  models: readonly Model[],
  onlyEnabled: boolean,
  enabledModelIds: readonly string[],
  query: string,
  showRetired = false,
): Model[] {
  const enabledModelIdsSet = new Set(enabledModelIds);
  const needle = query.trim().toLowerCase();

  return models.filter((model) => {
    const isEnabled = !onlyEnabled || enabledModelIdsSet.has(model.id);
    const isVisible = showRetired || !model.suggested_model;
    const matchesQuery =
      needle.length === 0 ||
      `${model.id} ${model.name} ${model.description}`
        .toLowerCase()
        .includes(needle);
    return isEnabled && isVisible && matchesQuery;
  });
}

export function sortModels(models: readonly Model[], sort: ModelSort): Model[] {
  return [...models].sort((left, right) => {
    switch (sort) {
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
