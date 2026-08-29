import { describe, expect, it, vi } from 'vitest';
import { createPiAiSettingsController } from '../src/client/controller/settings/pi-ai-settings-controller.ts';
import { createQiniuSettingsController } from '../src/client/controller/settings/qiniu-settings-controller.ts';

function settingsScope(initialValue: Record<string, unknown>) {
  let value = initialValue;
  const set = vi.fn(async (field: string, nextValue: unknown) => {
    value = { ...value, [field]: nextValue };
  });

  return {
    getSnapshot: () => ({ value }),
    set,
    subscribe: () => () => {},
  };
}

describe('settings controllers', () => {
  it('normalizes Qiniu settings from its namespace', () => {
    const controller = createQiniuSettingsController(
      settingsScope({
        enabledModelIds: ['model-a', 42],
        region: 'global',
        inferenceProtocol: 'anthropic-messages',
      }) as never,
    );

    expect(controller.read()).toEqual({
      enabledModelIds: ['model-a'],
      region: 'global',
      inferenceProtocol: 'anthropic-messages',
    });
  });

  it('writes Qiniu settings through its namespace controller', async () => {
    const scope = settingsScope({});
    const controller = createQiniuSettingsController(scope as never);

    await controller.setEnabledModelIds(['model-a']);
    await controller.setRegion('global');
    await controller.setInferenceProtocol('openai-responses');

    expect(controller.read()).toEqual({
      enabledModelIds: ['model-a'],
      region: 'global',
      inferenceProtocol: 'openai-responses',
    });
    expect(scope.set).toHaveBeenNthCalledWith(1, 'enabledModelIds', [
      'model-a',
    ]);
  });

  it('reads and writes Pi AI providers through its namespace controller', async () => {
    const scope = settingsScope({});
    const controller = createPiAiSettingsController(scope as never);
    const providers = { 'qiniu-maas': { displayName: 'Qiniu MaaS' } };

    await controller.setProviders(providers);

    expect(controller.read()).toEqual({ providers });
    expect(scope.set).toHaveBeenCalledWith('providers', providers);
  });
});
