export type QiniuRegion = 'cn' | 'global';

export type QiniuInferenceProtocol =
  | 'openai-completions'
  | 'anthropic-messages';

export const QINIU_LLM_BASE_URLS = {
  cn: {
    'openai-completions': 'https://api.qnaigc.com/v1',
    'anthropic-messages': 'https://api.qnaigc.com',
  },
  global: {
    'openai-completions': 'https://api.modelink.ai/v1',
    'anthropic-messages': 'https://api.modelink.ai',
  },
} as const satisfies Record<
  QiniuRegion,
  Record<QiniuInferenceProtocol, string>
>;
