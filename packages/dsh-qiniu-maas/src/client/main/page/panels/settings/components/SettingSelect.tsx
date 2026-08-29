import { useState, type ReactNode } from 'react';
import {
  Button,
  IconChevronDownOutline14,
  Menu,
} from '@deepseek-ai/dsh-client-ui-primitives';
import css from './SettingSelect.module.css';

export interface Props {
  label: string;
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (value: string) => void;
}

export function SettingSelect({
  label,
  value,
  options,
  onChange,
}: Props): ReactNode {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  return (
    <label className={css.label}>
      <span>{label}</span>
      <Menu
        open={open}
        anchor={
          <Button
            variant="outline"
            className={css.selectButton}
            aria-label={label}
            onClick={() => setOpen((isOpen) => !isOpen)}
          >
            {selected?.label}
            <IconChevronDownOutline14 />
          </Button>
        }
        items={options}
        selectedId={value}
        onSelect={(id) => {
          onChange(id);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        align="start"
        dense
      />
    </label>
  );
}
