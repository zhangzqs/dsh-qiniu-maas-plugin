import type { ReactNode } from 'react';
import type {
  InjectFace,
  PropsRuntime,
} from '@deepseek-ai/dsh-client-ui-slots';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInjected } from '../controller/qiniu-state.ts';
import type { QiniuInferenceProtocol } from '../qiniu-config.ts';
import { Page } from './page/Page.tsx';

type Props = PropsRuntime<'settings.section'> & InjectFace<QiniuInjected>;

export function QiniuSettingsSection(props: Props): ReactNode {
  const {
    checkApiKeyConfigured,
    fetchMarketModels,
    setEnabledModels,
    setApiKey,
    setModelMarketRegion,
    setInferenceProtocol,
    useSnapshot,
  } = props;
  const state = useSnapshot((snapshot) => snapshot);

  return (
    <Page
      models={{
        enabledModelIds: state.enabledModelIds,
        modelMarketRegion: state.modelMarketRegion,
        fetchMarketModels,
        setEnabledModels,
      }}
      settings={{
        checkApiKeyConfigured,
        setApiKey,
        modelMarketRegion: state.modelMarketRegion,
        inferenceProtocol: state.inferenceProtocol,
        onModelMarketRegionChange: (region: QiniuRegion) => {
          void setModelMarketRegion(region);
        },
        onInferenceProtocolChange: (protocol: QiniuInferenceProtocol) => {
          void setInferenceProtocol(protocol);
        },
      }}
    />
  );
}
