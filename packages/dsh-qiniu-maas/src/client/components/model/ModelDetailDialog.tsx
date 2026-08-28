import type { ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelDetailDialog.module.css';

interface Props {
  model: Model;
  onClose: () => void;
}

export function ModelDetailDialog({ model, onClose }: Props): ReactNode {
  const stopPropagation = (event: React.MouseEvent): void => {
    event.stopPropagation();
  };
  return (
    <div className={css.backdrop} onClick={onClose}>
      <section
        className={css.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="模型详情"
        onClick={stopPropagation}
      >
        <button
          type="button"
          className={css.close}
          aria-label="关闭详情"
          onClick={onClose}
        >
          ×
        </button>
        <ModelAvatar model={model} size="dialog" />
        <p className={css.kicker}>MODEL DETAILS</p>
        <h2>{model.name}</h2>
        <p className={css.modelId}>{model.id}</p>
        <p className={css.description}>{model.description || '暂无描述'}</p>
        <div className={css.details}>
          <span>发行方</span>
          <strong>{model.issuer?.name || '未知'}</strong>
          <span>输入</span>
          <strong>
            {model.architecture?.input_modalities.join(', ') || '未知'}
          </strong>
          <span>输出</span>
          <strong>
            {model.architecture?.output_modalities.join(', ') || '未知'}
          </strong>
          <span>上下文</span>
          <strong>
            {model.model_constraints?.context_length?.toLocaleString() ||
              '未知'}
          </strong>
        </div>
      </section>
    </div>
  );
}
