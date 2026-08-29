import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  IconChevronDownOutline14,
  IconRefreshOutline16,
  Input,
  Menu,
} from '@deepseek-ai/dsh-client-ui-primitives';
import type { Model } from 'qiniu-maas-model-market';
import { ModelCard } from '../components/ModelCard.tsx';
import { filterModels, sortModels, type ModelSort } from './model-utils.ts';
import css from './ModelsPanel.module.css';

const SORT_ITEMS = [
  { id: 'release-newest', label: '发布时间：最新' },
  { id: 'release-oldest', label: '发布时间：最早' },
  { id: 'name-asc', label: '名称：A-Z' },
  { id: 'name-desc', label: '名称：Z-A' },
] as const;

const FILTER_ITEMS = [
  { id: 'enabled', label: '仅显示已启用模型' },
  { id: 'retired', label: '显示已退役模型' },
] as const;

interface Props {
  models: readonly Model[];
  enabledModelIds: readonly string[];
  onRefresh: () => Promise<void>;
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export function ModelsPanel({
  models,
  enabledModelIds,
  onRefresh,
  onDetails,
  onToggle,
}: Props): ReactNode {
  const [query, setQuery] = useState('');
  const [onlyEnabled, setOnlyEnabled] = useState(false);
  const [showRetired, setShowRetired] = useState(false);
  const [sort, setSort] = useState<ModelSort>('release-newest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const enabledModelIdsSet = useMemo(
    () => new Set(enabledModelIds),
    [enabledModelIds],
  );
  const visible = useMemo(() => {
    const filtered = filterModels(
      models,
      onlyEnabled,
      enabledModelIds,
      query,
      showRetired,
    );
    return sortModels(filtered, sort);
  }, [enabledModelIds, models, onlyEnabled, query, showRetired, sort]);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <div className={css.toolbar}>
        <Menu
          open={sortMenuOpen}
          anchor={
            <Button
              variant="outline"
              className={css.sortButton}
              aria-label="模型排序"
              onClick={() => setSortMenuOpen((open) => !open)}
            >
              {SORT_ITEMS.find((item) => item.id === sort)?.label}
              <IconChevronDownOutline14 />
            </Button>
          }
          items={SORT_ITEMS}
          selectedId={sort}
          onSelect={(id) => {
            setSort(id as ModelSort);
            setSortMenuOpen(false);
          }}
          onClose={() => setSortMenuOpen(false)}
          align="start"
          dense
        />
        <Menu
          open={filterMenuOpen}
          anchor={
            <Button
              variant="outline"
              className={css.filterButton}
              aria-label="模型筛选"
              onClick={() => setFilterMenuOpen((open) => !open)}
            >
              筛选
              {onlyEnabled || showRetired
                ? ` · ${Number(onlyEnabled) + Number(showRetired)}`
                : ''}
              <IconChevronDownOutline14 />
            </Button>
          }
          items={FILTER_ITEMS}
          selectedIds={[
            ...(onlyEnabled ? ['enabled'] : []),
            ...(showRetired ? ['retired'] : []),
          ]}
          onSelect={(id) => {
            if (id === 'enabled') setOnlyEnabled((enabled) => !enabled);
            if (id === 'retired') setShowRetired((retired) => !retired);
          }}
          onClose={() => setFilterMenuOpen(false)}
          align="start"
          dense
        />
        <Input
          className={css.search}
          aria-label="搜索模型"
          placeholder="搜索模型名称或 ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className={css.count}>{visible.length} 个模型</span>
        <Button
          variant="toolbar"
          size="sm"
          icon={<IconRefreshOutline16 />}
          type="button"
          className={`${css.refreshButton} ${refreshing ? css.refreshing : ''}`}
          aria-label="刷新模型"
          title="刷新模型"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
        />
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
