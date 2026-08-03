// 2026/08/04 Universal version for Quantumult X and Loon
// cnc07 节点提取 — 从 cnc07api.cnc07.com 拉取 AES 加密的节点列表，解密后输出 SS 节点
/*
QX:
[rewrite_local]
^https?://cnc07api\.cnc07\.com/api/(cnc07iuapis|cnc07apijm)$ url script-response-body https://raw.githubusercontent.com/noxenys/loon/main/scripts/cnc07_universal.js

[task_local]
0 6,18 * * * https://raw.githubusercontent.com/noxenys/loon/main/scripts/cnc07_universal.js, tag=cnc07节点刷新, enabled=true

[mitm]
hostname = cnc07api.cnc07.com

Loon:
[Script]
http-response ^https?://cnc07api\.cnc07\.com/api/(cnc07iuapis|cnc07apijm)$ script-path=https://raw.githubusercontent.com/noxenys/loon/main/scripts/cnc07_universal.js,requires-body=true,timeout=60,tag=cnc07解密,enable=true
cron "0 6,18 * * *" script-path=https://raw.githubusercontent.com/noxenys/loon/main/scripts/cnc07_universal.js,timeout=60,tag=cnc07节点刷新,enable=true

[MITM]
hostname = cnc07api.cnc07.com
*/

const SCRIPT_NAME = "cnc07 节点";
const API_URL = "http://cnc07api.cnc07.com/api/cnc07iuapis";
const AES_KEY = "1kv10h7t*C3f8c@$";   // 16 bytes
const AES_IV  = "@$6l&bxb5n35c2w9";   // 16 bytes (原帖末尾 o 是 typo)

const isLoon = typeof $persistentStore !== "undefined" && typeof $httpClient !== "undefined";
const isQX = typeof $prefs !== "undefined" && typeof $task !== "undefined";
const isRequest = typeof $request !== "undefined";
const isResponse = typeof $response !== "undefined" && $response;

function log(...items) { console.log(`[cnc07] ${items.map(toText).join(" ")}`); }
function toText(value) {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "object") { try { return JSON.stringify(value); } catch { return String(value); } }
  return String(value);
}
function done(value = {}) { if (typeof $done !== "undefined") $done(value); }

function notify(subtitle, message = "") {
  if (typeof $notification !== "undefined") $notification.post(SCRIPT_NAME, subtitle, message);
  else if (typeof $notify !== "undefined") $notify(SCRIPT_NAME, subtitle, message);
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

function httpGet(opts) {
  return new Promise((resolve, reject) => {
    if (isLoon) {
      $httpClient.get({ url: opts.url, headers: opts.headers || {}, timeout: opts.timeout || 15000 }, (error, response, data) => {
        if (error) return reject(error);
        resolve({ statusCode: (response && (response.status || response.statusCode)) || 0, headers: response && response.headers || {}, body: typeof data === "string" ? data : "" });
      });
    } else if (isQX) {
      $task.fetch({ url: opts.url, method: "GET", headers: opts.headers || {} }).then(
        (resp) => resolve({ statusCode: resp.statusCode || 0, headers: resp.headers || {}, body: resp.body || "" }),
        (err) => reject(err)
      );
    } else {
      reject(new Error("Unsupported platform"));
    }
  });
}

// CryptoJS 兼容加载（Loon 内置 CryptoJS；QX 需资源解析器或内置）
const Crypto = (typeof CryptoJS !== "undefined") ? CryptoJS : null;

function decryptServers(encrypted) {
  if (!Crypto) { notify("解密失败", "CryptoJS 不可用"); return null; }
  try {
    const key = Crypto.enc.Utf8.parse(AES_KEY);
    const iv  = Crypto.enc.Utf8.parse(AES_IV);
    const decrypted = Crypto.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: Crypto.mode.CBC,
      padding: Crypto.pad.Pkcs7
    });
    return decrypted.toString(Crypto.enc.Utf8);
  } catch (e) {
    notify("解密失败", (e && e.message) || String(e));
    return null;
  }
}

function extractSSNodes(plaintext) {
  // 从解密后的文本里提取 SS = ss,host,port,encrypt-method=...,password=...
  const ssRe = /SS\s*=\s*ss\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*encrypt-method=([^,\s]+)\s*,\s*password=([^\s,\n\\]+)/g;
  const cityRe = /"city_cn":"([^"]*)"/;
  const chunks = String(plaintext || "").split('{"iscode"');
  const nodes = [];
  for (let i = 1; i < chunks.length; i++) {
    const m = ssRe.exec(chunks[i]);
    if (!m) continue;
    const host = m[1], port = m[2], method = m[3], pwd = m[4];
    const cm = cityRe.exec(chunks[i]);
    const city = cm ? cm[1] : "node" + i;
    const userinfo = btoa(method + ":" + pwd).replace(/=/g, "");
    const name = encodeURIComponent("cnc07-" + city + "-" + i);
    nodes.push("ss://" + userinfo + "@" + host + ":" + port + "#" + name);
  }
  return nodes;
}

function processServers(encrypted) {
  const plaintext = decryptServers(encrypted);
  if (!plaintext) return null;
  const nodes = extractSSNodes(plaintext);
  if (nodes.length === 0) { notify("提取失败", "未找到 SS 节点"); return null; }
  return nodes.join("\n");
}

if (isResponse) {
  // MITM 响应拦截路径：解密 servers 字段，输出订阅格式
  try {
    const json = JSON.parse($response.body);
    if (!json.servers) { notify("无节点数据", "servers 字段为空"); done({}); return; }
    const body = processServers(json.servers);
    if (!body) { done({}); return; }
    notify("✅ 提取成功", "共 " + (body.split("\n").length) + " 条 SS 节点");
    if (isLoon) done({ body: body, headers: { "Content-Type": "text/plain" } });
    else done({ body: body });
  } catch (e) {
    notify("处理失败", (e && e.message) || String(e));
    done({});
  }
  return;
}

// 主动拉取路径（cron/manual）
httpGet({ url: API_URL }).then((resp) => {
  if (resp.statusCode !== 200) { notify("请求失败", "HTTP " + resp.statusCode); done({}); return; }
  let json;
  try { json = JSON.parse(resp.body); } catch (e) { notify("解析失败", "非 JSON 响应"); done({}); return; }
  if (!json.servers) { notify("无节点数据", "servers 字段为空"); done({}); return; }
  const body = processServers(json.servers);
  if (!body) { done({}); return; }
  // 存入持久化，供 Loon policy-path 订阅引用
  writeStore("cnc07_nodes", body);
  notify("✅ 提取成功", "共 " + (body.split("\n").length) + " 条 SS 节点，已更新订阅");
  done({});
}).catch((err) => {
  notify("请求失败", (err && err.message) || String(err));
  done({});
});