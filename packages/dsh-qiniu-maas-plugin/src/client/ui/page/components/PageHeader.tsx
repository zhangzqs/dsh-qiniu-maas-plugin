import type { ReactNode } from 'react';
import css from './PageHeader.module.css';
import { useQiniuT } from '../../i18n/index.ts';

export function PageHeader(): ReactNode {
  const t = useQiniuT();
  return (
    <header className={css.header}>
      <p className={css.kicker}>QINIU MAAS</p>
      <h2>{t('page.header.title')}</h2>
      <p className={css.subtitle}>{t('page.header.subtitle')}</p>
      <a
        className={css.portalLink}
        href="https://portal.qiniu.com/ai-inference/model"
        target="_blank"
        rel="noreferrer"
      >
        {t('page.header.portal')}
      </a>
    </header>
  );
}
