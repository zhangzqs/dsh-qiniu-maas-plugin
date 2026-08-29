import { useState, type ReactNode } from 'react';
import type { Model, QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../../qiniu-config.ts';
import { ModelCenterPanel } from './panels/ModelCenterPanel.tsx';
import { SettingsPanel } from './panels/SettingsPanel.tsx';
import { Tabs, type Tab } from './Tabs.tsx';

export interface ModelCenterPanelProps {
  models: readonly Model[];
  enabledModelIds: readonly string[];
  onRefresh: () => Promise<void>;
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export interface SettingsPanelProps {
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
  models: ModelCenterPanelProps;
  settings: SettingsPanelProps;
}

export function Page({ models, settings }: Props): ReactNode {
  const [tab, setTab] = useState<Tab>('model-center');
  return (
    <>
      <Tabs tab={tab} onChange={setTab} />
      {tab === 'model-center' && <ModelCenterPanel {...models} />}
      {tab === 'settings' && <SettingsPanel {...settings} />}
    </>
  );
}
