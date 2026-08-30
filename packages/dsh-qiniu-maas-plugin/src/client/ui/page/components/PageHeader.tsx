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
      <div className={css.titleRow}>
        <h2>{t(pageHeaderKeys.title)}</h2>
        <span className={css.version}>
          {t(pageHeaderKeys.version, { version: qiniuPluginVersion })}
        </span>
      </div>
      <p className={css.subtitle}>{t(pageHeaderKeys.subtitle)}</p>
      <div className={css.links}>
        <a
          className={css.link}
          href="https://portal.qiniu.com/ai-inference/model"
          target="_blank"
          rel="noreferrer"
        >
          {t(pageHeaderKeys.portal)}
        </a>
        <a
          className={css.link}
          href="https://github.com/zhangzqs/dsh-qiniu-maas-plugin"
          target="_blank"
          rel="noreferrer"
        >
          {t(pageHeaderKeys.repository)}
        </a>
      </div>
    </header>
  );
}
