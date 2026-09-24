import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type {} from '@deepseek-ai/dsh-api-remotes/client';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import {
  listModels,
  type Model,
  type QiniuRegion,
} from 'qiniu-maas-market-sdk';
import { QINIU_API_KEY_REF, syncProviderSettings } from './provider-sync.ts';
import type { PiAiSettingsController } from './settings/pi-ai.ts';
import type { QiniuSettingsController } from './settings/qiniu.ts';
import type { QiniuInferenceProtocol } from 'qiniu-maas-market-sdk';

export interface QiniuState {
  enabledModelIds: readonly string[];
  region: QiniuRegion;
  inferenceProtocol: QiniuInferenceProtocol;
}

export interface QiniuActions {
  checkApiKeyConfigured: () => Promise<boolean>;
  initializeDefaultModels: (signal?: AbortSignal) => Promise<void>;
  fetchMarketModels: (
    region: QiniuRegion,
    forceRefresh?: boolean,
  ) => Promise<readonly Model[]>;
  setEnabledModelIds: (
    modelIds: readonly string[],
    signal?: AbortSignal,
  ) => Promise<void>;
  setApiKey: (value: string) => Promise<void>;
  setRegion: (region: QiniuRegion) => Promise<void>;
  setInferenceProtocol: (protocol: QiniuInferenceProtocol) => Promise<void>;
}

export type QiniuController = QiniuActions;

const DEFAULT_MODEL_COUNT = 5;

function assertSettingsWriteAccepted(accepted: boolean): void {
  if (!accepted) {
    throw new Error('qiniu-maas: settings write was refused');
  }
}

export function createQiniuController(
  ctx: ClientContext,
  qiniuSettings: QiniuSettingsController,
  piAiSettings: PiAiSettingsController,
  store: SnapshotStore<QiniuState>,
): QiniuController {
  // 获取当前区域可用模型列表
  const fetchMarketModels = (() => {
    const marketModelsCache = new Map<QiniuRegion, readonly Model[]>();
    return async function fetchMarketModels(
      region: QiniuRegion,
      forceRefresh = false,
    ): Promise<readonly Model[]> {
      const cachedModels = marketModelsCache.get(region);
      if (!forceRefresh && cachedModels !== undefined) {
        return cachedModels;
      }
      const models = await listModels({ region });
      const sortedModels = models
        .filter((model) =>
          model.support_api_protocols.some(
            (protocol) => protocol === 'openai' || protocol === 'anthropic',
          ),
        )
        .sort((left, right) => right.release_at.localeCompare(left.release_at));
      marketModelsCache.set(region, sortedModels);
      return sortedModels;
    };
  })();

  // 查询dsh内的credentials配置，查询API Key是否已配置
  const checkApiKeyConfigured = async (): Promise<boolean> => {
    const response = await ctx.remote.credentials.describe([QINIU_API_KEY_REF]);
    if (!response.ok) {
      throw new Error(response.error.message);
    }
    return response.value[QINIU_API_KEY_REF]?.configured === true;
  };

  // 设置API Key
  const setApiKey = async (value: string): Promise<void> => {
    const trimmed = value.trim();
    if (trimmed.length === 0) throw new Error('API Key 不能为空');
    const response = await ctx.remote.credentials.set(
      QINIU_API_KEY_REF,
      trimmed,
    );
    if (!response.ok) throw new Error(response.error.message);
  };

  // 设置已启用的模型列表
  const setEnabledModelIds = async (
    modelIds: readonly string[],
    signal?: AbortSignal,
  ): Promise<void> => {
    const settings = qiniuSettings.read();

    // 获取当前区域的所有模型列表
    const marketModels = await fetchMarketModels(settings.region);
    if (signal?.aborted) return;

    {
      // 计算当前区域不可用的模型ID
      const marketModelIds = new Set(marketModels.map((model) => model.id));
      const unavailableModelIds = settings.enabledModelIds.filter(
        (modelId) => !marketModelIds.has(modelId),
      );

      // 将这两个数组合并，去重得到新的已启用模型ID并更新设置
      const nextEnabledModelIds = [
        ...new Set([...unavailableModelIds, ...modelIds]),
      ];
      assertSettingsWriteAccepted(
        await qiniuSettings.setEnabledModelIds(nextEnabledModelIds),
      );
      if (signal?.aborted) return;
      store.update((state) => {
        state.enabledModelIds = nextEnabledModelIds;
      });
    }
    await syncProviderSettings(piAiSettings, qiniuSettings, marketModels);
  };

  // 首次使用插件时候，自动初始化启用前几个默认模型
  const initializeDefaultModels = async (
    signal?: AbortSignal,
  ): Promise<void> => {
    const settings = qiniuSettings.read();
    if (settings.hasAutoEnabledDefaultModels) return;

    const marketModels = await fetchMarketModels(settings.region);
    if (signal?.aborted) return;
    if (settings.enabledModelIds.length > 0) {
      await syncProviderSettings(piAiSettings, qiniuSettings, marketModels);
      if (signal?.aborted) return;
      assertSettingsWriteAccepted(
        await qiniuSettings.setHasAutoEnabledDefaultModels(true),
      );
      return;
    }

    const defaultModelIds = marketModels
      .filter((model) => !model.suggested_model)
      .slice(0, DEFAULT_MODEL_COUNT)
      .map((model) => model.id);

    if (defaultModelIds.length === 0) return;
    await setEnabledModelIds(defaultModelIds, signal);
    if (signal?.aborted) return;
    assertSettingsWriteAccepted(
      await qiniuSettings.setHasAutoEnabledDefaultModels(true),
    );
  };

  // 设置服务区域
  const setRegion = async (region: QiniuRegion): Promise<void> => {
    const marketModels = await fetchMarketModels(region);
    assertSettingsWriteAccepted(await qiniuSettings.setRegion(region));
    await syncProviderSettings(piAiSettings, qiniuSettings, marketModels);
    store.update((state) => {
      state.region = region;
    });
  };

  // 设置推理协议
  const setInferenceProtocol = async (
    protocol: QiniuInferenceProtocol,
  ): Promise<void> => {
    const marketModels = await fetchMarketModels(qiniuSettings.read().region);
    assertSettingsWriteAccepted(
      await qiniuSettings.setInferenceProtocol(protocol),
    );
    await syncProviderSettings(piAiSettings, qiniuSettings, marketModels);
    store.update((state) => {
      state.inferenceProtocol = protocol;
    });
  };

  return {
    checkApiKeyConfigured,
    initializeDefaultModels,
    fetchMarketModels,
    setEnabledModelIds,
    setApiKey,
    setRegion,
    setInferenceProtocol,
  };
}
