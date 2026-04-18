---
name: matrixmedia-cli-publish
description: Run MatrixMedia in CLI mode for login and video publishing, including argument building, preflight checks, and failure handling. Use when the user asks to publish via CLI, mentions OpenClaw/external command orchestration, or asks AI to execute cli login/cli publish in this repository.
---

# MatrixMedia CLI Publish

## Quick Start

Use this skill when the user asks to:
- use CLI mode instead of GUI
- publish videos by command line
- automate login/publish in OpenClaw or other agent workflows

Default sequence:
1. Preflight checks
2. `cli login` (only when needed)
3. `cli publish`
4. Verify exit code and summarize result

## Preflight Checklist

Before running publish commands, ensure:
- current directory is repository root
- video file path exists
- `ELECTRON_RUN_AS_NODE` is not globally forced to `1`
- platform and account identifier are provided

If the user gives incomplete parameters, ask for:
- `platform` (`dy` for Douyin as default)
- `phone` (preferred) or `partition`
- `file` path
- `title`

## Canonical Commands

Installed app (recommended) examples:

```bash
# show login help
matrixmedia cli login --help

# login (Douyin)
matrixmedia cli login -p dy --phone 13800138000

# show publish help
matrixmedia cli publish --help

# publish
matrixmedia cli publish \
  -p dy \
  --phone 13800138000 \
  -f "/absolute/path/to/video.mp4" \
  -t "视频标题" \
  --name "任务名" \
  --tags "标签1,标签2"
```

Development mode (repo local) examples:

```bash
# show publish help in source workspace
ELECTRON_RUN_AS_NODE= electron . cli publish --help
```

Windows installer behavior:
- NSIS installer writes install directory to user `PATH`.
- Executable command is unified as `matrixmedia`.
- Users should not need to choose between Chinese/English executable names.

## Argument Mapping

Map user intent to CLI args:
- `-p`, `--platform`: target platform
- `--phone` or `--partition`: account/session partition
- `-f`, `--file`: local video path
- `-t`, `--title`: required video title
- `--name`, `--book-name`: task name
- `--bt2`: short summary title
- `--tags`, `--bq`: video tags
- `--address`: location field (Baidu use case)
- `--show`: show automation window
- `--no-close-window`: keep window open when `--show` is enabled

## Login Rules

- `cli login` currently supports Douyin (`-p dy`) in CLI workflow.
- If publish fails with login/session errors, run `cli login` first, then retry publish.
- On Linux headless/SSH, prefer `xvfb-run -a` for login display pipeline.

## Execution Policy For Agents

1. Always run `cli publish --help` once when flags are uncertain.
2. Quote paths that may contain spaces.
3. Prefer absolute file paths for `--file`.
4. After execution, inspect exit code:
   - `0`: success
   - `2`: argument error, fix arguments and rerun
   - `3`: task failure (often login/session/upload), recover then rerun
5. Return a concise result summary: command intent, key args, outcome, next action.

## Output Template

Use this response structure after command execution:

```markdown
执行结果：
- 命令：`cli publish ...`
- 参数：平台/账号/文件/标题
- 退出码：0|2|3
- 结论：成功 或 失败原因
- 下一步：是否需要先 `cli login` 或调整参数重试
```

## Additional Reference

- CLI overview: `docs/cli.md`
- Repository quick intro and OpenClaw marker: `README.md`
