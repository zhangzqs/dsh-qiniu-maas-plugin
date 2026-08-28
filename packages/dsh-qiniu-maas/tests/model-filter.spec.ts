import { describe, expect, it } from 'vitest';
import type { Model } from 'qiniu-maas-model-market';
import { filterModels } from '../src/client/main/page/model-filter.ts';

const models = [
  { id: 'alpha', name: 'Alpha', description: 'Fast model' },
  { id: 'beta', name: 'Beta', description: 'Reasoning model' },
] as Model[];

describe('filterModels', () => {
  it('returns all matching models in the all view', () => {
    expect(filterModels(models, false, [], 'fast')).toEqual([models[0]]);
  });

  it('limits the enabled view to enabled model IDs', () => {
    expect(filterModels(models, true, ['beta'], '')).toEqual([models[1]]);
  });
});
