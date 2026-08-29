import { useEffect, useState, type ReactNode } from 'react';
import { Button, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './ApiKeySetting.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';

export interface Props {
  checkApiKeyConfigured: () => Promise<boolean>;
  setApiKey: (value: string) => Promise<void>;
}

export function ApiKeySetting({
  checkApiKeyConfigured,
  setApiKey,
}: Props): ReactNode {
  const t = useQiniuT();
  const [value, setValue] = useState('');
  const [isConfigured, setIsConfigured] = useState<boolean>();
  const [statusError, setStatusError] = useState<string>();
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isActive = true;
    setIsChecking(true);
    void checkApiKeyConfigured()
      .then((nextConfigured) => {
        if (!isActive) return;
        setIsConfigured(nextConfigured);
        setStatusError(undefined);
      })
      .catch((reason: unknown) => {
        if (!isActive) return;
        setStatusError(
          reason instanceof Error ? reason.message : String(reason),
        );
      })
      .finally(() => {
        if (isActive) setIsChecking(false);
      });
    return () => {
      isActive = false;
    };
  }, [checkApiKeyConfigured]);

  const handleSubmit = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await setApiKey(value);
      setIsConfigured(true);
      setValue('');
      setStatusError(undefined);
    } catch (reason) {
      setStatusError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={css.setting}>
      <h3>{t('settings.apiKey')}</h3>
      <p className={css.description}>{t('settings.apiKeyDescription')}</p>
      <div className={css.row}>
        <Input
          className={css.input}
          aria-label={t('settings.apiKey')}
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            isConfigured
              ? t('settings.apiKeyConfigured')
              : t('settings.apiKeyPlaceholder')
          }
        />
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={isSaving || value.trim().length === 0}
          onClick={() => void handleSubmit()}
        >
          {isSaving ? t('model.saving') : t('settings.saveApiKey')}
        </Button>
      </div>
      <span className={css.status}>
        {isChecking
          ? t('settings.apiKeyChecking')
          : statusError
            ? t('settings.apiKeyCheckFailed', { error: statusError })
            : isConfigured
              ? t('settings.apiKeyConfigured')
              : t('settings.apiKeyNotConfigured')}
      </span>
    </section>
  );
}
