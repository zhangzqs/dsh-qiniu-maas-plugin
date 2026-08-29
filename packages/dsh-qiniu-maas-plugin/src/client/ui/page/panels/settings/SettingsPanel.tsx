import type { ReactNode } from 'react';
import type { QiniuRegion } from 'qiniu-maas-market-sdk';
import type { QiniuInferenceProtocol } from '../../../../qiniu-protocol.ts';
import { ApiKeySetting } from './components/ApiKeySetting.tsx';
import { SettingSelect } from './components/SettingSelect.tsx';
import css from './SettingsPanel.module.css';
import { useQiniuT } from '../../../i18n/index.ts';

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
  const t = useQiniuT();
  const regionOptions = [
    { id: 'cn', label: t('settings.panel.region.cn') },
    { id: 'global', label: t('settings.panel.region.global') },
  ] as const;
  return (
    <div className={css.block}>
      <SettingSelect
        label={t('settings.panel.region')}
        value={modelMarketRegion}
        options={regionOptions}
        onChange={(value) => onModelMarketRegionChange(value as QiniuRegion)}
      />
      <SettingSelect
        label={t('settings.panel.protocol')}
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
