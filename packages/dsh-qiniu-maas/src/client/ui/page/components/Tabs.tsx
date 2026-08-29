import type { ReactNode } from 'react';
import css from './Tabs.module.css';

export type Tab = 'model-center' | 'settings';

const TAB_ITEMS: readonly [Tab, string][] = [
  ['model-center', '模型中心'],
  ['settings', '设置'],
];

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Tabs({ activeTab, onTabChange }: Props): ReactNode {
  return (
    <nav className={css.tabs} role="tablist" aria-label="Qiniu MaaS 设置">
      {TAB_ITEMS.map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          className={activeTab === id ? css.active : undefined}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
