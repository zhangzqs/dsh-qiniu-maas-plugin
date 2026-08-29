import type { LocaleId } from '@deepseek-ai/dsh-client-locale/client';
import type { LocaleDictOf } from '@deepseek-ai/dsh-client-ui-slots';
import { pageHeaderMessages } from '../page/components/PageHeader.locales.ts';
import { tabsMessages } from '../page/components/Tabs.locales.ts';
import { modelCenterMessages } from '../page/panels/model-center/ModelCenterPanel.locales.ts';
import { modelCardMessages } from '../page/panels/model-center/components/ModelCard.locales.ts';
import { modelDetailMessages } from '../page/panels/model-center/components/ModelDetailDialog.locales.ts';
import { settingsMessages } from '../page/panels/settings/SettingsPanel.locales.ts';
import type { QiniuLocaleMessage, QiniuLocaleMessages } from './namespace.ts';
export * from './namespace.ts';

const allMessages: QiniuLocaleMessages = {
  ...pageHeaderMessages,
  ...tabsMessages,
  ...modelCenterMessages,
  ...modelCardMessages,
  ...modelDetailMessages,
  ...settingsMessages,
};

export function toLocaleDicts(
  messages: QiniuLocaleMessages,
): Record<LocaleId, LocaleDictOf<'qiniu-maas'>> {
  const dictionaries = { zh: {}, en: {} } as Record<
    LocaleId,
    LocaleDictOf<'qiniu-maas'>
  >;
  for (const [key, value] of Object.entries(messages) as [
    string,
    QiniuLocaleMessage,
  ][]) {
    dictionaries.zh[key as keyof typeof dictionaries.zh] = value.zh;
    dictionaries.en[key as keyof typeof dictionaries.en] = value.en;
  }
  return dictionaries;
}

export const qiniuMessages = toLocaleDicts(allMessages);

export function translateWithMessages(
  locale: LocaleId,
  key: keyof typeof qiniuMessages.zh,
  params?: Record<string, unknown>,
): string {
  return qiniuMessages[locale][key].replace(
    /\{(\w+)\}/g,
    (_match, name: string) => String(params?.[name] ?? `{${name}}`),
  );
}
