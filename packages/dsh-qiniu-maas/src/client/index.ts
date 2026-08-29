import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import { QiniuSettingsSection } from './ui/QiniuSettingsSection.tsx';
import { createQiniuController } from './controller/qiniu-controller.ts';
import {
  inferenceProtocolOf,
  enabledModelIdsOf,
  regionOf,
  type PiAiSettings,
  type QiniuInjected,
  type QiniuSettings,
  type QiniuState,
} from './controller/qiniu-state.ts';

export const inject = ['slots', 'connection', 'settingsScope'];

export function apply(ctx: ClientContext): void {
  const connection = ctx.get('connection') as ConnectionHandle;
  const qiniuSettings = ctx.settingsScope.bind<QiniuSettings>({
    namespace: 'qiniu-maas',
  });
  const piAiSettings = ctx.settingsScope.bind<PiAiSettings>({
    namespace: 'llm-pi-ai',
  });
  const store = createSnapshotStore<QiniuState>({
    enabledModelIds: [],
    modelMarketRegion: regionOf(qiniuSettings),
    inferenceProtocol: inferenceProtocolOf(qiniuSettings),
  });
  const controller = createQiniuController(
    connection,
    qiniuSettings,
    piAiSettings,
    store,
  );

  ctx.effect(
    () =>
      qiniuSettings.subscribe(() => {
        store.update((state) => {
          state.enabledModelIds = enabledModelIdsOf(qiniuSettings);
          state.modelMarketRegion = regionOf(qiniuSettings);
          state.inferenceProtocol = inferenceProtocolOf(qiniuSettings);
        });
      }),
    'qiniu-maas: settings updates',
  );
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'qiniu-maas',
        order: 20,
        label: 'Qiniu MaaS',
        inject: (): QiniuInjected => ({
          hooks: { snapshot: store },
          ...controller,
        }),
      },
      QiniuSettingsSection,
    ),
  );
}
