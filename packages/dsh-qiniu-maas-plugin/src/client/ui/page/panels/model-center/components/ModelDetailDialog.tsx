import { Modal, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { ReactNode } from 'react';
import type { Model } from 'qiniu-maas-market-sdk';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelDetailDialog.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';

function formatTokenCount(value: number | undefined, unknown: string): string {
  if (value === undefined) return unknown;
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
  const t = useQiniuT();
  return (
    <Modal
      open
      title={model.name}
      description={model.id}
      closeLabel={t('model.detail.close')}
      onClose={onClose}
      className={css.modal}
      contentClassName={css.content}
    >
      <ModelAvatar model={model} size="dialog" />
      <p className={css.kicker}>{t('model.detail.kicker')}</p>
      <p className={css.description}>
        {model.description || t('model.card.noDescription')}
      </p>
      <section className={css.section}>
        <h3>{t('model.detail.info')}</h3>
        <div className={css.details}>
          <span>{t('model.detail.issuer')}</span>
          <strong>{model.issuer?.name || t('model.detail.unknown')}</strong>
          <span>{t('model.detail.releaseAt')}</span>
          <strong>{model.release_at || t('model.detail.unknown')}</strong>
          <span>{t('model.detail.input')}</span>
          <strong>
            {model.architecture?.input_modalities.join(', ') ||
              t('model.detail.unknown')}
          </strong>
          <span>{t('model.detail.output')}</span>
          <strong>
            {model.architecture?.output_modalities.join(', ') ||
              t('model.detail.unknown')}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>{t('model.detail.limits')}</h3>
        <div className={css.details}>
          <span>{t('model.detail.context')}</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.context_length,
              t('model.detail.unknown'),
            )}
          </strong>
          <span>{t('model.detail.maxOutput')}</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.max_completion_tokens ??
                model.model_constraints?.max_tokens,
              t('model.detail.unknown'),
            )}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>{t('model.detail.capabilities')}</h3>
        <div className={css.tags}>
          {model.features.map((feature) => (
            <Pill key={feature}>{feature}</Pill>
          ))}
          {model.architecture?.reasoning?.supported && (
            <Pill>{t('model.detail.reasoning')}</Pill>
          )}
          {model.architecture?.function_calling?.supported && (
            <Pill>{t('model.detail.functionCalling')}</Pill>
          )}
          {model.architecture?.schema_output?.supported && (
            <Pill>{t('model.detail.structuredOutput')}</Pill>
          )}
        </div>
      </section>
      <section className={css.section}>
        <h3>{t('model.detail.protocols')}</h3>
        <p className={css.inlineValue}>
          {model.support_api_protocols.join(', ') || t('model.detail.unknown')}
        </p>
      </section>
      {(model.model_doc_url || model.integration_doc_url) && (
        <section className={css.section}>
          <h3>{t('model.detail.documents')}</h3>
          <div className={css.links}>
            {model.model_doc_url && (
              <a href={model.model_doc_url} target="_blank" rel="noreferrer">
                {t('model.detail.modelDocumentation')}
              </a>
            )}
            {model.integration_doc_url && (
              <a
                href={model.integration_doc_url}
                target="_blank"
                rel="noreferrer"
              >
                {t('model.detail.integrationDocumentation')}
              </a>
            )}
          </div>
        </section>
      )}
    </Modal>
  );
}
