import { useEffect, useState, type ReactNode } from 'react';
import { Button, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './ApiKeySetting.module.css';

export interface Props {
  checkApiKeyConfigured: () => Promise<boolean>;
  setApiKey: (value: string) => Promise<void>;
}

function apiKeyStatusLabel(
  isChecking: boolean,
  statusError: string | undefined,
  isConfigured: boolean | undefined,
): string {
  if (isChecking) return '检查配置中...';
  if (statusError) return `检查失败：${statusError}`;
  return isConfigured ? '已配置' : '未配置';
}

export function ApiKeySetting({
  checkApiKeyConfigured,
  setApiKey,
}: Props): ReactNode {
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
      <h3>推理 API Key</h3>
      <p className={css.description}>设置后，已启用模型可以在会话中调用。</p>
      <div className={css.row}>
        <Input
          className={css.input}
          aria-label="推理 API Key"
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            isConfigured ? '已配置，如需更换请重新输入' : '输入 API Key'
          }
        />
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={isSaving || value.trim().length === 0}
          onClick={() => void handleSubmit()}
        >
          {isSaving ? '保存中...' : '保存 API Key'}
        </Button>
      </div>
      <span className={css.status}>
        {apiKeyStatusLabel(isChecking, statusError, isConfigured)}
      </span>
    </section>
  );
}
