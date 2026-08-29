import { useState, type ReactNode } from 'react';
import {
  Button,
  IconChevronDownOutline14,
  Input,
  Menu,
} from '@deepseek-ai/dsh-client-ui-primitives';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../../../qiniu-config.ts';
import css from './SettingsPanel.module.css';

interface SettingSelectProps {
  label: string;
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (value: string) => void;
}

function SettingSelect({
  label,
  value,
  options,
  onChange,
}: SettingSelectProps): ReactNode {
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

interface ApiKeyProps {
  apiKeyConfigured: boolean;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onApiKeySubmit: () => Promise<void>;
}

function ApiKeySetting({
  apiKeyConfigured,
  apiKey,
  onApiKeyChange,
  onApiKeySubmit,
}: ApiKeyProps): ReactNode {
  const [saving, setSaving] = useState(false);

  const submit = async (): Promise<void> => {
    setSaving(true);
    try {
      await onApiKeySubmit();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={css.apiKeySetting}>
      <h3>推理 API Key</h3>
      <p>设置后，已启用模型可以在会话中调用。</p>
      <div className={css.apiKeyRow}>
        <Input
          className={css.apiKey}
          aria-label="推理 API Key"
          type="password"
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          placeholder={
            apiKeyConfigured ? '已配置，如需更换请重新输入' : '输入 API Key'
          }
        />
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={saving || apiKey.trim().length === 0}
          onClick={() => void submit()}
        >
          {saving ? '保存中...' : '保存 API Key'}
        </Button>
      </div>
      <span className={css.status}>
        {apiKeyConfigured ? '已配置' : '未配置'}
      </span>
    </section>
  );
}

const REGION_OPTIONS = [
  { id: 'cn', label: '国内' },
  { id: 'global', label: '全球' },
] as const;

const PROTOCOL_OPTIONS = [
  { id: 'openai-completions', label: 'OpenAI Chat Completions' },
  { id: 'openai-responses', label: 'OpenAI Responses' },
  { id: 'anthropic-messages', label: 'Anthropic Messages' },
] as const;

interface Props {
  apiKeyConfigured: boolean;
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onApiKeySubmit: () => Promise<void>;
  onModelMarketRegionChange: (region: QiniuRegion) => void;
  onInferenceProtocolChange: (protocol: QiniuInferenceProtocol) => void;
}

export function SettingsPanel({
  apiKeyConfigured,
  modelMarketRegion,
  inferenceProtocol,
  apiKey,
  onApiKeyChange,
  onApiKeySubmit,
  onModelMarketRegionChange,
  onInferenceProtocolChange,
}: Props): ReactNode {
  return (
    <div className={css.block}>
      <SettingSelect
        label="服务区域"
        value={modelMarketRegion}
        options={REGION_OPTIONS}
        onChange={(value) => onModelMarketRegionChange(value as QiniuRegion)}
      />
      <SettingSelect
        label="推理协议"
        value={inferenceProtocol}
        options={PROTOCOL_OPTIONS}
        onChange={(value) =>
          onInferenceProtocolChange(value as QiniuInferenceProtocol)
        }
      />
      <ApiKeySetting
        apiKeyConfigured={apiKeyConfigured}
        apiKey={apiKey}
        onApiKeyChange={onApiKeyChange}
        onApiKeySubmit={onApiKeySubmit}
      />
    </div>
  );
}
