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
import { QiniuLocaleContext, type QiniuTranslator } from '../i18n/index.ts';

interface Props {
  t: QiniuTranslator;
  models: ModelCenterPanelProps;
  settings: SettingsPanelProps;
}

export function Page({ t, models, settings }: Props): ReactNode {
  const [activeTab, setActiveTab] = useState<Tab>('model-center');
  return (
    <QiniuLocaleContext.Provider value={t}>
      <section className={css.page}>
        <PageHeader />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'model-center' && <ModelCenterPanel {...models} />}
        {activeTab === 'settings' && <SettingsPanel {...settings} />}
      </section>
    </QiniuLocaleContext.Provider>
  );
}

/* Kept as a named alias for consumers that compose the page props. */
export type { Props as ModelCenterPanelProps } from './panels/model-center/ModelCenterPanel.tsx';
export type { Props as SettingsPanelProps } from './panels/settings/SettingsPanel.tsx';
