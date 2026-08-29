import { useCallback, useState, type ReactNode } from 'react';
import type {
  InjectFace,
  PropsRuntime,
} from '@deepseek-ai/dsh-client-ui-slots';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInjected } from '../state/qiniu-state.ts';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';
import { ModelCenterPage } from './page/ModelCenterPage.tsx';
import { ModelDetailDialog } from './page/components/ModelDetailDialog.tsx';
import css from './QiniuSettingsSection.module.css';

type Props = PropsRuntime<'settings.section'> & InjectFace<QiniuInjected>;

export function QiniuSettingsSection(props: Props): ReactNode {
  const {
    refresh,
    saveModels,
    setApiKey,
    setModelMarketRegion,
    setInferenceProtocol,
    useSnapshot,
  } = props;
  const state = useSnapshot((snapshot) => snapshot);
  const [selectedId, setSelectedId] = useState<string>();
  const [apiKey, setApiKeyDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const selected = state.market.find((model) => model.id === selectedId);
  const selectModel = useCallback((id: string): void => {
    setSelectedId(id);
  }, []);

  const toggleModel = useCallback(
    async (id: string): Promise<void> => {
      const model = state.market.find((item) => item.id === id);
      if (model === undefined) return;
      const enabledModelIds = new Set(state.enabledModelIds);
      const next = enabledModelIds.has(model.id)
        ? state.market.filter(
            (item) => enabledModelIds.has(item.id) && item.id !== model.id,
          )
        : state.market.filter(
            (item) => enabledModelIds.has(item.id) || item.id === model.id,
          );
      await saveModels(next);
    },
    [saveModels, state.enabledModelIds, state.market],
  );

  const submitKey = async (): Promise<void> => {
    setSaving(true);
    try {
      await setApiKey(apiKey);
      setApiKeyDraft('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={css.page}>
      <header className={css.header}>
        <div>
          <p className={css.kicker}>QINIU MAAS</p>
          <h2>七牛 MaaS</h2>
          <p className={css.subtitle}>浏览模型，启用后即可在会话中选择。</p>
        </div>
        <button
          type="button"
          className={css.iconButton}
          aria-label="刷新模型"
          onClick={() => {
            void refresh();
          }}
        >
          ↻
        </button>
      </header>
      {state.refreshing && state.status === 'ready' && (
        <p className={css.state}>正在更新模型...</p>
      )}
      {state.status === 'loading' && <p className={css.state}>模型加载中...</p>}
      {state.status === 'error' && (
        <div className={`${css.state} ${css.error}`}>
          <p>模型加载失败：{state.error}</p>
          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
          >
            重试
          </button>
        </div>
      )}
      {state.status === 'ready' && (
        <ModelCenterPage
          models={{
            market: state.market,
            enabledModelIds: state.enabledModelIds,
            onDetails: selectModel,
            onToggle: toggleModel,
          }}
          settings={{
            configured: state.apiKeyConfigured,
            modelMarketRegion: state.modelMarketRegion,
            inferenceProtocol: state.inferenceProtocol,
            value: apiKey,
            saving,
            onChange: setApiKeyDraft,
            onSubmit: () => {
              void submitKey();
            },
            onModelMarketRegionChange: (region: QiniuRegion) => {
              void setModelMarketRegion(region);
            },
            onInferenceProtocolChange: (protocol: QiniuInferenceProtocol) => {
              void setInferenceProtocol(protocol);
            },
          }}
        />
      )}
      {selected !== undefined && (
        <ModelDetailDialog
          key={selected.id}
          model={selected}
          onClose={() => setSelectedId(undefined)}
        />
      )}
    </section>
  );
}
