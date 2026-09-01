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
  type QiniuState,
} from './controller/index.ts';
import { QiniuSettingsSection, type QiniuInjected } from './ui/index.ts';
import { qiniuMessages } from './ui/i18n/index.ts';
import { qiniuSettingsSectionKeys } from './ui/QiniuSettingsSection.locales.ts';
import { QINIU_MAAS_NAMESPACE, type QiniuSettings } from '../shared.ts';

export const inject = ['slots', 'connection', 'settingsScope', 'locale'];

export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const locale = ctx.get('locale') as LocaleRuntime;
    return locale.register(QINIU_MAAS_NAMESPACE, qiniuMessages);
  }, 'qiniu-maas: locale dictionary');
  const connection = ctx.get('connection') as ConnectionHandle;

  const qiniuSettingsController = createQiniuSettingsController(
    ctx.settingsScope.bind<QiniuSettings>({
      namespace: QINIU_MAAS_NAMESPACE,
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
      region: qiniuSettingsValue.region,
      inferenceProtocol: qiniuSettingsValue.inferenceProtocol,
    });
  })();

  const controller = createQiniuController(
    connection,
    qiniuSettingsController,
    piAiSettingsController,
    store,
  );

  void controller.initializeDefaultModels().catch((error: unknown) => {
    console.error('qiniu-maas: failed to initialize default models', error);
  });

  ctx.effect(
    () =>
      qiniuSettingsController.subscribe(() => {
        const settings = qiniuSettingsController.read();
        store.update((state) => {
          state.enabledModelIds = settings.enabledModelIds;
          state.region = settings.region;
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
        label: () => {
          const locale = ctx.get('locale') as LocaleRuntime;
          return locale.bind(QINIU_MAAS_NAMESPACE)(
            qiniuSettingsSectionKeys.label,
          );
        },
        locale: QINIU_MAAS_NAMESPACE,
        inject: (): QiniuInjected => ({
          hooks: { snapshot: store },
          ...controller,
        }),
      },
      QiniuSettingsSection,
    ),
  );
}
