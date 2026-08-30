---
name: qiniu-release
description: Use when publishing a Qiniu MaaS DSH plugin, upgrading SDK or plugin versions, creating a GitHub Release, or attaching release artifacts.
---

# 七牛 MaaS 插件发布

## 发布约定

- SDK：`packages/qiniu-maas-market-sdk`
- 插件：`packages/dsh-qiniu-maas-plugin`
- Release tag：`v<插件 package.json 的 version>`
- RC 版本必须同时写入相关 `package.json`，例如版本 `0.1.6-rc.0` 对应 tag `v0.1.6-rc.0`；正式版本再单独改为 `0.1.6` 并创建 `v0.1.6`。
- GitHub Actions 不自动修改 `main`、创建 tag 或创建 Release。
- Release 由用户在 GitHub 页面手工创建；`.github/workflows/release.yml` 只构建并上传 `.tgz` 产物。
- prerelease 和正式 Release 都可以上传产物；正式 Release 必须由用户手工创建或将 prerelease 转正。

## 流程

1. 检查工作树必须干净，然后切换并同步主分支：

   ```sh
   git status --short
   git switch main
   git pull --ff-only origin main
   ```

2. 找到已合并到当前 `HEAD` 的最新插件 tag，并查看该 tag 到当前提交的变更：

   ```sh
   LAST_TAG="$(git tag --merged HEAD --list 'v*' --sort=-version:refname | head -n1)"
   git log --oneline "$LAST_TAG"..HEAD
   git diff --stat "$LAST_TAG"..HEAD
   git diff --name-only "$LAST_TAG"..HEAD
   ```

   没有历史 tag 时停止并要求人工确认首个版本。SDK 有源码或公开接口变更时同时升级 SDK 和插件；仅插件变更时只升级插件。不要从 commit 文本自动猜测 SemVer，先让用户确认 `patch`、`minor`、`major` 或完整预发布版本号。

3. 通过 PR 修改需要升级的 package 版本号并合并到 `main`。预发布版本使用标准 SemVer，例如 `0.1.6-rc.0`，不要使用 `0.1.6.rc`。不要直接向受保护的 `main` 推送版本修改。

   RC 验证通过后，另开一个版本 PR，把相关包从 `0.1.6-rc.0` 改为正式版本 `0.1.6`，合并后再创建新的正式 Release。不要复用 RC tag，也不要只修改 tag 而保留 RC 的 package 版本。

4. 在 GitHub Release 页面选择已合并提交对应的 tag，创建 Release。自动 prerelease 使用 `-rc.N` tag；正式版本由用户手工创建或取消 prerelease 标记。创建 Release 后会触发 `Release Assets` workflow。

5. 轮询 workflow，直到成功：

   ```sh
   gh run list --workflow "Release Assets" --limit 5
   gh run view <run-id> --json status,conclusion,url
   ```

   失败时使用 `gh run view <run-id> --log-failed` 报告失败步骤，不声称发布成功。

6. workflow 使用 `gh release upload --clobber`，因此同一 Release 可安全重复执行。需要手工重跑时，在 Actions 页面运行 `Release Assets` 并填写同一个 tag；不要创建重复 tag 或 Release。

7. 只有 workflow 成功且产物已上传后，返回：

   ```sh
   gh release view "$TAG" --json url,name,tagName,isDraft,isPrerelease,publishedAt
   ```

   最终报告包版本、tag、workflow 状态和可点击的 Release 链接。
