# loon

WeTalk QX / Loon universal script publish repo.

## Files

- `WeTalk_universal.js`: WeTalk dual-platform script for Quantumult X and Loon.
- `WeTalk.lpx`: Loon plugin package that imports the script and MITM settings.

## Raw URL

```text
https://raw.githubusercontent.com/noxenys/loon/main/WeTalk_universal.js
```

## Loon Plugin URL

```text
https://raw.githubusercontent.com/noxenys/loon/main/WeTalk.lpx
```

## Loon

```ini
[Script]
http-request ^https:\/\/api\.wetalkapp\.com\/app\/queryBalanceAndBonus script-path=https://raw.githubusercontent.com/noxenys/loon/main/WeTalk_universal.js,requires-body=false,timeout=60,tag=WeTalk抓包,enable=true
cron "20 8,20 * * *" script-path=https://raw.githubusercontent.com/noxenys/loon/main/WeTalk_universal.js,timeout=180,tag=WeTalk签到,enable=true

[MITM]
hostname = api.wetalkapp.com
```

## Quantumult X

```ini
[rewrite_local]
^https:\/\/api\.wetalkapp\.com\/app\/queryBalanceAndBonus url script-request-header https://raw.githubusercontent.com/noxenys/loon/main/WeTalk_universal.js

[task_local]
20 8,20 * * * https://raw.githubusercontent.com/noxenys/loon/main/WeTalk_universal.js, tag=WeTalk签到, enabled=true

[MITM]
hostname = api.wetalkapp.com
```
