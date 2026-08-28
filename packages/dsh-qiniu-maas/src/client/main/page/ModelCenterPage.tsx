import { useState, type ReactNode } from 'react';
import type { Model, QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../../qiniu-config.ts';
import { ModelSettingsPanel } from './panels/ModelSettingsPanel.tsx';
import { ModelsPanel } from './panels/ModelsPanel.tsx';
import { ModelTabs, type ModelTab } from './ModelTabs.tsx';

interface ModelPanelProps {
  market: readonly Model[];
  enabledModelIds: readonly string[];
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

interface SettingsPanelProps {
  configured: boolean;
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
  value: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
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
