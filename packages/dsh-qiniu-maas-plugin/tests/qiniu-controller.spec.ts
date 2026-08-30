import { describe, expect, it, vi } from 'vitest';
import { createQiniuController } from '../src/client/controller/qiniu-controller.ts';
import { QINIU_API_KEY_REF } from '../src/client/controller/provider-config.ts';

describe('qiniu controller', () => {
  it('checks API Key configuration on demand', async () => {
    const describeCredentials = vi.fn().mockResolvedValue({
      result: {
        ok: true,
        value: {
          credentials: {
            [QINIU_API_KEY_REF]: { configured: true },
          },
        },
      },
    });
    const controller = createQiniuController(
      { api: { credentials: { describe: describeCredentials } } } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(controller.checkApiKeyConfigured()).resolves.toBe(true);
    expect(describeCredentials).toHaveBeenCalledWith({
      refs: [QINIU_API_KEY_REF],
    });
  });
});
