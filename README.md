# loon

WeTalk QX / Loon universal script publish repo.

## Structure

- `plugins/WeTalk.lpx`: Loon plugin package
- `scripts/WeTalk_universal.js`: shared script for Loon and Quantumult X
- `examples/loon.conf`: manual Loon config example
- `examples/qx.conf`: manual Quantumult X config example

## How to use

### Loon

Preferred for newer TestFlight builds:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.lpx
```

Fallback for older/stable builds:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.plugin
```

Then:

1. Enable MITM
2. Install and trust the Loon certificate if not already done
3. Open WeTalk once to trigger `queryBalanceAndBonus`
4. Wait for the notification:
   - `✅ 新账号已入库`
   - or `🔄 账号参数已更新`
5. The scheduled task runs at `08:20` and `20:20`
6. Manual execution uses `WeTalk手动签到` and shows a result panel directly in Loon

### Quantumult X

Use this script URL:

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/WeTalk_universal.js
```

Example config is in `examples/qx.conf`.

## Direct URLs

### Loon plugin

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.lpx
```

### Loon legacy plugin

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.plugin
```

### Shared script

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/WeTalk_universal.js
```
