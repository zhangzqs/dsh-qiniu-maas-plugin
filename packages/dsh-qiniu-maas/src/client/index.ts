import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import { QiniuSettingsSection } from './ui/QiniuSettingsSection.tsx';
import { createQiniuController } from './controller/qiniu-controller.ts';
import { createPiAiSettingsController } from './controller/settings/pi-ai-settings-controller.ts';
import { createQiniuSettingsController } from './controller/settings/qiniu-settings-controller.ts';
import {
  type QiniuInjected,
  type QiniuState,
} from './controller/qiniu-state.ts';
import type { PiAiSettings } from './controller/settings/pi-ai-settings-controller.ts';
import type { QiniuSettings } from './controller/settings/qiniu-settings-controller.ts';

export const inject = ['slots', 'connection', 'settingsScope'];

export function apply(ctx: ClientContext): void {
  const connection = ctx.get('connection') as ConnectionHandle;

  const qiniuSettingsController = createQiniuSettingsController(
    ctx.settingsScope.bind<QiniuSettings>({
      namespace: 'qiniu-maas',
    }),
  );
  const piAiSettingsController = createPiAiSettingsController(
    ctx.settingsScope.bind<PiAiSettings>({
      namespace: 'llm-pi-ai',
    }),
  );
  const store = (() => {
    const qiniuSettingsValue = qiniuSettingsController.read();
    return createSnapshotStore<QiniuState>({
      enabledModelIds: qiniuSettingsValue.enabledModelIds,
      modelMarketRegion: qiniuSettingsValue.region,
      inferenceProtocol: qiniuSettingsValue.inferenceProtocol,
    });
  })();

  const controller = createQiniuController(
    connection,
    qiniuSettingsController,
    piAiSettingsController,
    store,
  );

  ctx.effect(
    () =>
      qiniuSettingsController.subscribe(() => {
        const settings = qiniuSettingsController.read();
        store.update((state) => {
          state.enabledModelIds = settings.enabledModelIds;
          state.modelMarketRegion = settings.region;
          state.inferenceProtocol = settings.inferenceProtocol;
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
