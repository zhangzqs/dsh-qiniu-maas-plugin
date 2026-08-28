import type { ReactNode } from 'react';
import type { Model } from 'qiniu-maas-model-market';
import { selectAvailableModels } from '../../../../controller/provider-controller.ts';
import { ModelCard } from '../../components/model/ModelCard.tsx';
import css from './AvailableModelsPanel.module.css';

interface Props {
  market: readonly Model[];
  availableModelIds: readonly string[];
  onDetails: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
}

export function AvailableModelsPanel({
  market,
  availableModelIds,
  onDetails,
  onToggle,
}: Props): ReactNode {
  const models = selectAvailableModels(market, availableModelIds);
  return (
    <div className={css.list}>
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          isAvailable
          onDetails={onDetails}
          onToggle={onToggle}
        />
      ))}
      {models.length === 0 && <p className={css.empty}>还没有可用模型。</p>}
    </div>
  );
}
