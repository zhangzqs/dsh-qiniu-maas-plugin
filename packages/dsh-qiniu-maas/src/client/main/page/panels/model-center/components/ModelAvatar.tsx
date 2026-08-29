import { memo, useState, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import css from './ModelAvatar.module.css';

export type ModelAvatarSize = 'card' | 'dialog';

interface Props {
  model: Model;
  size?: ModelAvatarSize;
}

export const ModelAvatar = memo(function ModelAvatar({
  model,
  size = 'card',
}: Props): ReactNode {
  const [failed, setFailed] = useState(false);
  const className = size === 'dialog' ? css.dialog : css.card;
  if (model.avatar === undefined || failed) {
    return (
      <span
        className={`${className} ${css.fallback}`}
        aria-label={`${model.name} 图标`}
      >
        {model.name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={model.avatar}
      alt={`${model.name} 图标`}
      className={className}
      loading={size === 'card' ? 'lazy' : undefined}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
});
