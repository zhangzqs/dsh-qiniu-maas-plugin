import type { ReactNode } from 'react';
import { SiGithub } from 'react-icons/si';
import { LuExternalLink } from 'react-icons/lu';
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
        <a
          className={css.repository}
          href="https://github.com/zhangzqs/dsh-qiniu-maas-plugin"
          target="_blank"
          rel="noreferrer"
          aria-label={t(pageHeaderKeys.repository)}
          title={t(pageHeaderKeys.repository)}
        >
          <SiGithub size={16} aria-hidden="true" />
        </a>
      </div>
      <p className={css.subtitle}>{t(pageHeaderKeys.subtitle)}</p>
      <div className={css.links}>
        <a
          className={css.link}
          href="https://portal.qiniu.com/ai-inference/model"
          target="_blank"
          rel="noreferrer"
        >
          <LuExternalLink size={14} aria-hidden="true" />
          {t(pageHeaderKeys.portal)}
        </a>
      </div>
    </header>
  );
}
