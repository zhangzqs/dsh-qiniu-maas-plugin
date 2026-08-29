import { Modal, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import type { ReactNode } from 'react';
import type { Model } from 'qiniu-maas-market-sdk';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelDetailDialog.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';
import { modelCardKeys } from './ModelCard.locales.ts';
import { modelDetailKeys } from './ModelDetailDialog.locales.ts';

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
      closeLabel={t(modelDetailKeys.close)}
      onClose={onClose}
      className={css.modal}
      contentClassName={css.content}
    >
      <ModelAvatar model={model} size="dialog" />
      <p className={css.kicker}>{t(modelDetailKeys.kicker)}</p>
      <p className={css.description}>
        {model.description || t(modelCardKeys.noDescription)}
      </p>
      <section className={css.section}>
        <h3>{t(modelDetailKeys.info)}</h3>
        <div className={css.details}>
          <span>{t(modelDetailKeys.issuer)}</span>
          <strong>{model.issuer?.name || t(modelDetailKeys.unknown)}</strong>
          <span>{t(modelDetailKeys.releaseAt)}</span>
          <strong>{model.release_at || t(modelDetailKeys.unknown)}</strong>
          <span>{t(modelDetailKeys.input)}</span>
          <strong>
            {model.architecture?.input_modalities.join(', ') ||
              t(modelDetailKeys.unknown)}
          </strong>
          <span>{t(modelDetailKeys.output)}</span>
          <strong>
            {model.architecture?.output_modalities.join(', ') ||
              t(modelDetailKeys.unknown)}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>{t(modelDetailKeys.limits)}</h3>
        <div className={css.details}>
          <span>{t(modelDetailKeys.context)}</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.context_length,
              t(modelDetailKeys.unknown),
            )}
          </strong>
          <span>{t(modelDetailKeys.maxOutput)}</span>
          <strong>
            {formatTokenCount(
              model.model_constraints?.max_completion_tokens ??
                model.model_constraints?.max_tokens,
              t(modelDetailKeys.unknown),
            )}
          </strong>
        </div>
      </section>
      <section className={css.section}>
        <h3>{t(modelDetailKeys.capabilities)}</h3>
        <div className={css.tags}>
          {model.features.map((feature) => (
            <Pill key={feature}>{feature}</Pill>
          ))}
          {model.architecture?.reasoning?.supported && (
            <Pill>{t(modelDetailKeys.reasoning)}</Pill>
          )}
          {model.architecture?.function_calling?.supported && (
            <Pill>{t(modelDetailKeys.functionCalling)}</Pill>
          )}
          {model.architecture?.schema_output?.supported && (
            <Pill>{t(modelDetailKeys.structuredOutput)}</Pill>
          )}
        </div>
      </section>
      <section className={css.section}>
        <h3>{t(modelDetailKeys.protocols)}</h3>
        <p className={css.inlineValue}>
          {model.support_api_protocols.join(', ') || t(modelDetailKeys.unknown)}
        </p>
      </section>
      {(model.model_doc_url || model.integration_doc_url) && (
        <section className={css.section}>
          <h3>{t(modelDetailKeys.documents)}</h3>
          <div className={css.links}>
            {model.model_doc_url && (
              <a href={model.model_doc_url} target="_blank" rel="noreferrer">
                {t(modelDetailKeys.modelDocumentation)}
              </a>
            )}
            {model.integration_doc_url && (
              <a
                href={model.integration_doc_url}
                target="_blank"
                rel="noreferrer"
              >
                {t(modelDetailKeys.integrationDocumentation)}
              </a>
            )}
          </div>
        </section>
      )}
    </Modal>
  );
}
