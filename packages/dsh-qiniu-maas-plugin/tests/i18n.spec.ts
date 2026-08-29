import { describe, expect, it } from 'vitest';
import { qiniuMessages } from '../src/client/ui/i18n/index.ts';
import { tabsMessages } from '../src/client/ui/page/components/Tabs.locales.ts';

describe('qiniu locale messages', () => {
  it('builds dictionaries for every supported locale', () => {
    expect(qiniuMessages.zh['model.count']).toBe('{count} 个模型');
    expect(qiniuMessages.en['model.count']).toBe('{count} models');
  });

  it('keeps each key paired with every supported locale', () => {
    expect(tabsMessages['tabs.modelCenter']).toEqual({
      zh: '模型中心',
      en: 'Model Center',
    });
  });
});
