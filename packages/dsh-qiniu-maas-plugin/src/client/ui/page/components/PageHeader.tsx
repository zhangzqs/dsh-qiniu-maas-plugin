import type { ReactNode } from 'react';
import css from './PageHeader.module.css';
import { useQiniuT } from '../../i18n.ts';

export function PageHeader(): ReactNode {
  const t = useQiniuT();
  return (
    <header className={css.header}>
      <p className={css.kicker}>QINIU MAAS</p>
      <h2>{t('brand')}</h2>
      <p className={css.subtitle}>{t('subtitle')}</p>
      <a
        className={css.portalLink}
        href="https://portal.qiniu.com/ai-inference/model"
        target="_blank"
        rel="noreferrer"
      >
        {t('portal')}
      </a>
    </header>
  );
}
