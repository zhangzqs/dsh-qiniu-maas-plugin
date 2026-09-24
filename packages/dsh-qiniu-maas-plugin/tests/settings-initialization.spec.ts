import { describe, expect, it, vi } from 'vitest';
import type {
  ConfigForm,
  ConfigFormSnapshot,
} from '@deepseek-ai/dsh-client-ui-settings/client';
import { initializeWhenSettingsReady } from '../src/client/controller/settings-initialization.ts';

interface FormHandle {
  form: ConfigForm<unknown>;
  publish(next: Partial<ConfigFormSnapshot<unknown>>): void;
  listenerCount(): number;
}

function createForm(): FormHandle {
  let snapshot: ConfigFormSnapshot<unknown> = {
    status: 'loading',
    value: undefined,
    base: undefined,
    user: undefined,
    revision: undefined,
    writable: false,
    mode: 'host',
  };
  const listeners = new Set<() => void>();
  return {
    form: {
      getSnapshot: () => snapshot,
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      set: async () => true,
      unset: async () => true,
      mutate: async () => true,
    },
    publish: (next) => {
      snapshot = { ...snapshot, ...next };
      for (const listener of listeners) listener();
    },
    listenerCount: () => listeners.size,
  };
}

describe('settings initialization', () => {
  it('starts once after every required form is ready and writable', async () => {
    const qiniu = createForm();
    const piAi = createForm();
    const initialize = vi.fn().mockResolvedValue(undefined);
    const dispose = initializeWhenSettingsReady(
      [qiniu.form, piAi.form],
      initialize,
      vi.fn(),
    );

    qiniu.publish({ status: 'ready', writable: true, value: {} });
    expect(initialize).not.toHaveBeenCalled();
    piAi.publish({ status: 'ready', writable: true, value: {} });
    expect(initialize).toHaveBeenCalledTimes(1);

    piAi.publish({ value: { providers: {} } });
    expect(initialize).toHaveBeenCalledTimes(1);
    await dispose();
  });

  it('aborts and waits for in-flight initialization during disposal', async () => {
    const qiniu = createForm();
    const finish = Promise.withResolvers<void>();
    let signal: AbortSignal | undefined;
    const initialize = vi.fn((nextSignal: AbortSignal) => {
      signal = nextSignal;
      return finish.promise;
    });
    qiniu.publish({ status: 'ready', writable: true, value: {} });
    const dispose = initializeWhenSettingsReady(
      [qiniu.form],
      initialize,
      vi.fn(),
    );

    expect(initialize).toHaveBeenCalledTimes(1);
    const disposing = dispose();
    expect(signal?.aborted).toBe(true);
    expect(qiniu.listenerCount()).toBe(0);

    let disposed = false;
    void disposing.then(() => {
      disposed = true;
    });
    await Promise.resolve();
    expect(disposed).toBe(false);
    finish.resolve();
    await disposing;
    expect(disposed).toBe(true);
  });
});
