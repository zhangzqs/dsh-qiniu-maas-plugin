import { useMemo, useState, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelCard } from '../../components/model/ModelCard.tsx';
import css from './ModelMarketPanel.module.css';

interface Props {
  market: readonly Model[];
  availableModelIds: readonly string[];
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export function ModelMarketPanel({
  market,
  availableModelIds,
  onDetails,
  onToggle,
}: Props): ReactNode {
  const [query, setQuery] = useState('');
  const availableModelIdsSet = new Set(availableModelIds);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return market.filter(
      (model) =>
        needle.length === 0 ||
        `${model.id} ${model.name} ${model.description}`
          .toLowerCase()
          .includes(needle),
    );
  }, [market, query]);

  return (
    <div>
      <div className={css.toolbar}>
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
