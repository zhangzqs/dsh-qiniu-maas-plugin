import { memo, type ReactNode } from 'react';
import { Button, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { Model } from 'qiniu-maas-market-sdk';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelCard.module.css';
import { modelCardKeys } from './ModelCard.locales.ts';
import { useQiniuT } from '../../../../i18n/index.ts';
import { commonKeys } from '../../../Common.locales.ts';

interface Props {
  model: Model;
  isEnabled: boolean;
  updating: boolean;
  onViewDetails: (id: string) => void;
  onEnabledChange: (id: string, enabled: boolean) => Promise<void>;
}

export const ModelCard = memo(function ModelCard({
  model,
  isEnabled,
  updating,
  onViewDetails,
  onEnabledChange,
}: Props): ReactNode {
  const t = useQiniuT();
  const isRetired = Boolean(model.suggested_model);
  const canEnable = isEnabled || !isRetired;
  const getActionLabel = (): string => {
    if (updating) return t(commonKeys.saving);
    if (isEnabled) return t(modelCardKeys.disable);
    if (isRetired) return t(modelCardKeys.retired);
    return t(modelCardKeys.enable);
  };
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
              {isEnabled ? t(modelCardKeys.enabled) : t(modelCardKeys.disabled)}
            </Pill>
          </div>
          <p className={css.modelId}>{model.id}</p>
          {isRetired && (
            <p className={css.retiredWarning}>
              {t(modelCardKeys.retiredMigration, {
                model: model.suggested_model,
              })}
            </p>
          )}
          <p className={css.description}>
            {model.description || t(modelCardKeys.noDescription)}
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
          {t(modelCardKeys.viewDetails)}
        </Button>
        <Button
          variant={isEnabled ? 'outline' : 'primary'}
          size="sm"
          type="button"
          className={isEnabled ? css.disable : css.enable}
          disabled={updating || !canEnable}
          onClick={() => void onEnabledChange(model.id, !isEnabled)}
        >
          {getActionLabel()}
        </Button>
      </div>
    </article>
  );
});
