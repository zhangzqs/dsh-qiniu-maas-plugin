import type { LocaleId } from '@deepseek-ai/dsh-client-locale/client';

export type QiniuLocaleMessage = Record<LocaleId, string>;
export type QiniuLocaleMessages = Record<string, QiniuLocaleMessage>;
