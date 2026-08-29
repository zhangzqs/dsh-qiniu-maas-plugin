import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client';
import {
  createPiAiSettingsController,
  createQiniuController,
  createQiniuSettingsController,
  type PiAiSettings,
  type QiniuSettings,
  type QiniuState,
} from './controller/index.ts';
import { QiniuSettingsSection, type QiniuInjected } from './ui/index.ts';
import { qiniuMessages } from './ui/i18n/index.ts';

export const inject = ['slots', 'connection', 'settingsScope', 'locale'];

export function apply(ctx: ClientContext): void {
  const locale = ctx.get('locale') as LocaleRuntime;
  const disposeLocale = locale.register('qiniu-maas', qiniuMessages);
  ctx.effect(() => disposeLocale, 'qiniu-maas: locale dictionary');
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
        locale: 'qiniu-maas',
        inject: (): QiniuInjected => ({
          hooks: { snapshot: store },
          ...controller,
        }),
      },
      QiniuSettingsSection,
    ),
  );
}
