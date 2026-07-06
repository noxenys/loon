// Ninebot sign-in script for Loon-compatible runtimes.
// Captures Authorization + deviceId from Ninebot traffic, then signs in by cron/manual run.

const SCRIPT_NAME = "九号出行 签到";
const STORE_KEY = "Ninebot.Accounts";
const API_BASE = "https://cn-cbu-gateway.ninebot.com";

const isLoon = typeof $persistentStore !== "undefined" && typeof $httpClient !== "undefined";
const isQX = typeof $prefs !== "undefined" && typeof $task !== "undefined";
const isRequest = typeof $request !== "undefined";

const AUTH_KEYS = [
  "authorization",
  "access_token",
  "access-token",
  "x-access-token",
  "token",
  "x-token",
  "user-token",
  "user_token"
];

const DEVICE_KEYS = [
  "device_id",
  "device-id",
  "deviceid",
  "deviceId",
  "x-device-id",
  "x_device_id"
];

function log(...items) {
  console.log(`[Ninebot] ${items.map(toText).join(" ")}`);
}

function toText(value) {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function done(value = {}) {
  if (typeof $done !== "undefined") $done(value);
}

function notify(subtitle, message = "") {
  if (typeof $notification !== "undefined") {
    $notification.post(SCRIPT_NAME, subtitle, message);
  } else if (typeof $notify !== "undefined") {
    $notify(SCRIPT_NAME, subtitle, message);
  }
  log(subtitle, message);
}

function readStore(key) {
  if (isLoon) return $persistentStore.read(key);
  if (isQX) return $prefs.valueForKey(key);
  return null;
}

function writeStore(key, value) {
  if (isLoon) return $persistentStore.write(value, key);
  if (isQX) return $prefs.setValueForKey(value, key);
  return false;
}

function parseAccounts(raw) {
  return String(raw || "")
    .split(";")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const index = item.indexOf(":");
      if (index < 0) return null;
      return {
        deviceId: item.slice(0, index),
        token: item.slice(index + 1)
      };
    })
    .filter(item => item && item.deviceId && item.token);
}

function serializeAccounts(accounts) {
  return accounts.map(item => `${item.deviceId}:${item.token}`).join(";");
}

function upsertAccount(deviceId, token) {
  const accounts = parseAccounts(readStore(STORE_KEY));
  const old = accounts.find(item => item.deviceId === deviceId);
  if (old) {
    if (old.token === token) return "same";
    old.token = token;
    writeStore(STORE_KEY, serializeAccounts(accounts));
    return "updated";
  }
  accounts.push({ deviceId, token });
  writeStore(STORE_KEY, serializeAccounts(accounts));
  return "created";
}

function normalizeHeaders(headers = {}) {
  const result = {};
  Object.keys(headers || {}).forEach(key => {
    result[key.toLowerCase()] = headers[key];
  });
  return result;
}

function firstHeader(headers, keys) {
  const normalized = normalizeHeaders(headers);
  for (const key of keys) {
    const value = normalized[key.toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function decodePart(value) {
  try {
    return decodeURIComponent(String(value).replace(/\+/g, " "));
  } catch {
    return String(value);
  }
}

function queryValue(text, keys) {
  const source = String(text || "");
  const query = source.includes("?") ? source.split("?")[1].split("#")[0] : source;
  const targets = keys.map(key => key.toLowerCase());
  for (const part of query.split("&")) {
    if (!part.includes("=")) continue;
    const index = part.indexOf("=");
    const key = decodePart(part.slice(0, index)).toLowerCase();
    if (targets.includes(key)) return decodePart(part.slice(index + 1)).trim();
  }
  return "";
}

function parseBody(body) {
  if (!body) return null;
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function findDeepValue(value, keys, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return "";
  const targets = keys.map(key => key.toLowerCase());
  for (const [key, child] of Object.entries(value)) {
    if (targets.includes(key.toLowerCase()) && child !== undefined && child !== null && String(child).trim()) {
      return String(child).trim();
    }
  }
  for (const child of Object.values(value)) {
    const found = findDeepValue(child, keys, depth + 1);
    if (found) return found;
  }
  return "";
}

function bodyValue(body, keys) {
  if (!body) return "";
  const parsed = parseBody(body);
  if (parsed) {
    const found = findDeepValue(parsed, keys);
    if (found) return found;
  }
  return queryValue(body, keys);
}

function isRelevantNinebotUrl(url) {
  return /ninebot\.com/i.test(url) && /(user-sign|sign|coin|ncoin|points|portal|account|user)/i.test(url);
}

function captureRequest() {
  const url = $request.url || "";
  const headers = $request.headers || {};
  const body = $request.body || "";
  const headerKeys = Object.keys(headers);

  log("capture hit:", url);
  log("header keys:", headerKeys.join(",") || "(none)");

  const token =
    firstHeader(headers, AUTH_KEYS) ||
    queryValue(url, AUTH_KEYS) ||
    bodyValue(body, AUTH_KEYS);

  const deviceId =
    firstHeader(headers, DEVICE_KEYS) ||
    queryValue(url, DEVICE_KEYS) ||
    bodyValue(body, DEVICE_KEYS);

  if (token && deviceId) {
    const result = upsertAccount(deviceId, token);
    if (result === "same") {
      notify("Token 已存在", `deviceId: ${deviceId}`);
    } else if (result === "updated") {
      notify("获取成功", `Token 已更新: ${deviceId}`);
    } else {
      notify("获取成功", `Token 已保存: ${deviceId}`);
    }
    done({});
    return;
  }

  if (isRelevantNinebotUrl(url)) {
    notify(
      "已命中但未保存",
      `Authorization:${token ? "有" : "无"} deviceId:${deviceId ? "有" : "无"}`
    );
  }

  done({});
}

function signHeaders(account) {
  return {
    Accept: "application/json, text/plain, */*",
    Authorization: account.token,
    "Content-Type": "application/json",
    device_id: account.deviceId,
    deviceId: account.deviceId,
    language: "zh",
    from_platform_1: "1",
    Origin: "https://h5-bj.ninebot.com",
    Referer: "https://h5-bj.ninebot.com/",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Segway v6"
  };
}

function request(options) {
  const method = String(options.method || "GET").toLowerCase();
  const cleanOptions = { ...options };
  delete cleanOptions.headers?.Host;
  delete cleanOptions.headers?.host;
  delete cleanOptions.headers?.["Content-Length"];
  delete cleanOptions.headers?.["content-length"];

  if (isLoon) {
    return new Promise((resolve, reject) => {
      $httpClient[method](cleanOptions, (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }
        const status = response.status || response.statusCode || 0;
        resolve({ status, ok: status >= 200 && status < 300, body: body || "" });
      });
    });
  }

  if (isQX) {
    return $task.fetch(cleanOptions).then(response => {
      const status = response.statusCode || response.status || 0;
      return { status, ok: status >= 200 && status < 300, body: response.body || "" };
    });
  }

  return Promise.reject(new Error("Unsupported runtime"));
}

async function apiJson(options) {
  const response = await request(options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  try {
    return JSON.parse(response.body || "{}");
  } catch {
    throw new Error(`Invalid JSON: ${String(response.body).slice(0, 120)}`);
  }
}

async function signOne(account) {
  const status = await apiJson({
    url: `${API_BASE}/portal/api/user-sign/v2/status?t=${Date.now()}`,
    method: "GET",
    timeout: 15000,
    headers: signHeaders(account)
  });

  if (status.code !== 0) return status.msg || "查询失败";

  const data = status.data || {};
  const days = data.consecutiveDays || 0;
  if (data.currentSignStatus === 1) return `已签 | 连签 ${days}天`;

  const signed = await apiJson({
    url: `${API_BASE}/portal/api/user-sign/v2/sign`,
    method: "POST",
    timeout: 15000,
    headers: signHeaders(account),
    body: JSON.stringify({ deviceId: account.deviceId })
  });

  if (signed.code !== 0) return signed.msg || "签到失败";

  const rewards = ((signed.data || {}).rewardList || [])
    .map(item => item.rewardValue ? `+${item.rewardValue}N币` : "")
    .filter(Boolean)
    .join(" ");

  const latest = await apiJson({
    url: `${API_BASE}/portal/api/user-sign/v2/status?t=${Date.now()}`,
    method: "GET",
    timeout: 15000,
    headers: signHeaders(account)
  });

  const latestDays = latest?.data?.consecutiveDays || days + 1;
  return `连签 ${latestDays}天${rewards ? ` | ${rewards}` : ""} | 成功`;
}

async function runSign() {
  const accounts = parseAccounts(readStore(STORE_KEY));
  if (!accounts.length) {
    notify("未配置账号", "请打开九号出行签到/N币页面抓取 Token");
    done({});
    return;
  }

  const results = [];
  for (const account of accounts) {
    try {
      results.push(await signOne(account));
    } catch (error) {
      log(account.deviceId, error && (error.stack || error.message || error));
      results.push(`${account.deviceId}: 失败`);
    }
  }

  notify("签到结果", results.join("\n"));
  done({});
}

if (isRequest) {
  captureRequest();
} else {
  runSign();
}
