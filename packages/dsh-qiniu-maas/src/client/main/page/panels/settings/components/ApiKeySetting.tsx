import { useEffect, useState, type ReactNode } from 'react';
import { Button, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './ApiKeySetting.module.css';

export interface Props {
  checkApiKeyConfigured: () => Promise<boolean>;
  saveApiKey: (value: string) => Promise<void>;
}

function apiKeyStatusLabel(
  checking: boolean,
  statusError: string | undefined,
  configured: boolean | undefined,
): string {
  if (checking) return '检查配置中...';
  if (statusError) return `检查失败：${statusError}`;
  return configured ? '已配置' : '未配置';
}

export function ApiKeySetting({
  checkApiKeyConfigured,
  saveApiKey,
}: Props): ReactNode {
  const [value, setValue] = useState('');
  const [configured, setConfigured] = useState<boolean>();
  const [statusError, setStatusError] = useState<string>();
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setChecking(true);
    void checkApiKeyConfigured()
      .then((nextConfigured) => {
        if (!active) return;
        setConfigured(nextConfigured);
        setStatusError(undefined);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setStatusError(
          reason instanceof Error ? reason.message : String(reason),
        );
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [checkApiKeyConfigured]);

  const submit = async (): Promise<void> => {
    setSaving(true);
    try {
      await saveApiKey(value);
      setConfigured(true);
      setValue('');
      setStatusError(undefined);
    } catch (reason) {
      setStatusError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
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
            configured ? '已配置，如需更换请重新输入' : '输入 API Key'
          }
        />
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={saving || value.trim().length === 0}
          onClick={() => void submit()}
        >
          {saving ? '保存中...' : '保存 API Key'}
        </Button>
      </div>
      <span className={css.status}>
        {apiKeyStatusLabel(checking, statusError, configured)}
      </span>
    </section>
  );
}
