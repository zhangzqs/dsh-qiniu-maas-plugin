import { memo, type ReactNode } from 'react';
import { Button, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { Model } from 'qiniu-maas-market-sdk';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelCard.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';

interface Props {
  model: Model;
  isEnabled: boolean;
  updating: boolean;
  onViewDetails: (id: string) => void;
  onToggleEnabled: (id: string) => Promise<void>;
}

export const ModelCard = memo(function ModelCard({
  model,
  isEnabled,
  updating,
  onViewDetails,
  onToggleEnabled,
}: Props): ReactNode {
  const t = useQiniuT();
  const isRetired = Boolean(model.suggested_model);
  const canEnable = isEnabled || !isRetired;
  return (
    <article className={css.card}>
      <div className={css.main}>
        <ModelAvatar model={model} />
        <div>
          <div className={css.title}>
            <h3>{model.name}</h3>
            {model.hot_tags.slice(0, 3).map((tag) => (
              <Pill key={tag} className={css.hotTag}>
                {tag}
              </Pill>
            ))}
            <Pill className={isEnabled ? css.badgeEnabled : css.badge}>
              {isEnabled ? t('model.card.enabled') : t('model.card.disabled')}
            </Pill>
          </div>
          <p className={css.modelId}>{model.id}</p>
          {isRetired && (
            <p className={css.retiredWarning}>
              {t('model.card.retiredMigration', {
                model: model.suggested_model,
              })}
            </p>
          )}
          <p className={css.description}>
            {model.description || t('model.card.noDescription')}
          </p>
        </div>
      </div>
      <div className={css.actions}>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className={css.quiet}
          onClick={() => onViewDetails(model.id)}
        >
          {t('model.card.viewDetails')}
        </Button>
        <Button
          variant={isEnabled ? 'outline' : 'primary'}
          size="sm"
          type="button"
          className={isEnabled ? css.disable : css.enable}
          disabled={updating || !canEnable}
          onClick={() => void onToggleEnabled(model.id)}
        >
          {updating
            ? t('common.loading.saving')
            : isEnabled
              ? t('model.card.disable')
              : isRetired
                ? t('model.card.retired')
                : t('model.card.enable')}
        </Button>
      </div>
    </article>
  );
});
