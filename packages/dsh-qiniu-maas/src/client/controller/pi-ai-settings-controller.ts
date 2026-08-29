import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
import type { PiAiSettings } from './qiniu-state.ts';

export interface PiAiSettingsController {
  read(): PiAiSettings;
  setProviders(
    providers: NonNullable<PiAiSettings['providers']>,
  ): Promise<void>;
}

export function createPiAiSettingsController(
  settings: SettingsScope<PiAiSettings>,
): PiAiSettingsController {
  function read(): PiAiSettings {
    return settings.getSnapshot().value ?? {};
  }

  function setProviders(
    providers: NonNullable<PiAiSettings['providers']>,
  ): Promise<void> {
    return settings.set('providers', providers);
  }

  return { read, setProviders };
}
