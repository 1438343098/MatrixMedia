# Examples

## Example 1: Minimal publish

User intent: 发布抖音视频，已登录。

```bash
matrixmedia cli publish \
  -p dy \
  --phone 13800138000 \
  -f "/Users/me/videos/demo.mp4" \
  -t "测试标题"
```

## Example 2: Login then publish

User intent: 首次登录后发布。

```bash
matrixmedia cli login -p dy --phone 13800138000

matrixmedia cli publish \
  -p dy \
  --phone 13800138000 \
  -f "/Users/me/videos/demo.mp4" \
  -t "矩媒CLI发布演示" \
  --name "CLI演示任务" \
  --tags "开源,CLI,自动化"
```

## Example 3: Show window for debugging

```bash
matrixmedia cli publish \
  -p dy \
  --phone 13800138000 \
  -f "/Users/me/videos/demo.mp4" \
  -t "调试模式" \
  --show \
  --no-close-window
```
