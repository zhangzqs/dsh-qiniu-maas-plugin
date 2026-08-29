import { useState, type ReactNode } from 'react';
import {
  ModelCenterPanel,
  type Props as ModelCenterPanelProps,
} from './panels/model-center/ModelCenterPanel.tsx';
import {
  SettingsPanel,
  type Props as SettingsPanelProps,
} from './panels/settings/SettingsPanel.tsx';
import { PageHeader } from './components/PageHeader.tsx';
import { Tabs, type Tab } from './components/Tabs.tsx';
import css from './Page.module.css';

interface Props {
  models: ModelCenterPanelProps;
  settings: SettingsPanelProps;
}

export function Page({ models, settings }: Props): ReactNode {
  const [tab, setTab] = useState<Tab>('model-center');
  return (
    <section className={css.page}>
      <PageHeader />
      <Tabs tab={tab} onChange={setTab} />
      {tab === 'model-center' && <ModelCenterPanel {...models} />}
      {tab === 'settings' && <SettingsPanel {...settings} />}
    </section>
  );
}

/* Kept as a named alias for consumers that compose the page props. */
export type { Props as ModelCenterPanelProps } from './panels/model-center/ModelCenterPanel.tsx';
export type { Props as SettingsPanelProps } from './panels/settings/SettingsPanel.tsx';
