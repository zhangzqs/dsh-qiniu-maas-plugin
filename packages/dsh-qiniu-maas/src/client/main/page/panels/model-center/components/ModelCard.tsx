import { memo, type ReactNode } from 'react';
import { Button, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { Model } from 'qiniu-maas-model-market';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelCard.module.css';

interface Props {
  model: Model;
  isEnabled: boolean;
  saving: boolean;
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

function toggleLabel(
  isEnabled: boolean,
  isRetired: boolean,
  saving: boolean,
): string {
  if (saving) return '保存中...';
  if (isEnabled) return '停用';
  if (isRetired) return '已退役';
  return '启用';
}

export const ModelCard = memo(function ModelCard({
  model,
  isEnabled,
  saving,
  onDetails,
  onToggle,
}: Props): ReactNode {
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
              {isEnabled ? '已启用' : '未启用'}
            </Pill>
          </div>
          <p className={css.modelId}>{model.id}</p>
          {isRetired && (
            <p className={css.retiredWarning}>
              已退役，建议迁移到 {model.suggested_model}
            </p>
          )}
          <p className={css.description}>{model.description || '暂无描述'}</p>
        </div>
      </div>
      <div className={css.actions}>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className={css.quiet}
          onClick={() => onDetails(model.id)}
        >
          查看详情
        </Button>
        <Button
          variant={isEnabled ? 'outline' : 'primary'}
          size="sm"
          type="button"
          className={isEnabled ? css.disable : css.enable}
          disabled={saving || !canEnable}
          onClick={() => void onToggle(model.id)}
        >
          {toggleLabel(isEnabled, isRetired, saving)}
        </Button>
      </div>
    </article>
  );
});
