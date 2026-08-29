import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { LocaleId } from '@deepseek-ai/dsh-client-locale/client';
import { createContext, useContext } from 'react';

export type QiniuLocaleKey =
  | 'brand'
  | 'subtitle'
  | 'portal'
  | 'tabs.modelCenter'
  | 'tabs.settings'
  | 'tabs.aria'
  | 'model.sort'
  | 'model.sortNewest'
  | 'model.sortOldest'
  | 'model.nameAsc'
  | 'model.nameDesc'
  | 'model.filter'
  | 'model.enabledOnly'
  | 'model.showRetired'
  | 'model.search'
  | 'model.searchPlaceholder'
  | 'model.count'
  | 'model.refresh'
  | 'model.saveFailed'
  | 'model.loading'
  | 'model.loadFailed'
  | 'model.retry'
  | 'model.empty'
  | 'model.viewDetails'
  | 'model.enable'
  | 'model.disable'
  | 'model.retired'
  | 'model.saving'
  | 'model.unknown'
  | 'model.details'
  | 'model.info'
  | 'model.issuer'
  | 'model.releaseAt'
  | 'model.input'
  | 'model.output'
  | 'model.limits'
  | 'model.context'
  | 'model.maxOutput'
  | 'model.capabilities'
  | 'model.reasoning'
  | 'model.functionCalling'
  | 'model.structuredOutput'
  | 'model.protocols'
  | 'model.documents'
  | 'model.closeDetails'
  | 'model.noDescription'
  | 'model.enabled'
  | 'model.disabled'
  | 'model.retiredMigration'
  | 'model.modelDocumentation'
  | 'model.integrationDocumentation'
  | 'settings.region'
  | 'settings.regionCn'
  | 'settings.regionGlobal'
  | 'settings.protocol'
  | 'settings.apiKey'
  | 'settings.apiKeyDescription'
  | 'settings.apiKeyConfigured'
  | 'settings.apiKeyNotConfigured'
  | 'settings.apiKeyChecking'
  | 'settings.apiKeyCheckFailed'
  | 'settings.apiKeyPlaceholder'
  | 'settings.saveApiKey'
  | 'common.icon';

export type QiniuLocaleMessage = Record<LocaleId, string>;

export type QiniuLocaleMessages<K extends QiniuLocaleKey = QiniuLocaleKey> =
  Record<K, QiniuLocaleMessage>;

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'qiniu-maas': QiniuLocaleKey;
  }
}

export type QiniuTranslator = TranslateNS<'qiniu-maas'>;
export const QiniuLocaleContext = createContext<QiniuTranslator | null>(null);

export function useQiniuT(): QiniuTranslator {
  const t = useContext(QiniuLocaleContext);
  if (t === null) throw new Error('Qiniu locale context is not available');
  return t;
}
