import { useCallback, useState, type ReactNode } from 'react';
import type {
  InjectFace,
  PropsRuntime,
} from '@deepseek-ai/dsh-client-ui-slots';
import { Button } from '@deepseek-ai/dsh-client-ui-primitives';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInjected } from '../state/qiniu-state.ts';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';
import { Page } from './page/Page.tsx';
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
  const selected = state.models.find((model) => model.id === selectedId);
  const selectModel = useCallback((id: string): void => {
    setSelectedId(id);
  }, []);

  const toggleModel = useCallback(
    async (id: string): Promise<void> => {
      const model = state.models.find((item) => item.id === id);
      if (model === undefined) return;
      const enabledModelIds = new Set(state.enabledModelIds);
      const next = enabledModelIds.has(model.id)
        ? state.models.filter(
            (item) => enabledModelIds.has(item.id) && item.id !== model.id,
          )
        : state.models.filter(
            (item) => enabledModelIds.has(item.id) || item.id === model.id,
          );
      await saveModels(next);
    },
    [saveModels, state.enabledModelIds, state.models],
  );

  return (
    <section className={css.page}>
      <header className={css.header}>
        <div>
          <p className={css.kicker}>QINIU MAAS</p>
          <h2>七牛 MaaS</h2>
          <p className={css.subtitle}>管理七牛 AI 大模型推理服务。</p>
          <a
            className={css.portalLink}
            href="https://portal.qiniu.com/ai-inference/model"
            target="_blank"
            rel="noreferrer"
          >
            前往七牛 AI 大模型控制台
          </a>
        </div>
      </header>
      {state.status === 'loading' && <p className={css.state}>模型加载中...</p>}
      {state.status === 'error' && (
        <div className={`${css.state} ${css.error}`}>
          <p>模型加载失败：{state.error}</p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => {
              void refresh();
            }}
          >
            重试
          </Button>
        </div>
      )}
      {state.status === 'ready' && (
        <Page
          models={{
            models: state.models,
            enabledModelIds: state.enabledModelIds,
            onRefresh: refresh,
            onDetails: selectModel,
            onToggle: toggleModel,
          }}
          settings={{
            apiKeyConfigured: state.apiKeyConfigured,
            modelMarketRegion: state.modelMarketRegion,
            inferenceProtocol: state.inferenceProtocol,
            apiKey,
            onApiKeyChange: setApiKeyDraft,
            onApiKeySubmit: async () => {
              await setApiKey(apiKey);
              setApiKeyDraft('');
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
