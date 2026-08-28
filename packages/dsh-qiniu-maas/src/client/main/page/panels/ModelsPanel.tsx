import { useMemo, useState, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelCard } from '../components/model/ModelCard.tsx';
import type { ModelFilter } from '../model-filter.ts';
import { filterModels } from '../model-filter.ts';
import css from './ModelsPanel.module.css';

interface Props {
  market: readonly Model[];
  availableModelIds: readonly string[];
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export function ModelsPanel({
  market,
  availableModelIds,
  onDetails,
  onToggle,
}: Props): ReactNode {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ModelFilter>('all');
  const availableModelIdsSet = useMemo(
    () => new Set(availableModelIds),
    [availableModelIds],
  );
  const visible = useMemo(() => {
    return filterModels(market, filter, availableModelIds, query);
  }, [availableModelIds, filter, market, query]);

  return (
    <div>
      <div className={css.toolbar}>
        <div className={css.filters} role="group" aria-label="模型筛选">
          <button
            type="button"
            className={filter === 'all' ? css.activeFilter : undefined}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            全部模型
          </button>
          <button
            type="button"
            className={filter === 'available' ? css.activeFilter : undefined}
            aria-pressed={filter === 'available'}
            onClick={() => setFilter('available')}
          >
            可用模型
          </button>
        </div>
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
            isAvailable={availableModelIdsSet.has(model.id)}
            onDetails={onDetails}
            onToggle={onToggle}
          />
        ))}
      </div>
      {visible.length === 0 && <p className={css.empty}>没有匹配的模型。</p>}
    </div>
  );
}
