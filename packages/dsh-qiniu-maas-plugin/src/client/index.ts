import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type {} from '@deepseek-ai/dsh-api-remotes/client';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import type {} from '@deepseek-ai/dsh-client-locale/client';
import {
  createPiAiSettingsController,
  createQiniuController,
  createQiniuSettingsController,
  initializeWhenSettingsReady,
  type PiAiSettings,
  type QiniuSettings,
  type QiniuState,
} from './controller/index.ts';
import { QINIU_MAAS_NAMESPACE } from './constants.ts';
import { QiniuSettingsSection, type QiniuInjected } from './ui/index.ts';
import { qiniuMessages } from './ui/i18n/index.ts';
import { qiniuSettingsSectionKeys } from './ui/QiniuSettingsSection.locales.ts';

const QINIU_MAAS_ENTRY_ID = 'qiniu-maas-dsh-plugin';

export const inject = [
  'slots',
  'locale',
  'remote',
  'remote.credentials',
  'configForms',
];

export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.register(QINIU_MAAS_NAMESPACE, qiniuMessages),
    'qiniu-maas: locale dictionary',
  );

  const qiniuSettings = ctx.configForms.get<QiniuSettings>(QINIU_MAAS_ENTRY_ID);
  const piAiSettings = ctx.configForms.get<PiAiSettings>('llm-pi-ai');
  const qiniuSettingsController = createQiniuSettingsController(qiniuSettings);
  const piAiSettingsController = createPiAiSettingsController(piAiSettings);
  const store = (() => {
    const qiniuSettingsValue = qiniuSettingsController.read();
    return createSnapshotStore<QiniuState>({
      enabledModelIds: qiniuSettingsValue.enabledModelIds,
      region: qiniuSettingsValue.region,
      inferenceProtocol: qiniuSettingsValue.inferenceProtocol,
    });
  })();

  const controller = createQiniuController(
    ctx,
    qiniuSettingsController,
    piAiSettingsController,
    store,
  );

  ctx.effect(
    () =>
      initializeWhenSettingsReady(
        [qiniuSettings, piAiSettings],
        controller.initializeDefaultModels,
        (error) => {
          console.error(
            'qiniu-maas: failed to initialize default models',
            error,
          );
        },
      ),
    'qiniu-maas: default model initialization',
  );

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
  ctx.effect(
    () =>
      ctx.configForms.whileServed([QINIU_MAAS_ENTRY_ID], () =>
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: 'qiniu-maas',
              order: 20,
              label: () => {
                return ctx.locale.bind(QINIU_MAAS_NAMESPACE)(
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
        ),
      ),
    'qiniu-maas: settings page',
  );
}
