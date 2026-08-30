import type { ReactNode } from 'react';
import css from './PageHeader.module.css';
import { useQiniuT } from '../../i18n/index.ts';
import { pageHeaderKeys } from './PageHeader.locales.ts';
import { qiniuPluginVersion } from '../../../version.ts';

export function PageHeader(): ReactNode {
  const t = useQiniuT();
  return (
    <header className={css.header}>
      <p className={css.kicker}>QINIU MAAS</p>
      <h2>{t(pageHeaderKeys.title)}</h2>
      <p className={css.subtitle}>{t(pageHeaderKeys.subtitle)}</p>
      <p className={css.version}>
        {t(pageHeaderKeys.version, { version: qiniuPluginVersion })}
      </p>
      <a
        className={css.portalLink}
        href="https://portal.qiniu.com/ai-inference/model"
        target="_blank"
        rel="noreferrer"
      >
        {t(pageHeaderKeys.portal)}
      </a>
    </header>
  );
}
