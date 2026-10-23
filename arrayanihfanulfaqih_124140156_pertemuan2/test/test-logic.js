/* Harness tes Pertemuan 2: jalankan script.js dalam satu context vm.
   Mock: DOM, localStorage, fetch, setInterval. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buatElemen(id) {
  const el = {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    style: {},
    dataset: {},
    children: [],
    checked: false,
    classList: {
      _set: new Set(),
      add(...c) { c.forEach((x) => this._set.add(x)); },
      remove(...c) { c.forEach((x) => this._set.delete(x)); },
      toggle(c, force) {
        const aktif = force === undefined ? !this._set.has(c) : force;
        aktif ? this._set.add(c) : this._set.delete(c);
      },
      contains(c) { return this._set.has(c); },
    },
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    focus() {},
    reset() {},
    closest() { return null; },
    querySelector(sel) {
      if (sel === "#inputJudul") return elements["inputJudul"];
      if (sel === "#inputMatkul") return elements["inputMatkul"];
      if (sel === ".edit-judul") return elements["_editJudul"];
      if (sel === ".edit-matkul") return elements["_editMatkul"];
      return null;
    },
    querySelectorAll(sel) {
      if (sel === ".btn-filter") return elements["_tombolFilter"];
      if (sel === ".edit-judul") return [elements["_editJudul"]];
      if (sel === ".edit-matkul") return [elements["_editMatkul"]];
      return [];
    },
  };
  return el;
}

const ids = [
  "daftarTugas", "statistik", "progresIsi", "progresLabel", "filter",
  "formTugas", "inputJudul", "inputMatkul", "pesanError",
  "jam", "tanggal", "isiCuaca", "quoteTeks", "quoteAsal", "btnQuoteBaru",
];

const store = new Map();
const localStorageSim = {
  getItem: (k) => (store.has(k) && store.get(k) !== undefined ? store.get(k) : null),
  setItem: (k, v) => store.set(k, v),
  removeItem: (k) => store.delete(k),
};

const elements = {};
for (const id of ids) elements[id] = buatElemen(id);

// Elemen bantu (bukan id nyata)
elements["_editJudul"] = buatElemen("_editJudul");
elements["_editMatkul"] = buatElemen("_editMatkul");
elements["_tombolFilter"] = ["semua", "aktif", "selesai"].map((f) => {
  const b = buatElemen(`filter-${f}`);
  b.dataset.filter = f;
  return b;
});

// Mock fetch sesuai URL yang dipakai script.js
const fetchSim = async (url) => {
  if (url.includes("jsonplaceholder.typicode.com")) {
    return {
      ok: true,
      json: async () => [
        { id: 1, title: "Kerjakan laporan praktikum", completed: false },
        { id: 2, title: "Baca modul ES6+", completed: true },
      ],
    };
  }
  if (url.includes("open-meteo.com")) {
    return {
      ok: true,
      json: async () => ({ current_weather: { temperature: 31.2, windspeed: 9.4, weathercode: 2 } }),
    };
  }
  if (url.includes("dummyjson.com")) {
    return { ok: true, json: async () => ({ quote: "Belajar itu investasi", author: "Kakak Kelas" }) };
  }
  throw new Error("URL tidak dikenal: " + url);
};

const sandbox = {
  console,
  process,
  localStorage: localStorageSim,
  fetch: fetchSim,
  document: { getElementById: (id) => elements[id] || null },
  Intl,
  Date,
  Math,
  JSON,
  Number,
  Boolean,
  Array,
  Object,
  String,
  setInterval: () => 0, // jam real-time dinonaktifkan saat tes
  setTimeout,
  Promise,
};
vm.createContext(sandbox);

const kodeScript = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const kodeTes = fs.readFileSync(path.join(__dirname, "assertions.js"), "utf8");

async function main() {
  vm.runInContext(kodeScript, sandbox, { filename: "script.js" });
  await sleep(80); // beri waktu async init() selesai (fetch mock = microtask)
  vm.runInContext(kodeTes, sandbox, { filename: "assertions.js" });
}

main().catch((err) => {
  console.error("HARNESS GAGAL:", err);
  process.exit(1);
});
