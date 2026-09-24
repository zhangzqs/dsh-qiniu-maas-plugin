import type {
  BuiltInLocaleId,
  LocaleId,
} from '@deepseek-ai/dsh-client-locale/client';
import type {
  LocaleDictOf,
  TranslateNS,
} from '@deepseek-ai/dsh-client-ui-slots';
import { createContext, useContext } from 'react';
import { pageHeaderMessages } from '../page/components/PageHeader.locales.ts';
import { tabsMessages } from '../page/components/Tabs.locales.ts';
import { commonMessages } from '../page/Common.locales.ts';
import { modelCenterMessages } from '../page/panels/model-center/ModelCenterPanel.locales.ts';
import { modelCardMessages } from '../page/panels/model-center/components/ModelCard.locales.ts';
import { modelDetailMessages } from '../page/panels/model-center/components/ModelDetailDialog.locales.ts';
import { settingsMessages } from '../page/panels/settings/SettingsPanel.locales.ts';
import { apiKeySettingMessages } from '../page/panels/settings/components/ApiKeySetting.locales.ts';
import { modelAvatarMessages } from '../page/panels/model-center/components/ModelAvatar.locales.ts';
import { qiniuSettingsSectionMessages } from '../QiniuSettingsSection.locales.ts';
import { QINIU_MAAS_NAMESPACE } from '../../constants.ts';
export type QiniuLocaleMessage = Record<LocaleId, string>;
export type QiniuLocaleMessages = Record<string, QiniuLocaleMessage>;

// 所有组件的翻译消息最终会注册到这里
const allMessages = {
  ...pageHeaderMessages,
  ...tabsMessages,
  ...commonMessages,
  ...modelCenterMessages,
  ...modelCardMessages,
  ...modelDetailMessages,
  ...modelAvatarMessages,
  ...settingsMessages,
  ...apiKeySettingMessages,
  ...qiniuSettingsSectionMessages,
} satisfies QiniuLocaleMessages;

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    [QINIU_MAAS_NAMESPACE]: keyof typeof allMessages;
  }
}
export type QiniuTranslator = TranslateNS<typeof QINIU_MAAS_NAMESPACE>;

export const QiniuLocaleContext = createContext<QiniuTranslator | null>(null);

export function useQiniuT(): QiniuTranslator {
  const t = useContext(QiniuLocaleContext);
  if (t === null) {
    throw new Error('Qiniu locale context is not available');
  }
  return t;
}

function createDictionary(
  locale: BuiltInLocaleId,
): LocaleDictOf<typeof QINIU_MAAS_NAMESPACE> {
  return Object.fromEntries(
    Object.entries(allMessages).map(([key, value]) => [key, value[locale]]),
  ) as LocaleDictOf<typeof QINIU_MAAS_NAMESPACE>;
}

export const qiniuMessages = {
  zh: createDictionary('zh'),
  en: createDictionary('en'),
} satisfies Record<BuiltInLocaleId, LocaleDictOf<typeof QINIU_MAAS_NAMESPACE>>;
