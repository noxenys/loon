# loon

WeTalk QX / Loon universal script publish repo.

## Structure

- `plugins/WeTalk.lpx`: WeTalk Loon plugin package
- `plugins/Ninebot.lpx`: Ninebot Loon plugin package
- `scripts/WeTalk_universal.js`: WeTalk shared script for Loon and Quantumult X
- `scripts/Ninebot_universal.js`: Ninebot shared script for Loon-compatible runtimes
- `examples/loon.conf`: manual Loon config example
- `examples/qx.conf`: manual Quantumult X config example

## How to use

### Loon

#### WeTalk

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

#### Ninebot

Preferred for newer TestFlight builds:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/Ninebot.lpx
```

Fallback for older/stable builds:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/Ninebot.plugin
```

Then:

1. Enable MITM
2. Install and trust the Loon certificate if not already done
3. Open the Ninebot app sign-in/N coin page once to trigger `user-sign`
4. Wait for the notification:
   - `获取成功`
   - or `Token 已更新`
5. The scheduled task runs at `09:15`
6. Manual execution uses `九号出行手动签到`

### Quantumult X

Use this script URL:

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/WeTalk_universal.js
```

Example config is in `examples/qx.conf`.

## Direct URLs

### Loon plugin

WeTalk:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.lpx
```

Ninebot:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/Ninebot.lpx
```

### Loon legacy plugin

WeTalk:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/WeTalk.plugin
```

Ninebot:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/Ninebot.plugin
```

### Shared script

WeTalk:

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/WeTalk_universal.js
```

Ninebot:

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/Ninebot_universal.js
```
