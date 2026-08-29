import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Button,
  IconChevronDownOutline14,
  IconRefreshOutline16,
  Input,
  Menu,
} from '@deepseek-ai/dsh-client-ui-primitives';
import type { Model, QiniuRegion } from 'qiniu-maas-model-market';
import { ModelCard } from './components/ModelCard.tsx';
import { ModelDetailDialog } from './components/ModelDetailDialog.tsx';
import {
  filterModels,
  sortModels,
  toggleModel,
  type ModelSort,
} from './model-utils.ts';
import css from './ModelCenterPanel.module.css';

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

export interface Props {
  enabledModelIds: readonly string[];
  modelMarketRegion: QiniuRegion;
  fetchModels: (region: QiniuRegion) => Promise<readonly Model[]>;
  onSaveModels: (models: readonly Model[]) => Promise<void>;
}

export function ModelCenterPanel({
  enabledModelIds,
  modelMarketRegion,
  fetchModels,
  onSaveModels,
}: Props): ReactNode {
  const [models, setModels] = useState<readonly Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [onlyEnabled, setOnlyEnabled] = useState(false);
  const [showRetired, setShowRetired] = useState(false);
  const [sort, setSort] = useState<ModelSort>('release-newest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [savingModelId, setSavingModelId] = useState<string>();
  const requestId = useRef(0);
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
  const selectedModel = models.find((model) => model.id === selectedId);

  const loadModels = useCallback(
    async (isRefresh = false): Promise<void> => {
      const currentRequestId = ++requestId.current;
      setError(null);
      setActionError(null);
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setRefreshing(false);
        setModels([]);
      }

      try {
        const nextModels = await fetchModels(modelMarketRegion);
        if (currentRequestId === requestId.current) {
          setModels(nextModels);
        }
      } catch (reason) {
        if (currentRequestId === requestId.current) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      } finally {
        if (currentRequestId === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [fetchModels, modelMarketRegion],
  );

  useEffect(() => {
    void loadModels();
  }, [loadModels]);

  const handleToggle = useCallback(
    async (id: string): Promise<void> => {
      const model = models.find((item) => item.id === id);
      const isEnabled = enabledModelIdsSet.has(id);
      if (model === undefined || (model.suggested_model && !isEnabled)) return;

      setSavingModelId(id);
      setActionError(null);
      try {
        await onSaveModels(toggleModel(models, enabledModelIds, id));
      } catch (reason) {
        setActionError(
          reason instanceof Error ? reason.message : String(reason),
        );
      } finally {
        setSavingModelId(undefined);
      }
    },
    [enabledModelIds, enabledModelIdsSet, models, onSaveModels],
  );

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
          onClick={() => void loadModels(true)}
          disabled={loading || refreshing}
        />
      </div>
      {actionError !== null && (
        <p className={css.actionError}>模型设置保存失败：{actionError}</p>
      )}
      {loading && <p className={css.listState}>模型加载中...</p>}
      {!loading && error !== null && (
        <div className={`${css.listState} ${css.error}`}>
          <p>模型加载失败：{error}</p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => void loadModels(true)}
            disabled={refreshing}
          >
            重试
          </Button>
        </div>
      )}
      {!loading && error === null && (
        <>
          <div className={css.grid}>
            {visible.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isEnabled={enabledModelIdsSet.has(model.id)}
                saving={savingModelId === model.id}
                onDetails={setSelectedId}
                onToggle={handleToggle}
              />
            ))}
          </div>
          {visible.length === 0 && (
            <p className={css.empty}>没有匹配的模型。</p>
          )}
        </>
      )}
      {selectedModel !== undefined && (
        <ModelDetailDialog
          model={selectedModel}
          onClose={() => setSelectedId(undefined)}
        />
      )}
    </div>
  );
}
