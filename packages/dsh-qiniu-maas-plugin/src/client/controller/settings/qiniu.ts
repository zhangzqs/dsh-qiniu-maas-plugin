import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { QiniuRegion } from 'qiniu-maas-market-sdk';
import type { QiniuInferenceProtocol, QiniuSettings } from '../../../shared.ts';

export interface QiniuSettingsValue {
  enabledModelIds: string[];
  hasAutoEnabledDefaultModels: boolean;
  region: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuSettingsController {
  read(): QiniuSettingsValue;
  subscribe(listener: () => void): () => void;
  setEnabledModelIds(modelIds: readonly string[]): Promise<boolean>;
  setHasAutoEnabledDefaultModels(value: boolean): Promise<boolean>;
  setRegion(region: QiniuRegion): Promise<boolean>;
  setInferenceProtocol(protocol: QiniuInferenceProtocol): Promise<boolean>;
}

export function createQiniuSettingsController(
  settings: ConfigForm<QiniuSettings>,
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
      hasAutoEnabledDefaultModels: value?.hasAutoEnabledDefaultModels === true,
      region: value?.region ?? 'cn',
      inferenceProtocol: value?.inferenceProtocol ?? 'openai-completions',
    };
  }

  function subscribe(listener: () => void): () => void {
    return settings.subscribe(listener);
  }

  function setEnabledModelIds(modelIds: readonly string[]): Promise<boolean> {
    return settings.set('enabledModelIds', modelIds);
  }

  function setHasAutoEnabledDefaultModels(value: boolean): Promise<boolean> {
    return settings.set('hasAutoEnabledDefaultModels', value);
  }

  function setRegion(region: QiniuRegion): Promise<boolean> {
    return settings.set('region', region);
  }

  function setInferenceProtocol(
    protocol: QiniuInferenceProtocol,
  ): Promise<boolean> {
    return settings.set('inferenceProtocol', protocol);
  }

  return {
    read,
    subscribe,
    setEnabledModelIds,
    setHasAutoEnabledDefaultModels,
    setRegion,
    setInferenceProtocol,
  };
}
