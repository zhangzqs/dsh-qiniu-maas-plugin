import { Modal, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { ReactNode } from 'react';
import type { Model } from 'qiniu-maas-market-sdk';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelDetailDialog.module.css';
import { useQiniuT } from '../../../../i18n.ts';

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
      closeLabel={t('model.closeDetails')}
      onClose={onClose}
      className={css.modal}
      contentClassName={css.content}
    >
      <ModelAvatar model={model} size="dialog" />
      <p className={css.kicker}>MODEL DETAILS</p>
      <p className={css.description}>
        {model.description || t('model.noDescription')}
      </p>
      <section className={css.section}>
        <h3>{t('model.info')}</h3>
        <div className={css.details}>
          <span>{t('model.issuer')}</span>
          <strong>{model.issuer?.name || t('model.unknown')}</strong>
          <span>{t('model.releaseAt')}</span>
          <strong>{model.release_at || t('model.unknown')}</strong>
          <span>{t('model.input')}</span>
          <strong>
            {model.architecture?.input_modalities.join(', ') ||
              t('model.unknown')}
          </strong>
          <span>{t('model.output')}</span>
          <strong>
            {model.architecture?.output_modalities.join(', ') ||
              t('model.unknown')}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>{t('model.limits')}</h3>
        <div className={css.details}>
          <span>{t('model.context')}</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.context_length,
              t('model.unknown'),
            )}
          </strong>
          <span>{t('model.maxOutput')}</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.max_completion_tokens ??
                model.model_constraints?.max_tokens,
              t('model.unknown'),
            )}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>{t('model.capabilities')}</h3>
        <div className={css.tags}>
          {model.features.map((feature) => (
            <Pill key={feature}>{feature}</Pill>
          ))}
          {model.architecture?.reasoning?.supported && (
            <Pill>{t('model.reasoning')}</Pill>
          )}
          {model.architecture?.function_calling?.supported && (
            <Pill>{t('model.functionCalling')}</Pill>
          )}
          {model.architecture?.schema_output?.supported && (
            <Pill>{t('model.structuredOutput')}</Pill>
          )}
        </div>
      </section>
      <section className={css.section}>
        <h3>{t('model.protocols')}</h3>
        <p className={css.inlineValue}>
          {model.support_api_protocols.join(', ') || t('model.unknown')}
        </p>
      </section>
      {(model.model_doc_url || model.integration_doc_url) && (
        <section className={css.section}>
          <h3>{t('model.documents')}</h3>
          <div className={css.links}>
            {model.model_doc_url && (
              <a href={model.model_doc_url} target="_blank" rel="noreferrer">
                {t('model.modelDocumentation')}
              </a>
            )}
            {model.integration_doc_url && (
              <a
                href={model.integration_doc_url}
                target="_blank"
                rel="noreferrer"
              >
                {t('model.integrationDocumentation')}
              </a>
            )}
          </div>
        </section>
      )}
    </Modal>
  );
}
