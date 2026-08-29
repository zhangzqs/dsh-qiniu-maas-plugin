import type { Config as PiAiConfig } from '@deepseek-ai/dsh-llm-pi-ai';
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';

export type PiAiSettings = Pick<PiAiConfig, 'providers'>;

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
