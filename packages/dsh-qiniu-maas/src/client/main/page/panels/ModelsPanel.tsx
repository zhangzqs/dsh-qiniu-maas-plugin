import { useMemo, useState, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelCard } from '../components/model/ModelCard.tsx';
import { filterModels } from '../model-filter.ts';
import css from './ModelsPanel.module.css';

interface Props {
  market: readonly Model[];
  enabledModelIds: readonly string[];
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export function ModelsPanel({
  market,
  enabledModelIds,
  onDetails,
  onToggle,
}: Props): ReactNode {
  const [query, setQuery] = useState('');
  const [onlyEnabled, setOnlyEnabled] = useState(false);
  const enabledModelIdsSet = useMemo(
    () => new Set(enabledModelIds),
    [enabledModelIds],
  );
  const visible = useMemo(() => {
    return filterModels(market, onlyEnabled, enabledModelIds, query);
  }, [enabledModelIds, market, onlyEnabled, query]);

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
