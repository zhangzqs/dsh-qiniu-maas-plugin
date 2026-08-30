import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
import type { QiniuRegion } from 'qiniu-maas-market-sdk';
import type { QiniuInferenceProtocol, QiniuSettings } from '../../../shared.ts';

export interface QiniuSettingsValue {
  enabledModelIds: string[];
  region: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuSettingsController {
  read(): QiniuSettingsValue;
  subscribe(listener: () => void): () => void;
  setEnabledModelIds(modelIds: readonly string[]): Promise<void>;
  setRegion(region: QiniuRegion): Promise<void>;
  setInferenceProtocol(protocol: QiniuInferenceProtocol): Promise<void>;
}

export function createQiniuSettingsController(
  settings: SettingsScope<QiniuSettings>,
): QiniuSettingsController {
  function read(): QiniuSettingsValue {
    const value = settings.getSnapshot().value;
    const modelIds = value?.enabledModelIds;

    return {
      enabledModelIds: Array.isArray(modelIds)
        ? modelIds.filter(
            (modelId): modelId is string => typeof modelId === 'string',
          )
        : [],
      region: value?.region ?? 'cn',
      inferenceProtocol: value?.inferenceProtocol ?? 'openai-completions',
    };
  }

  function subscribe(listener: () => void): () => void {
    return settings.subscribe(listener);
  }

  function setEnabledModelIds(modelIds: readonly string[]): Promise<void> {
    return settings.set('enabledModelIds', modelIds);
  }

  function setRegion(region: QiniuRegion): Promise<void> {
    return settings.set('region', region);
  }

  function setInferenceProtocol(
    protocol: QiniuInferenceProtocol,
  ): Promise<void> {
    return settings.set('inferenceProtocol', protocol);
  }

  return {
    read,
    subscribe,
    setEnabledModelIds,
    setRegion,
    setInferenceProtocol,
  };
}
