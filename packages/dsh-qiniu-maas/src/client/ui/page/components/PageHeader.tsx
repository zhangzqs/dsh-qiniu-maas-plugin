import type { ReactNode } from 'react';
import css from './PageHeader.module.css';

export function PageHeader(): ReactNode {
  return (
    <header className={css.header}>
      <p className={css.kicker}>QINIU MAAS</p>
      <h2>七牛 MaaS</h2>
      <p className={css.subtitle}>管理七牛 AI 大模型推理服务。</p>
      <a
        className={css.portalLink}
        href="https://portal.qiniu.com/ai-inference/model"
        target="_blank"
        rel="noreferrer"
      >
        前往七牛 AI 大模型控制台
      </a>
    </header>
  );
}
