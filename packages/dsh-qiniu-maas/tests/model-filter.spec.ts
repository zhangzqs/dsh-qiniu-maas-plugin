import { describe, expect, it } from 'vitest';
import type { Model } from 'qiniu-maas-model-market';
import {
  filterModels,
  sortModels,
} from '../src/client/main/page/panels/ModelsPanel.tsx';

const models = [
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Fast model',
    release_at: '2026-01-01',
  },
  {
    id: 'beta',
    name: 'Beta',
    description: 'Reasoning model',
    release_at: '2026-02-01',
  },
] as Model[];

describe('filterModels', () => {
  it('returns all matching models in the all view', () => {
    expect(filterModels(models, false, [], 'fast')).toEqual([models[0]]);
  });

  it('limits the enabled view to enabled model IDs', () => {
    expect(filterModels(models, true, ['beta'], '')).toEqual([models[1]]);
  });

  it('sorts models by the selected ordering', () => {
    expect(
      sortModels(models, 'release-newest').map((model) => model.id),
    ).toEqual(['beta', 'alpha']);
    expect(sortModels(models, 'name-asc').map((model) => model.id)).toEqual([
      'alpha',
      'beta',
    ]);
    expect(sortModels(models, 'name-desc').map((model) => model.id)).toEqual([
      'beta',
      'alpha',
    ]);
  });
});
