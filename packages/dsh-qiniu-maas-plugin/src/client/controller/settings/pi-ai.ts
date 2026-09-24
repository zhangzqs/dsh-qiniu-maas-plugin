import type { Options as PiAiOptions } from '@deepseek-ai/dsh-llm-pi-ai';
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';

export type PiAiSettings = Pick<PiAiOptions, 'providers'>;

export interface PiAiSettingsController {
  read(): PiAiSettings;
  setProviders(
    providers: NonNullable<PiAiSettings['providers']>,
  ): Promise<boolean>;
}

export function createPiAiSettingsController(
  settings: ConfigForm<PiAiSettings>,
): PiAiSettingsController {
  function read(): PiAiSettings {
    return settings.getSnapshot().value ?? {};
  }

  function setProviders(
    providers: NonNullable<PiAiSettings['providers']>,
  ): Promise<boolean> {
    return settings.set('providers', providers);
  }

  return { read, setProviders };
}
