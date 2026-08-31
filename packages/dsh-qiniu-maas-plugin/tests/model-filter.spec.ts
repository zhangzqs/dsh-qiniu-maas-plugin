import { describe, expect, it } from 'vitest';
import type { Model } from 'qiniu-maas-market-sdk';
import {
  filterModels,
  sortModels,
} from '../src/client/ui/page/panels/model-center/model-utils.ts';

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
  {
    id: 'retired',
    name: 'Retired',
    description: 'Legacy model',
    release_at: '2025-01-01',
    suggested_model: 'beta',
  },
] as Model[];

describe('filterModels', () => {
  it('returns all matching models in the all view', () => {
    expect(filterModels(models, false, [], 'fast')).toEqual([models[0]]);
  });

  it('limits the enabled view to enabled model IDs', () => {
    expect(filterModels(models, true, ['beta'], '')).toEqual([models[1]]);
  });

  it('hides retired models unless explicitly requested', () => {
    expect(filterModels(models, false, [], '')).toEqual([models[0], models[1]]);
    expect(filterModels(models, false, [], '', true)).toEqual(models);
  });

  it('sorts models by the selected ordering', () => {
    expect(
      sortModels(models, 'release-newest').map((model) => model.id),
    ).toEqual(['beta', 'alpha', 'retired']);
    expect(sortModels(models, 'name-asc').map((model) => model.id)).toEqual([
      'alpha',
      'beta',
      'retired',
    ]);
    expect(sortModels(models, 'name-desc').map((model) => model.id)).toEqual([
      'retired',
      'beta',
      'alpha',
    ]);
  });
});
