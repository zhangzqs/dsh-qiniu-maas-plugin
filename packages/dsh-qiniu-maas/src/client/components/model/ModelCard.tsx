import { memo, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelCard.module.css';

interface Props {
  model: Model;
  isAvailable: boolean;
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export const ModelCard = memo(function ModelCard({
  model,
  isAvailable,
  onDetails,
  onToggle,
}: Props): ReactNode {
  return (
    <article className={css.card}>
      <div className={css.main}>
        <ModelAvatar model={model} />
        <div>
          <div className={css.title}>
            <h3>{model.name}</h3>
            <span className={isAvailable ? css.badgeAvailable : css.badge}>
              {isAvailable ? '已启用' : '未启用'}
            </span>
          </div>
          <p className={css.modelId}>{model.id}</p>
          <p className={css.description}>{model.description || '暂无描述'}</p>
        </div>
      </div>
      <div className={css.actions}>
        <button
          type="button"
          className={css.quiet}
          onClick={() => onDetails(model.id)}
        >
          查看详情
        </button>
        <button
          type="button"
          className={isAvailable ? css.disable : css.enable}
          onClick={() => void onToggle(model.id)}
        >
          {isAvailable ? '停用' : '启用'}
        </button>
      </div>
    </article>
  );
});
