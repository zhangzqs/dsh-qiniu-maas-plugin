import { describe, expect, it } from 'vitest';
import { translateWithMessages } from '../src/client/ui/i18n.ts';

describe('qiniu locale messages', () => {
  it('translates parameterized messages in both supported locales', () => {
    expect(translateWithMessages('zh', 'model.count', { count: 3 })).toBe(
      '3 个模型',
    );
    expect(translateWithMessages('en', 'model.count', { count: 3 })).toBe(
      '3 models',
    );
  });
});
