import { describe, expect, it } from 'vitest';
import { qiniuMessages } from '../src/client/ui/i18n/index.ts';
import {
  tabsKeys,
  tabsMessages,
} from '../src/client/ui/page/components/Tabs.locales.ts';
import {
  qiniuSettingsSectionKeys,
  qiniuSettingsSectionMessages,
} from '../src/client/ui/QiniuSettingsSection.locales.ts';

describe('qiniu locale messages', () => {
  it('builds dictionaries for every supported locale', () => {
    expect(qiniuMessages.zh['model.center.count']).toBe('{count} 个模型');
    expect(qiniuMessages.en['model.center.count']).toBe('{count} models');
  });

  it('keeps each key paired with every supported locale', () => {
    expect(tabsMessages[tabsKeys.modelCenter]).toEqual({
      zh: '模型中心',
      en: 'Model Center',
    });

    for (const messages of Object.values(qiniuMessages)) {
      expect(Object.keys(messages)).toEqual(Object.keys(qiniuMessages.zh));
    }
  });

  it('includes the settings section label translations', () => {
    expect(
      qiniuSettingsSectionMessages[qiniuSettingsSectionKeys.label],
    ).toEqual({
      zh: '七牛 MaaS',
      en: 'Qiniu MaaS',
    });
  });
});
