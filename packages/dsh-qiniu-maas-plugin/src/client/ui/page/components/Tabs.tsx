import type { ReactNode } from 'react';
import css from './Tabs.module.css';
import { useQiniuT } from '../../i18n/index.ts';

export type Tab = 'model-center' | 'settings';

const TAB_ITEMS: readonly Tab[] = ['model-center', 'settings'];

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Tabs({ activeTab, onTabChange }: Props): ReactNode {
  const t = useQiniuT();
  return (
    <nav className={css.tabs} role="tablist" aria-label={t('tabs.aria')}>
      {TAB_ITEMS.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          className={activeTab === id ? css.active : undefined}
          onClick={() => onTabChange(id)}
        >
          {t(id === 'model-center' ? 'tabs.modelCenter' : 'tabs.settings')}
        </button>
      ))}
    </nav>
  );
}
