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
      <h3>{t('settings.apiKey.title')}</h3>
      <p className={css.description}>{t('settings.apiKey.description')}</p>
      <div className={css.row}>
        <Input
          className={css.input}
          aria-label={t('settings.apiKey.title')}
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            isConfigured
              ? t('settings.apiKey.configured')
              : t('settings.apiKey.placeholder')
          }
        />
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={isSaving || value.trim().length === 0}
          onClick={() => void handleSubmit()}
        >
          {isSaving ? t('common.loading.saving') : t('settings.apiKey.save')}
        </Button>
      </div>
      <span className={css.status}>
        {isChecking
          ? t('settings.apiKey.checking')
          : statusError
            ? t('settings.apiKey.checkFailed', { error: statusError })
            : isConfigured
              ? t('settings.apiKey.configured')
              : t('settings.apiKey.notConfigured')}
      </span>
    </section>
  );
}
