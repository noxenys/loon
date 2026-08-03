# loon

WeTalk QX / Loon universal script publish repo.

## Structure

- `plugins/WeTalk.lpx`: WeTalk Loon plugin package
- `plugins/Ninebot.lpx`: Ninebot Loon plugin package
- `plugins/cnc07.lpx`: cnc07 VPN node extraction plugin package
- `boxjs/Ninebot.boxjs.json`: Ninebot BoxJS subscription
- `scripts/WeTalk_universal.js`: WeTalk shared script for Loon and Quantumult X
- `scripts/Ninebot_universal.js`: Ninebot shared script for Loon-compatible runtimes
- `scripts/cnc07_universal.js`: cnc07 node extraction script for Loon and Quantumult X
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

#### cnc07

Preferred for newer TestFlight builds:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/cnc07.lpx
```

Fallback for older/stable builds:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/cnc07.plugin
```

Then:

1. Enable MITM
2. Install and trust the Loon certificate if not already done
3. The scheduled task runs at `06:00` and `18:00`, pulling and decrypting cnc07 nodes
4. Manual execution uses `cnc07手动刷新`
5. Nodes appear in the `cnc07` policy group (or proxy subscription)

Or add the node subscription directly (Loon parses the Surge-format response):

```text
http://cnc07api.cnc07.com/api/cnc07iuapis
```

### BoxJS

Ninebot subscription:

```text
https://raw.githubusercontent.com/noxenys/loon/main/boxjs/Ninebot.boxjs.json
```

The editable storage key is `Ninebot.Accounts`. The value format is:

```text
deviceId:Authorization
```

Multiple accounts are separated by semicolons.

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

cnc07:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/cnc07.lpx
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

cnc07:

```text
https://raw.githubusercontent.com/noxenys/loon/main/plugins/cnc07.plugin
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

cnc07:

```text
https://raw.githubusercontent.com/noxenys/loon/main/scripts/cnc07_universal.js
```

### BoxJS subscription

Ninebot:

```text
https://raw.githubusercontent.com/noxenys/loon/main/boxjs/Ninebot.boxjs.json
```
