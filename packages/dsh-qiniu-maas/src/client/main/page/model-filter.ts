import type { Model } from 'qiniu-maas-model-market';

export type ModelFilter = 'all' | 'available';

export function filterModels(
  models: readonly Model[],
  filter: ModelFilter,
  availableModelIds: readonly string[],
  query: string,
): Model[] {
  const availableModelIdsSet = new Set(availableModelIds);
  const needle = query.trim().toLowerCase();

  return models.filter((model) => {
    const isAvailable = filter === 'all' || availableModelIdsSet.has(model.id);
    const matchesQuery =
      needle.length === 0 ||
      `${model.id} ${model.name} ${model.description}`
        .toLowerCase()
        .includes(needle);
    return isAvailable && matchesQuery;
  });
}
