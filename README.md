# loon

WeTalk QX / Loon universal script publish repo.

## Structure

- `plugins/WeTalk.lpx`: Loon plugin package
- `scripts/WeTalk_universal.js`: shared script for Loon and Quantumult X
- `examples/loon.conf`: manual Loon config example
- `examples/qx.conf`: manual Quantumult X config example

## How to use

### Loon

Import this plugin URL in Loon:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.lpx
```

Then:

1. Enable MITM
2. Install and trust the Loon certificate if not already done
3. Open WeTalk once to trigger `queryBalanceAndBonus`
4. Wait for the notification:
   - `✅ 新账号已入库`
   - or `🔄 账号参数已更新`
5. The scheduled task runs at `08:20` and `20:20`

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

### Shared script

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/WeTalk_universal.js
```
