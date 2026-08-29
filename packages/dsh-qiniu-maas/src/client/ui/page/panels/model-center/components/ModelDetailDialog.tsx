import { Modal, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelDetailDialog.module.css';

function formatTokenCount(value: number | undefined): string {
  if (value === undefined) return '未知';
  if (value < 1_000) return value.toLocaleString();

  const divisor = value < 1_000_000 ? 1_000 : 1_000_000;
  const unit = value < 1_000_000 ? 'K' : 'M';
  const compactValue = Number((value / divisor).toFixed(1));
  return `${compactValue}${unit}`;
}

interface Props {
  model: Model;
  onClose: () => void;
}

export function ModelDetailDialog({ model, onClose }: Props): ReactNode {
  return (
    <Modal
      open
      title={model.name}
      description={model.id}
      closeLabel="关闭详情"
      onClose={onClose}
      className={css.modal}
      contentClassName={css.content}
    >
      <ModelAvatar model={model} size="dialog" />
      <p className={css.kicker}>MODEL DETAILS</p>
      <p className={css.description}>{model.description || '暂无描述'}</p>
      <section className={css.section}>
        <h3>模型信息</h3>
        <div className={css.details}>
          <span>发行方</span>
          <strong>{model.issuer?.name || '未知'}</strong>
          <span>发布时间</span>
          <strong>{model.release_at || '未知'}</strong>
          <span>输入</span>
          <strong>
            {model.architecture?.input_modalities.join(', ') || '未知'}
          </strong>
          <span>输出</span>
          <strong>
            {model.architecture?.output_modalities.join(', ') || '未知'}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>模型限制</h3>
        <div className={css.details}>
          <span>上下文</span>
          <strong>
            {formatTokenCount(model.model_constraints?.context_length)}
          </strong>
          <span>最大输出</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.max_completion_tokens ??
                model.model_constraints?.max_tokens,
            )}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>支持能力</h3>
        <div className={css.tags}>
          {model.features.map((feature) => (
            <Pill key={feature}>{feature}</Pill>
          ))}
          {model.architecture?.reasoning?.supported && <Pill>推理</Pill>}
          {model.architecture?.function_calling?.supported && (
            <Pill>函数调用</Pill>
          )}
          {model.architecture?.schema_output?.supported && (
            <Pill>结构化输出</Pill>
          )}
        </div>
      </section>
      <section className={css.section}>
        <h3>支持协议</h3>
        <p className={css.inlineValue}>
          {model.support_api_protocols.join(', ') || '未知'}
        </p>
      </section>
      {(model.model_doc_url || model.integration_doc_url) && (
        <section className={css.section}>
          <h3>相关文档</h3>
          <div className={css.links}>
            {model.model_doc_url && (
              <a href={model.model_doc_url} target="_blank" rel="noreferrer">
                模型文档
              </a>
            )}
            {model.integration_doc_url && (
              <a
                href={model.integration_doc_url}
                target="_blank"
                rel="noreferrer"
              >
                接入文档
              </a>
            )}
          </div>
        </section>
      )}
    </Modal>
  );
}
