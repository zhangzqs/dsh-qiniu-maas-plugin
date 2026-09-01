import { Modal, Pill } from '@deepseek-ai/dsh-client-ui-primitives';
import { Fragment, type ReactNode } from 'react';
import { LuExternalLink } from 'react-icons/lu';
import type { Model, PricingItem, PricingRule } from 'qiniu-maas-market-sdk';
import { ModelAvatar } from './ModelAvatar.tsx';
import css from './ModelDetailDialog.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';
import { modelCardKeys } from './ModelCard.locales.ts';
import { modelDetailKeys } from './ModelDetailDialog.locales.ts';

function formatTokenCount(value: number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value < 1_000) return value.toLocaleString();

  const divisor = value < 1_000_000 ? 1_000 : 1_000_000;
  const unit = value < 1_000_000 ? 'K' : 'M';
  const compactValue = Number((value / divisor).toFixed(1));
  return `${compactValue}${unit}`;
}

function formatPricingValue(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function formatPricingRange(range: number[]): string {
  const [start, end] = range;
  const formatBoundary = (value: number | undefined): string => {
    if (value === undefined || value < 0) return '∞';
    return formatTokenCount(value) ?? String(value);
  };
  return `${formatBoundary(start)} - ${formatBoundary(end)}`;
}

function pricingItems(rule: PricingRule): [string, PricingItem][] {
  return Object.entries(rule.details_v2 ?? {}).filter(
    (entry): entry is [string, PricingItem] =>
      entry[1] !== undefined &&
      typeof entry[1] === 'object' &&
      typeof entry[1].unit_price === 'number',
  );
}

interface Props {
  model: Model;
  onClose: () => void;
}

function ModelInfoSection({
  issuerName,
  releaseAt,
  inputModalities,
  outputModalities,
}: {
  issuerName?: string;
  releaseAt: string;
  inputModalities?: readonly string[];
  outputModalities?: readonly string[];
}): ReactNode {
  const t = useQiniuT();
  return (
    <section className={css.section}>
      <h3>{t(modelDetailKeys.info)}</h3>
      <div className={css.details}>
        <span>{t(modelDetailKeys.issuer)}</span>
        <strong>{issuerName || t(modelDetailKeys.unknown)}</strong>
        <span>{t(modelDetailKeys.releaseAt)}</span>
        <strong>{releaseAt || t(modelDetailKeys.unknown)}</strong>
        <span>{t(modelDetailKeys.input)}</span>
        <strong>
          {inputModalities?.join(', ') || t(modelDetailKeys.unknown)}
        </strong>
        <span>{t(modelDetailKeys.output)}</span>
        <strong>
          {outputModalities?.join(', ') || t(modelDetailKeys.unknown)}
        </strong>
      </div>
    </section>
  );
}

function ModelLimitsSection({
  contextLength,
  maxOutput,
}: {
  contextLength?: number;
  maxOutput?: number;
}): ReactNode {
  const t = useQiniuT();
  return (
    <section className={css.section}>
      <h3>{t(modelDetailKeys.limits)}</h3>
      <div className={css.details}>
        <span>{t(modelDetailKeys.context)}</span>
        <strong>
          {formatTokenCount(contextLength) ?? t(modelDetailKeys.unknown)}
        </strong>
        <span>{t(modelDetailKeys.maxOutput)}</span>
        <strong>
          {formatTokenCount(maxOutput) ?? t(modelDetailKeys.unknown)}
        </strong>
      </div>
    </section>
  );
}

function ModelPricingSection({
  pricingRules,
}: {
  pricingRules?: readonly PricingRule[];
}): ReactNode {
  const t = useQiniuT();
  const validPricingRules = pricingRules?.filter(
    (rule) => pricingItems(rule).length > 0,
  );
  if (validPricingRules === undefined || validPricingRules.length === 0)
    return null;

  return (
    <section className={css.section}>
      <h3>{t(modelDetailKeys.pricing)}</h3>
      {validPricingRules.map((rule, ruleIndex) => {
        const items = pricingItems(rule);
        return (
          <div className={css.pricingRule} key={ruleIndex}>
            <p className={css.pricingRange}>
              {t(modelDetailKeys.pricingRange)}:{' '}
              {formatPricingRange(rule.input_range)}
            </p>
            <div className={css.pricingTable} role="table">
              <span className={css.pricingHeader} role="columnheader">
                {t(modelDetailKeys.pricingItem)}
              </span>
              <span className={css.pricingHeader} role="columnheader">
                {t(modelDetailKeys.rmbPrice)}
              </span>
              <span className={css.pricingHeader} role="columnheader">
                {t(modelDetailKeys.usdPrice)}
              </span>
              {items.map(([key, item]) => (
                <Fragment key={key}>
                  <span>{item.name || key}</span>
                  <span className={css.pricingValue}>
                    ¥{formatPricingValue(item.unit_price)} / {item.unit_size}{' '}
                    {item.unit_name}
                  </span>
                  <span className={css.pricingValue}>
                    ${formatPricingValue(item.unit_price_usd)} /{' '}
                    {item.unit_size} {item.unit_name}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ModelCapabilitiesSection({
  features,
  reasoningSupported,
  functionCallingSupported,
  structuredOutputSupported,
}: {
  features: readonly string[];
  reasoningSupported?: boolean;
  functionCallingSupported?: boolean;
  structuredOutputSupported?: boolean;
}): ReactNode {
  const t = useQiniuT();
  return (
    <section className={css.section}>
      <h3>{t(modelDetailKeys.capabilities)}</h3>
      <div className={css.tags}>
        {features.map((feature) => (
          <Pill key={feature}>{feature}</Pill>
        ))}
        {reasoningSupported && <Pill>{t(modelDetailKeys.reasoning)}</Pill>}
        {functionCallingSupported && (
          <Pill>{t(modelDetailKeys.functionCalling)}</Pill>
        )}
        {structuredOutputSupported && (
          <Pill>{t(modelDetailKeys.structuredOutput)}</Pill>
        )}
      </div>
    </section>
  );
}

function ModelProtocolsSection({
  protocols,
}: {
  protocols: readonly string[];
}): ReactNode {
  const t = useQiniuT();
  return (
    <section className={css.section}>
      <h3>{t(modelDetailKeys.protocols)}</h3>
      <p className={css.inlineValue}>
        {protocols.join(', ') || t(modelDetailKeys.unknown)}
      </p>
    </section>
  );
}

function ModelDocumentsSection({
  modelDocUrl,
  integrationDocUrl,
}: {
  modelDocUrl?: string;
  integrationDocUrl?: string;
}): ReactNode {
  const t = useQiniuT();
  if (!modelDocUrl && !integrationDocUrl) return null;

  return (
    <section className={css.section}>
      <h3>{t(modelDetailKeys.documents)}</h3>
      <div className={css.links}>
        {modelDocUrl && (
          <a href={modelDocUrl} target="_blank" rel="noreferrer">
            <LuExternalLink size={14} aria-hidden="true" />
            {t(modelDetailKeys.modelDocumentation)}
          </a>
        )}
        {integrationDocUrl && (
          <a href={integrationDocUrl} target="_blank" rel="noreferrer">
            <LuExternalLink size={14} aria-hidden="true" />
            {t(modelDetailKeys.integrationDocumentation)}
          </a>
        )}
      </div>
    </section>
  );
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
      <ModelInfoSection
        issuerName={model.issuer?.name}
        releaseAt={model.release_at}
        inputModalities={model.architecture?.input_modalities}
        outputModalities={model.architecture?.output_modalities}
      />
      <ModelLimitsSection
        contextLength={model.model_constraints?.context_length}
        maxOutput={
          model.model_constraints?.max_completion_tokens ??
          model.model_constraints?.max_tokens
        }
      />
      <ModelPricingSection pricingRules={model.pricing_rules_v2} />
      <ModelCapabilitiesSection
        features={model.features}
        reasoningSupported={model.architecture?.reasoning?.supported}
        functionCallingSupported={
          model.architecture?.function_calling?.supported
        }
        structuredOutputSupported={model.architecture?.schema_output?.supported}
      />
      <ModelProtocolsSection protocols={model.support_api_protocols} />
      <ModelDocumentsSection
        modelDocUrl={model.model_doc_url}
        integrationDocUrl={model.integration_doc_url}
      />
    </Modal>
  );
}
