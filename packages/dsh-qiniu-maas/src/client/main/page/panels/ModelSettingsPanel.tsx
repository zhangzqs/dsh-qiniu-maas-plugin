import type { ReactNode } from 'react';
import type { QiniuRegion } from 'qiniu-maas-model-market';
import type { QiniuInferenceProtocol } from '../../../qiniu-config.ts';
import css from './ModelSettingsPanel.module.css';

interface Props {
  configured: boolean;
  modelMarketRegion: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
  value: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onModelMarketRegionChange: (region: QiniuRegion) => void;
  onInferenceProtocolChange: (protocol: QiniuInferenceProtocol) => void;
}

export function ModelSettingsPanel({
  configured,
  modelMarketRegion,
  inferenceProtocol,
  value,
  saving,
  onChange,
  onSubmit,
  onModelMarketRegionChange,
  onInferenceProtocolChange,
}: Props): ReactNode {
  return (
    <div className={css.block}>
      <label className={css.label}>
        服务区域
        <select
          aria-label="服务区域"
          value={modelMarketRegion}
          onChange={(event) =>
            onModelMarketRegionChange(event.target.value as QiniuRegion)
          }
        >
          <option value="cn">国内</option>
          <option value="global">全球</option>
        </select>
      </label>
      <label className={css.label}>
        推理协议
        <select
          aria-label="推理协议"
          value={inferenceProtocol}
          onChange={(event) =>
            onInferenceProtocolChange(
              event.target.value as QiniuInferenceProtocol,
            )
          }
        >
          <option value="openai-completions">OpenAI Chat Completions</option>
          <option value="openai-responses">OpenAI Responses</option>
          <option value="anthropic-messages">Anthropic Messages</option>
        </select>
      </label>
      <h3>推理 API Key</h3>
      <p>设置后，已启用模型可以在会话中调用。</p>
      <input
        aria-label="推理 API Key"
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={configured ? '已配置，如需更换请重新输入' : '输入 API Key'}
      />
      <button
        type="button"
        disabled={saving || value.trim().length === 0}
        onClick={onSubmit}
      >
        {saving ? '保存中...' : '保存 API Key'}
      </button>
      <span className={css.status}>{configured ? '已配置' : '未配置'}</span>
    </div>
  );
}
