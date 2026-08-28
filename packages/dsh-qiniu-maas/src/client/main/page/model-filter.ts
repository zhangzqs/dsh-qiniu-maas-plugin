import type { Model } from 'qiniu-maas-model-market';

export function filterModels(
  models: readonly Model[],
  onlyEnabled: boolean,
  enabledModelIds: readonly string[],
  query: string,
): Model[] {
  const enabledModelIdsSet = new Set(enabledModelIds);
  const needle = query.trim().toLowerCase();

  return models.filter((model) => {
    const isEnabled = !onlyEnabled || enabledModelIdsSet.has(model.id);
    const matchesQuery =
      needle.length === 0 ||
      `${model.id} ${model.name} ${model.description}`
        .toLowerCase()
        .includes(needle);
    return isEnabled && matchesQuery;
  });
}
