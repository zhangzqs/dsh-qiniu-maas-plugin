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
  type ModelSortOrder,
} from './model-utils.ts';
import css from './ModelCenterPanel.module.css';

const SORT_OPTIONS = [
  { id: 'release-newest', label: '发布时间：最新' },
  { id: 'release-oldest', label: '发布时间：最早' },
  { id: 'name-asc', label: '名称：A-Z' },
  { id: 'name-desc', label: '名称：Z-A' },
] as const;

const FILTER_OPTIONS = [
  { id: 'enabled', label: '仅显示已启用模型' },
  { id: 'retired', label: '显示已退役模型' },
] as const;

export interface Props {
  enabledModelIds: readonly string[];
  modelMarketRegion: QiniuRegion;
  fetchMarketModels: (region: QiniuRegion) => Promise<readonly Model[]>;
  setEnabledModels: (models: readonly Model[]) => Promise<void>;
}

export function ModelCenterPanel({
  enabledModelIds,
  modelMarketRegion,
  fetchMarketModels,
  setEnabledModels,
}: Props): ReactNode {
  const [models, setLoadedModels] = useState<readonly Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);
  const [showRetired, setShowRetired] = useState(false);
  const [sortOrder, setSortOrder] = useState<ModelSortOrder>('release-newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const [updatingModelId, setUpdatingModelId] = useState<string>();
  const requestId = useRef(0);
  const enabledModelIdSet = useMemo(
    () => new Set(enabledModelIds),
    [enabledModelIds],
  );
  const visibleModels = useMemo(() => {
    const filtered = filterModels(
      models,
      showEnabledOnly,
      enabledModelIds,
      query,
      showRetired,
    );
    return sortModels(filtered, sortOrder);
  }, [enabledModelIds, models, query, showEnabledOnly, showRetired, sortOrder]);
  const selectedModel = models.find((model) => model.id === selectedModelId);

  const loadMarketModels = useCallback(
    async (isRefresh = false): Promise<void> => {
      const currentRequestId = ++requestId.current;
      setError(null);
      setActionError(null);
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
        setIsRefreshing(false);
        setLoadedModels([]);
      }

      try {
        const nextModels = await fetchMarketModels(modelMarketRegion);
        if (currentRequestId === requestId.current) {
          setLoadedModels(nextModels);
        }
      } catch (reason) {
        if (currentRequestId === requestId.current) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [fetchMarketModels, modelMarketRegion],
  );

  useEffect(() => {
    void loadMarketModels();
  }, [loadMarketModels]);

  const handleToggle = useCallback(
    async (id: string): Promise<void> => {
      const model = models.find((item) => item.id === id);
      const isEnabled = enabledModelIdSet.has(id);
      if (model === undefined || (model.suggested_model && !isEnabled)) return;

      setUpdatingModelId(id);
      setActionError(null);
      try {
        await setEnabledModels(toggleModel(models, enabledModelIds, id));
      } catch (reason) {
        setActionError(
          reason instanceof Error ? reason.message : String(reason),
        );
      } finally {
        setUpdatingModelId(undefined);
      }
    },
    [enabledModelIdSet, enabledModelIds, models, setEnabledModels],
  );

  return (
    <div>
      <div className={css.toolbar}>
        <Menu
          open={isSortMenuOpen}
          anchor={
            <Button
              variant="outline"
              className={css.sortButton}
              aria-label="模型排序"
              onClick={() => setIsSortMenuOpen((open) => !open)}
            >
              {SORT_OPTIONS.find((item) => item.id === sortOrder)?.label}
              <IconChevronDownOutline14 />
            </Button>
          }
          items={SORT_OPTIONS}
          selectedId={sortOrder}
          onSelect={(id) => {
            setSortOrder(id as ModelSortOrder);
            setIsSortMenuOpen(false);
          }}
          onClose={() => setIsSortMenuOpen(false)}
          align="start"
          dense
        />
        <Menu
          open={isFilterMenuOpen}
          anchor={
            <Button
              variant="outline"
              className={css.filterButton}
              aria-label="模型筛选"
              onClick={() => setIsFilterMenuOpen((open) => !open)}
            >
              筛选
              {showEnabledOnly || showRetired
                ? ` · ${Number(showEnabledOnly) + Number(showRetired)}`
                : ''}
              <IconChevronDownOutline14 />
            </Button>
          }
          items={FILTER_OPTIONS}
          selectedIds={[
            ...(showEnabledOnly ? ['enabled'] : []),
            ...(showRetired ? ['retired'] : []),
          ]}
          onSelect={(id) => {
            if (id === 'enabled') setShowEnabledOnly((isShown) => !isShown);
            if (id === 'retired') setShowRetired((retired) => !retired);
          }}
          onClose={() => setIsFilterMenuOpen(false)}
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
        <span className={css.count}>{visibleModels.length} 个模型</span>
        <Button
          variant="toolbar"
          size="sm"
          icon={<IconRefreshOutline16 />}
          type="button"
          className={`${css.refreshButton} ${isRefreshing ? css.refreshing : ''}`}
          aria-label="刷新模型"
          title="刷新模型"
          onClick={() => void loadMarketModels(true)}
          disabled={isLoading || isRefreshing}
        />
      </div>
      {actionError !== null && (
        <p className={css.actionError}>模型设置保存失败：{actionError}</p>
      )}
      {isLoading && <p className={css.listState}>模型加载中...</p>}
      {!isLoading && error !== null && (
        <div className={`${css.listState} ${css.error}`}>
          <p>模型加载失败：{error}</p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => void loadMarketModels(true)}
            disabled={isRefreshing}
          >
            重试
          </Button>
        </div>
      )}
      {!isLoading && error === null && (
        <>
          <div className={css.grid}>
            {visibleModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isEnabled={enabledModelIdSet.has(model.id)}
                updating={updatingModelId === model.id}
                onViewDetails={setSelectedModelId}
                onToggleEnabled={handleToggle}
              />
            ))}
          </div>
          {visibleModels.length === 0 && (
            <p className={css.empty}>没有匹配的模型。</p>
          )}
        </>
      )}
      {selectedModel !== undefined && (
        <ModelDetailDialog
          model={selectedModel}
          onClose={() => setSelectedModelId(undefined)}
        />
      )}
    </div>
  );
}
