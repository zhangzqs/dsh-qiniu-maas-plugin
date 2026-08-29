import type { ReactNode } from 'react';
import css from './Tabs.module.css';

export type Tab = 'model-center' | 'settings';

const TABS: readonly [Tab, string][] = [
  ['model-center', '模型中心'],
  ['settings', '设置'],
];

interface Props {
  tab: Tab;
  onChange: (tab: Tab) => void;
}

export function Tabs({ tab, onChange }: Props): ReactNode {
  return (
    <nav className={css.tabs} role="tablist" aria-label="Qiniu MaaS 设置">
      {TABS.map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          className={tab === id ? css.active : undefined}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
