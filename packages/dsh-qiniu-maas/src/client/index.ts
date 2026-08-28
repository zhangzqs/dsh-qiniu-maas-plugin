import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import { QiniuSettingsSection } from './main/QiniuSettingsSection.tsx';
import { createQiniuController } from './controller/qiniu-controller.ts';
import {
  inferenceProtocolOf,
  enabledModelIdsOf,
  modelMarketRegionOf,
  type PiAiSettings,
  type QiniuInjected,
  type QiniuState,
} from './state/qiniu-state.ts';
import { QINIU_API_KEY_REF } from './qiniu-config.ts';

export const inject = ['slots', 'connection', 'settingsScope'];

export function apply(ctx: ClientContext): void {
  const connection = ctx.get('connection') as ConnectionHandle;
  const settings = ctx.settingsScope.bind<PiAiSettings>({
    namespace: 'llm-pi-ai',
  });
  const store = createSnapshotStore<QiniuState>({
    status: 'loading',
    refreshing: false,
    market: [],
    enabledModelIds: [],
    error: null,
    apiKeyConfigured: false,
    modelMarketRegion: modelMarketRegionOf(settings),
    inferenceProtocol: inferenceProtocolOf(settings),
  });
  const controller = createQiniuController(connection, settings, store);

  ctx.effect(
    () =>
      settings.subscribe(() => {
        store.update((state) => {
          state.enabledModelIds = enabledModelIdsOf(settings);
        });
      }),
    'qiniu-maas: settings updates',
  );
  void controller.refresh();

  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'qiniu-maas',
        order: 20,
        label: 'Qiniu MaaS',
        inject: (): QiniuInjected => ({
          api: connection.api,
          settings,
          hooks: { snapshot: store },
          ...controller,
          apiKeyRef: QINIU_API_KEY_REF,
        }),
      },
      QiniuSettingsSection,
    ),
  );
}
