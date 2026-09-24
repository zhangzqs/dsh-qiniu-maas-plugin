import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';

/**
 * Start initialization once every required Host configuration is writable.
 * The returned disposer prevents later starts and aborts an in-flight task.
 */
export function initializeWhenSettingsReady(
  forms: readonly ConfigForm<unknown>[],
  initialize: (signal: AbortSignal) => Promise<void>,
  onError: (error: unknown) => void,
): () => Promise<void> {
  const abortController = new AbortController();
  let started = false;
  let task: Promise<void> | undefined;

  function startIfReady(): void {
    if (started || abortController.signal.aborted) return;
    const ready = forms.every((form) => {
      const snapshot = form.getSnapshot();
      return snapshot.status === 'ready' && snapshot.writable;
    });
    if (!ready) return;

    started = true;
    task = initialize(abortController.signal).catch((error: unknown) => {
      if (!abortController.signal.aborted) onError(error);
    });
  }

  const unsubscribers = forms.map((form) => form.subscribe(startIfReady));
  startIfReady();

  return async () => {
    abortController.abort();
    for (const unsubscribe of unsubscribers) unsubscribe();
    await task;
  };
}
