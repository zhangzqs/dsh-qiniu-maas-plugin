import type { ReactNode } from 'react';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../../../../qiniu-config.ts';
import { ApiKeySetting } from './components/ApiKeySetting.tsx';
import { SettingSelect } from './components/SettingSelect.tsx';
import css from './SettingsPanel.module.css';

const REGION_OPTIONS = [
  { id: 'cn', label: '国内' },
  { id: 'global', label: '全球' },
] as const;

const PROTOCOL_OPTIONS = [
  { id: 'openai-completions', label: 'OpenAI Chat Completions' },
  { id: 'openai-responses', label: 'OpenAI Responses' },
  { id: 'anthropic-messages', label: 'Anthropic Messages' },
] as const;

export interface Props {
  checkApiKeyConfigured: () => Promise<boolean>;
  setApiKey: (value: string) => Promise<void>;
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
  onModelMarketRegionChange: (region: QiniuRegion) => void;
  onInferenceProtocolChange: (protocol: QiniuInferenceProtocol) => void;
}

export function SettingsPanel({
  checkApiKeyConfigured,
  setApiKey,
  modelMarketRegion,
  inferenceProtocol,
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
        checkApiKeyConfigured={checkApiKeyConfigured}
        setApiKey={setApiKey}
      />
    </div>
  );
}
