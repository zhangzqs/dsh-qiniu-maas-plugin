# Real Qiniu MaaS acceptance

This test is opt-in and never prints the runtime-only credential file.

1. Ensure the Qiniu MaaS package is mounted in the existing DSH GUI at `http://127.0.0.1:3080`.
2. Place credentials in `/home/zzq/.config/dsh/qiniu-maas-e2e.json` using the local secret-file contract.
3. Run `QINIU_MAAS_REAL_E2E=1 pnpm test:e2e:qiniu`.
4. Remove any generated Playwright report or state containing form history after inspection.

The test requires the exact marketplace model ID `deepseek-v4-flash`. Missing GUI, missing secret file, or missing opt-in flag produces an explicit skip. Credentials are never included in DOM assertions, logs, screenshots, or reports by the test code.
