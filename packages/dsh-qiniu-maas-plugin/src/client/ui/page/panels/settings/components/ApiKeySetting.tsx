import { useEffect, useState, type ReactNode } from 'react';
import { Button, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './ApiKeySetting.module.css';
import { useQiniuT } from '../../../../i18n/index.ts';
import { commonKeys } from '../../../Common.locales.ts';
import { apiKeySettingKeys } from './ApiKeySetting.locales.ts';

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

  const getStatusLabel = (): string => {
    if (isChecking) return t(apiKeySettingKeys.checking);
    if (statusError !== undefined) {
      return t(apiKeySettingKeys.checkFailed, { error: statusError });
    }
    return isConfigured
      ? t(apiKeySettingKeys.configured)
      : t(apiKeySettingKeys.notConfigured);
  };

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
      <h3>{t(apiKeySettingKeys.title)}</h3>
      <p className={css.description}>{t(apiKeySettingKeys.description)}</p>
      <div className={css.row}>
        <Input
          className={css.input}
          aria-label={t(apiKeySettingKeys.title)}
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            isConfigured
              ? t(apiKeySettingKeys.configured)
              : t(apiKeySettingKeys.placeholder)
          }
        />
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={isSaving || value.trim().length === 0}
          onClick={() => void handleSubmit()}
        >
          {isSaving ? t(commonKeys.saving) : t(apiKeySettingKeys.save)}
        </Button>
      </div>
      <span className={css.status}>{getStatusLabel()}</span>
    </section>
  );
}
