import type { ReactNode } from 'react';
import css from './ModelTabs.module.css';

export type ModelTab = 'models' | 'settings';

const MODEL_TABS: readonly [ModelTab, string][] = [
  ['models', '模型中心'],
  ['settings', '设置'],
];

interface Props {
  tab: ModelTab;
  onChange: (tab: ModelTab) => void;
}

export function ModelTabs({ tab, onChange }: Props): ReactNode {
  return (
    <nav className={css.tabs} role="tablist" aria-label="Qiniu MaaS 设置">
      {MODEL_TABS.map(([id, label]) => (
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
