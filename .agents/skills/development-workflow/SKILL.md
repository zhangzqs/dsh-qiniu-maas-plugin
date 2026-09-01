---
name: development-workflow
description: Use when starting a new feature, bug fix, or routine code change in this repository, including requests to create a branch or open a GitHub PR.
compatibility: 需要 Git、pnpm 和 GitHub CLI（仅在用户明确要求创建 PR 时使用 gh）。
---

# 新功能开发流程

按以下阶段执行，保持当前工作目录作为开发目录，不额外创建 worktree。

## 1. 开始前检查

先确认仓库和工作树：

```sh
pwd
git rev-parse --show-toplevel
git status --short --branch
git remote -v
```

- 当前分支必须明确；默认目标分支为 `main`。
- 如果工作树有改动，先列出并确认归属。不要自动 stash、覆盖、删除或提交不属于本任务的改动。
- 如果当前分支不是 `main` 且存在未完成工作，先说明冲突并等待用户决定；不要强行切换。

## 2. 同步主分支

工作树干净后，从远程快进同步主分支：

```sh
git switch main
git pull --ff-only origin main
```

`--ff-only` 失败时停止，报告分叉或远程异常，不自动 merge/rebase。确认 `main` 已是任务起点后再继续。

## 3. 创建开发分支

从最新 `main` 创建并切换分支，命名使用简短、可读的类别前缀：

```sh
git switch -c feat/<short-description>
# 或 fix/<short-description>
```

分支必须从已同步的 `main` 创建，且后续开发始终在当前目录的该分支进行。创建后再次运行 `git status --short --branch`。

## 4. 实现与验证

- 先阅读 `AGENTS.md`、相关 Skill、目标代码、测试和构建配置，再修改代码。
- 变更保持单一主题和最小范围；遵循项目现有框架、命名和文件组织。
- 根据风险运行相关测试；提交前至少执行项目要求的格式检查、Lint、构建、测试、类型检查和 `git diff --check`。未执行的命令不得声称已通过。
- 涉及 DSH 插件 Client/UI 时，使用 Playwright 验证实际页面、深浅色主题、窄屏和关键交互；涉及 bundle/profile 时验证真实加载路径。
- 完成前检查 `git diff`、`git diff --stat` 和 `git status`，确认没有凭证、临时文件、浏览器产物或无关改动。

## 5. 提交与 PR

只有当前任务明确要求提交或创建 PR 时，才执行以下外部写操作；否则停在本地验证并报告结果。

```sh
git add <本任务相关文件>
git commit -m "<type>: <中文描述>"
git push -u origin <branch>
gh pr create --base main --head <branch> \
  --title "<type>: <中文描述>" \
  --body-file <pr-body-file>
```

- 提交只包含本任务文件；不要把用户已有改动、`.playwright-cli/`、`.swp`、日志或凭证加入提交。
- 提交信息和 PR 标题使用 Conventional Commits，描述使用中文。
- PR 正文说明变更范围、设计决策、未改变的边界和实际运行过的验证命令。
- 创建后确认 PR URL、状态、源分支和目标分支；不要在该流程中自动创建 Release 或 tag。

## 6. 异常处理

- 远程同步、依赖安装、测试、构建或 GitHub CLI 失败时，保留现场并报告具体命令和错误。
- 不使用 `git reset --hard`、`git checkout --`、递归删除或强制推送来“清理”问题。
- 如果 PR 创建前发现分支包含无关提交，先停止并说明，不擅自重写历史。
