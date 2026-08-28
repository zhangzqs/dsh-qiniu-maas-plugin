import { useMemo, useState, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelCard } from '../components/model/ModelCard.tsx';
import css from './ModelsPanel.module.css';

type ModelSort = 'release-newest' | 'release-oldest' | 'name-asc' | 'name-desc';

interface Props {
  market: readonly Model[];
  enabledModelIds: readonly string[];
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

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

export function ModelsPanel({
  market,
  enabledModelIds,
  onDetails,
  onToggle,
}: Props): ReactNode {
  const [query, setQuery] = useState('');
  const [onlyEnabled, setOnlyEnabled] = useState(false);
  const [sort, setSort] = useState<ModelSort>('release-newest');
  const enabledModelIdsSet = useMemo(
    () => new Set(enabledModelIds),
    [enabledModelIds],
  );
  const visible = useMemo(() => {
    const filtered = filterModels(market, onlyEnabled, enabledModelIds, query);
    return sortModels(filtered, sort);
  }, [enabledModelIds, market, onlyEnabled, query, sort]);

  return (
    <div>
      <div className={css.toolbar}>
        <label className={css.filter}>
          <input
            type="checkbox"
            checked={onlyEnabled}
            onChange={(event) => setOnlyEnabled(event.target.checked)}
          />
          仅显示已启用模型
        </label>
        <select
          aria-label="模型排序"
          value={sort}
          onChange={(event) => setSort(event.target.value as ModelSort)}
        >
          <option value="release-newest">发布时间：最新</option>
          <option value="release-oldest">发布时间：最早</option>
          <option value="name-asc">名称：A-Z</option>
          <option value="name-desc">名称：Z-A</option>
        </select>
        <input
          aria-label="搜索模型"
          placeholder="搜索模型名称或 ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span>{visible.length} 个模型</span>
      </div>
      <div className={css.grid}>
        {visible.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isEnabled={enabledModelIdsSet.has(model.id)}
            onDetails={onDetails}
            onToggle={onToggle}
          />
        ))}
      </div>
      {visible.length === 0 && <p className={css.empty}>没有匹配的模型。</p>}
    </div>
  );
}
