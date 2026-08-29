# Project Conventions

- Use TypeScript/TSX for SDK and plugin source when practical.
- Keep the Qiniu MaaS management SDK separate from the DSH plugin; the plugin calls the SDK rather than embedding management transport logic.
- The SDK covers MaaS management APIs only. Actual model inference uses DSH's native `llm` provider mechanism.
- Public model-marketplace APIs are unauthenticated; privileged management APIs use AK/SK; inference uses API Key.
- Use `dsh-market` as a layout and information-density reference without copying its code or branding.
- Compile plugin output to JavaScript compatible with the DSH loader/runtime.
- Pull Request 标题使用 Conventional Commits 类型前缀，冒号后的描述和正文使用中文。
