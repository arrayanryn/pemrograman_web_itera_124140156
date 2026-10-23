/* Screenshot halaman modul: klik Run Demo, tunggu 12 demo selesai (async),
   capture hasil. Jalankan server-modul.js dulu di proses lain. */
"use strict";

const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "screenshots");
const PORT = 8123;
const URL_APP = `http://127.0.0.1:${PORT}/index.html`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener("message", (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) this.events.push(msg);
    });
  }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => {
      ws.addEventListener("open", res, { once: true });
      ws.addEventListener("error", rej, { once: true });
    });
    return new CDP(ws);
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  close() { try { this.ws.close(); } catch (_) {} }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // Jalankan server statis + chrome dalam satu proses induk
  const server = spawn(process.execPath, [path.join(__dirname, "server-modul.js")], { stdio: "ignore" });
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=9335",
    "--user-data-dir=" + path.join(process.env.TEMP || ".", "cdp-modul"),
    "--no-first-run", "--no-default-browser-check", "--disable-gpu",
    "--window-size=1400,1000", "about:blank",
  ], { stdio: "ignore" });

  try {
    await sleep(800); // tunggu server siap

    let targets = null;
    for (let i = 0; i < 50; i++) {
      try {
        const list = await getJSON("http://127.0.0.1:9335/json/list");
        targets = list.filter((t) => t.type === "page");
        if (targets.length) break;
      } catch (_) {}
      await sleep(200);
    }
    if (!targets || !targets.length) throw new Error("Chrome target tidak ditemukan");

    const cdp = await CDP.connect(targets[0].webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1280, height: 1000, deviceScaleFactor: 2, mobile: false,
    });

    const evaljs = async (expr, awaitPromise = false) => {
      const r = await cdp.send("Runtime.evaluate", {
        expression: expr, returnByValue: true, awaitPromise,
      });
      if (r.exceptionDetails) throw new Error("Eval error: " + JSON.stringify(r.exceptionDetails.exception));
      return r.result.value;
    };

    await cdp.send("Page.navigate", { url: URL_APP });
    await sleep(1500); // tunggu module JS termuat (CDN tailwind juga)

    // Klik Run Demo
    await evaljs(`document.getElementById('runBtn').click()`);
    // Tunggu async demo selesai (promise/async outputs terisi)
    await evaljs(`
      (async () => {
        const t0 = Date.now();
        while (Date.now() - t0 < 15000) {
          const el = document.getElementById('promise-race');
          const el2 = document.getElementById('promise-basic');
          if (el && el2 && !el.textContent.includes('Memuat') && !el2.textContent.includes('Memuat')) break;
          await new Promise((r) => setTimeout(r, 300));
        }
      })()
    `, true);
    await sleep(500);

    // Sanity check
    const info = await evaljs(`({
      kartu: document.querySelectorAll('.output-item').length,
      promiseBasic: document.getElementById('promise-basic')?.textContent || "",
      asyncUser: (document.querySelector('.async-result')?.textContent || "").includes("User 42")
    })`);
    console.log("Cek modul:", JSON.stringify(info));

    // Capture full page (12 kartu bisa panjang)
    const metrics = await cdp.send("Page.getLayoutMetrics");
    const height = Math.min(Math.ceil(metrics.cssContentSize.height), 4000);
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1280, height, deviceScaleFactor: 1.5, mobile: false,
    });
    await sleep(400);
    const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    const file = path.join(OUT, "5-modul-run-demo.png");
    fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
    console.log("OK :", file);

    cdp.close();
  } finally {
    chrome.kill();
    server.kill();
  }
}

main().then(
  () => process.exit(0),
  (err) => { console.error("GAGAL:", err.message); process.exit(1); }
);
