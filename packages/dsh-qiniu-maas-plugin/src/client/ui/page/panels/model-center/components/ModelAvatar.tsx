import { memo, useState, type ReactNode } from 'react';
import type { Model } from 'qiniu-maas-market-sdk';
import css from './ModelAvatar.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';

export type ModelAvatarSize = 'card' | 'dialog';

interface Props {
  model: Model;
  size?: ModelAvatarSize;
}

export const ModelAvatar = memo(function ModelAvatar({
  model,
  size = 'card',
}: Props): ReactNode {
  const t = useQiniuT();
  const [hasFailed, setHasFailed] = useState(false);
  const className = size === 'dialog' ? css.dialog : css.card;
  if (model.avatar === undefined || hasFailed) {
    return (
      <span
        className={`${className} ${css.fallback}`}
        aria-label={t('common.icon', { name: model.name })}
      >
        {model.name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={model.avatar}
      alt={t('common.icon', { name: model.name })}
      className={className}
      loading={size === 'card' ? 'lazy' : undefined}
      decoding="async"
      onError={() => setHasFailed(true)}
    />
  );
});
