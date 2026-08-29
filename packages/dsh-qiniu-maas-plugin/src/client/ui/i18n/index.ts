import type { LocaleId } from '@deepseek-ai/dsh-client-locale/client';
import type { LocaleDictOf } from '@deepseek-ai/dsh-client-ui-slots';
import {
  pageHeaderEn,
  pageHeaderZh,
} from '../page/components/PageHeader.locales.ts';
import { tabsEn, tabsZh } from '../page/components/Tabs.locales.ts';
import {
  modelCenterEn,
  modelCenterZh,
} from '../page/panels/model-center/ModelCenterPanel.locales.ts';
import {
  modelCardEn,
  modelCardZh,
} from '../page/panels/model-center/components/ModelCard.locales.ts';
import {
  modelDetailEn,
  modelDetailZh,
} from '../page/panels/model-center/components/ModelDetailDialog.locales.ts';
import {
  settingsEn,
  settingsZh,
} from '../page/panels/settings/SettingsPanel.locales.ts';
export * from './namespace.ts';

export const qiniuMessages: Record<LocaleId, LocaleDictOf<'qiniu-maas'>> = {
  zh: {
    ...pageHeaderZh,
    ...tabsZh,
    ...modelCenterZh,
    ...modelCardZh,
    ...modelDetailZh,
    ...settingsZh,
  },
  en: {
    ...pageHeaderEn,
    ...tabsEn,
    ...modelCenterEn,
    ...modelCardEn,
    ...modelDetailEn,
    ...settingsEn,
  },
};

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
