import { useState, type ReactNode } from 'react';
import type { Model, QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../../qiniu-config.ts';
import { ModelSettingsPanel } from './panels/ModelSettingsPanel.tsx';
import { ModelsPanel } from './panels/ModelsPanel.tsx';
import { ModelTabs, type ModelTab } from './ModelTabs.tsx';

interface ModelPanelProps {
  models: readonly Model[];
  enabledModelIds: readonly string[];
  onRefresh: () => Promise<void>;
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

interface SettingsPanelProps {
  apiKeyConfigured: boolean;
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onApiKeySubmit: () => Promise<void>;
  onModelMarketRegionChange: (region: QiniuRegion) => void;
  onInferenceProtocolChange: (protocol: QiniuInferenceProtocol) => void;
}

interface Props {
  models: ModelPanelProps;
  settings: SettingsPanelProps;
}

export function ModelCenterPage({ models, settings }: Props): ReactNode {
  const [tab, setTab] = useState<ModelTab>('models');
  return (
    <>
      <ModelTabs tab={tab} onChange={setTab} />
      {tab === 'models' && <ModelsPanel {...models} />}
      {tab === 'settings' && <ModelSettingsPanel {...settings} />}
    </>
  );
}
