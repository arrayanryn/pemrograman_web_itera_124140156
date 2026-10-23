/* ============================================================
   PERSONAL DASHBOARD — MAHASISWA ITERA
   Logika JavaScript ES6+ — Arrayan Ihfanul Faqih (124140156) — RA

   Fitur ES6+ yang dipakai (ringkasan):
   - Classes (TaskItem, DashboardApp)      -> baris 33, 87
   - Arrow functions (>= 3)                -> baris 27, 28, 29, dst.
   - Template literals (rendering dinamis) -> baris 76-79, 165-184, dst.
   - Destructuring (parameter & objek)     -> baris 27-29, 200, 232, dst.
   - Spread/Rest (immutable update)        -> baris 100, 110, 119, dst.
   - Async/Await + fetch API               -> baris 250, 264, 278
   - let/const, default parameters, dst.
   ============================================================ */

"use strict";

/* ================= KONSTANTA ================= */

const KUNCI_STORAGE = "dashboardTugas";
const URL_CUACA =
  "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true";
const URL_QUOTE = "https://dummyjson.com/quotes/random";
const URL_SEED = "https://jsonplaceholder.typicode.com/todos?_limit=4";

/* ================= ARROW FUNCTIONS UTIL ================= */

// Tiga arrow function util (memenuhi syarat minimal 3 arrow functions)
const formatJam = (tanggal) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(tanggal);

const formatTanggal = (tanggal) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(tanggal);

const ikonCuaca = (kode) => {
  if (kode === 0) return "☀️";
  if ([1, 2, 3].includes(kode)) return "⛅";
  if (kode >= 45 && kode <= 67) return "🌧️";
  if (kode >= 71 && kode <= 77) return "🌨️";
  if (kode >= 80) return "⛈️";
  return "🌡️";
};

const elemen = (id) => document.getElementById(id);

/* ================= CLASS: TaskItem ================= */

/**
 * Memodelkan satu item tugas kuliah.
 */
class TaskItem {
  /**
   * @param {string} judul  - judul tugas (wajib)
   * @param {string} matkul - mata kuliah (boleh kosong)
   * @param {boolean} selesai - status penyelesaian
   * @param {number|null} id - pengenal unik
   */
  constructor(judul, matkul = "", selesai = false, id = null) {
    this.id = id ?? Date.now() + Math.floor(Math.random() * 1000);
    this.judul = judul;
    this.matkul = matkul;
    this.selesai = selesai;
    this.dibuat = Date.now();
  }

  /** Mengubah judul & matkul (mengembalikan objek baru, immutable). */
  perbarui({ judul, matkul }) {
    return new TaskItem(judul, matkul, this.selesai, this.id);
  }

  /** Mengubah status selesai (mengembalikan objek baru, immutable). */
  ubahStatus() {
    return new TaskItem(this.judul, this.matkul, !this.selesai, this.id);
  }

  /** Menandai selesai (mengembalikan objek baru, immutable). */
  tandaiSelesai() {
    return new TaskItem(this.judul, this.matkul, true, this.id);
  }
}

/* ================= CLASS: DashboardApp ================= */

/**
 * Mengelola state tugas, localStorage, widget jam/cuaca/quote,
 * serta seluruh interaksi DOM.
 */
class DashboardApp {
  constructor() {
    this.tugas = []; // array of TaskItem
    this.filterAktif = "semua"; // semua | aktif | selesai
    this.idSedangEdit = null;

    // Referensi elemen DOM
    this.daftarEl = elemen("daftarTugas");
    this.statistikEl = elemen("statistik");
    this.progresIsiEl = elemen("progresIsi");
    this.progresLabelEl = elemen("progresLabel");
    this.filterEl = elemen("filter");
  }

  /* ---------- LOCALSTORAGE ---------- */

  /** Memuat tugas dari localStorage (JSON.parse). */
  muatDariStorage() {
    try {
      const data = localStorage.getItem(KUNCI_STORAGE);
      if (data) {
        const hasil = JSON.parse(data);
        if (Array.isArray(hasil)) {
          // Restrukturisasi tiap objek polos menjadi instance TaskItem
          this.tugas = hasil
            .filter(({ judul }) => typeof judul === "string")
            .map(({ id, judul, matkul, selesai }) =>
              new TaskItem(judul, matkul ?? "", Boolean(selesai), id)
            );
          return true;
        }
      }
    } catch (err) {
      console.error("Gagal memuat localStorage:", err);
    }
    return false;
  }

  /** Menyimpan tugas ke localStorage (JSON.stringify). */
  simpanKeStorage() {
    try {
      localStorage.setItem(KUNCI_STORAGE, JSON.stringify(this.tugas));
    } catch (err) {
      console.error("Gagal menyimpan localStorage:", err);
    }
  }

  /**
   * Seed awal: jika storage kosong, ambil contoh tugas dari
   * JSONPlaceholder (async/await). Aman jika offline (catch).
   */
  async seedJikaKosong() {
    if (this.tugas.length > 0) return;

    try {
      const respons = await fetch(URL_SEED);
      if (!respons.ok) throw new Error(`HTTP ${respons.status}`);

      const data = await respons.json();
      // Destructuring di parameter map
      this.tugas = data.map(({ id, title }) => new TaskItem(title, "Contoh", false, id));
      this.simpanKeStorage();
      this.renderTugas();
    } catch (err) {
      console.warn("Seed offline dilewati:", err.message);
    }
  }

  /* ---------- OPERASI CRUD (immutable dengan spread) ---------- */

  /** Menambah tugas baru. */
  tambahTugas(judul, matkul = "") {
    const item = new TaskItem(judul, matkul);
    // Spread operator: array baru, bukan push ke array lama (immutable)
    this.tugas = [...this.tugas, item];
    this.simpanKeStorage();
    this.renderTugas();
  }

  /** Memperbarui judul/matkul berdasarkan id. */
  editTugas(id, dataBaru) {
    // Spread + map immutable
    this.tugas = this.tugas.map((t) => (t.id === id ? t.perbarui(dataBaru) : t));
    this.simpanKeStorage();
    this.renderTugas();
  }

  /** Menghapus tugas berdasarkan id. */
  hapusTugas(id) {
    this.tugas = this.tugas.filter((t) => t.id !== id);
    this.simpanKeStorage();
    this.renderTugas();
  }

  /** Toggle status selesai berdasarkan id. */
  toggleSelesai(id) {
    this.tugas = this.tugas.map((t) => (t.id === id ? t.ubahStatus() : t));
    this.simpanKeStorage();
    this.renderTugas();
  }

  /* ---------- RENDER ---------- */

  /** Render daftar tugas sesuai filter aktif. */
  renderTugas() {
    const { filterAktif } = this;
    const tampil = this.tugas.filter((t) => {
      if (filterAktif === "aktif") return !t.selesai;
      if (filterAktif === "selesai") return t.selesai;
      return true;
    });

    this.daftarEl.innerHTML = tampil.length
      ? tampil.map((t) => this.templateItem(t)).join("")
      : `<li class="kosong">${
          this.tugas.length === 0
            ? "Belum ada tugas. Tambahkan tugas pertamamu! 🚀"
            : "Tidak ada tugas pada filter ini."
        }</li>`;

    this.renderProgres();
  }

  /**
   * Template literal untuk satu baris tugas (rendering dinamis).
   * @param {TaskItem} t
   */
  templateItem(t) {
    if (t.id === this.idSedangEdit) {
      return `
        <li class="item sedang-edit" data-id="${t.id}">
          <div class="edit-form">
            <input class="edit-judul" value="${t.judul.replaceAll('"', "&quot;")}" />
            <input class="edit-matkul" value="${t.matkul.replaceAll('"', "&quot;")}" placeholder="Mata kuliah" />
            <div class="edit-aksi">
              <button type="button" class="btn btn-kecil btn-primary" data-aksi="simpan">💾 Simpan</button>
              <button type="button" class="btn btn-kecil btn-abu" data-aksi="batal">Batal</button>
            </div>
          </div>
        </li>`;
    }

    return `
      <li class="item ${t.selesai ? "tercapai" : ""}" data-id="${t.id}">
        <input type="checkbox" ${t.selesai ? "checked" : ""} data-aksi="toggle" />
        <div class="info">
          <span class="judul">${t.judul}</span>
          ${t.matkul ? `<span class="matkul">📚 ${t.matkul}</span>` : ""}
        </div>
        <div class="aksi">
          <button type="button" class="btn btn-kecil btn-edit" data-aksi="edit">✏️ Edit</button>
          <button type="button" class="btn btn-kecil btn-danger" data-aksi="hapus">🗑️</button>
        </div>
      </li>`;
  }

  /** Render progress bar & statistik. */
  renderProgres() {
    const total = this.tugas.length;
    const selesai = this.tugas.filter((t) => t.selesai).length;
    const persen = total === 0 ? 0 : Math.round((selesai / total) * 100);

    this.progresIsiEl.style.width = `${persen}%`;
    this.progresLabelEl.textContent = `${persen}%`;
    this.statistikEl.textContent =
      total === 0
        ? ""
        : `Selesai ${selesai} dari ${total} tugas${persen === 100 ? " — semua beres! 🎉" : ""}`;
  }

  /* ---------- EVENT HANDLING ---------- */

  /** Memasang seluruh event listener aplikasi. */
  pasangEvent() {
    // Tambah tugas
    elemen("formTugas").addEventListener("submit", (event) => {
      event.preventDefault();
      this.prosesTambah(event.target);
    });

    // Klik pada daftar (event delegation: toggle/edit/hapus/simpan/batal)
    this.daftarEl.addEventListener("click", (event) => {
      const tombol = event.target.closest("[data-aksi]");
      if (!tombol) return;
      this.prosesAksiItem(tombol, tombol.closest(".item"));
    });

    // Enter pada input edit = simpan
    this.daftarEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const item = event.target.closest(".sedang-edit");
      if (item) this.prosesAksiItem({ dataset: { aksi: "simpan" } }, item);
    });

    // Filter
    this.filterEl.addEventListener("click", (event) => {
      const tombol = event.target.closest(".btn-filter");
      if (!tombol) return;
      this.filterAktif = tombol.dataset.filter;
      this.filterEl
        .querySelectorAll(".btn-filter")
        .forEach((b) => b.classList.toggle("aktif", b === tombol));
      this.renderTugas();
    });

    // Quote baru
    elemen("btnQuoteBaru").addEventListener("click", () => tampilkanQuote());
  }

  /** Validasi & tambah tugas dari form. */
  prosesTambah(form) {
    const inputJudul = form.querySelector("#inputJudul");
    const inputMatkul = form.querySelector("#inputMatkul");
    const pesanError = elemen("pesanError");
    const judul = inputJudul.value.trim();

    if (judul === "") {
      pesanError.textContent = "Judul tugas wajib diisi!";
      inputJudul.classList.add("input-error");
      return;
    }
    if (judul.length < 3) {
      pesanError.textContent = "Judul tugas minimal 3 karakter.";
      inputJudul.classList.add("input-error");
      return;
    }

    pesanError.textContent = "";
    inputJudul.classList.remove("input-error");
    this.tambahTugas(judul, inputMatkul.value.trim());
    form.reset();
    inputJudul.focus();
  }

  /** Menjalankan aksi tombol pada satu item (toggle/edit/hapus/simpan/batal). */
  prosesAksiItem(tombol, item) {
    if (!item) return;
    const id = Number(item.dataset.id);
    const { aksi } = tombol.dataset;

    if (aksi === "toggle") {
      this.toggleSelesai(id);
    } else if (aksi === "hapus") {
      this.hapusTugas(id);
    } else if (aksi === "edit") {
      this.idSedangEdit = id;
      this.renderTugas();
      const input = this.daftarEl.querySelector(".edit-judul");
      if (input) input.focus();
    } else if (aksi === "batal") {
      this.idSedangEdit = null;
      this.renderTugas();
    } else if (aksi === "simpan") {
      const judul = item.querySelector(".edit-judul").value.trim();
      const matkul = item.querySelector(".edit-matkul").value.trim();
      if (judul.length < 3) return; // validasi minimal sama seperti tambah
      this.idSedangEdit = null;
      this.editTugas(id, { judul, matkul });
    }
  }
}

/* ================= WIDGET ASINKRON: CUACA & QUOTE ================= */

/** Widget jam real-time (setiap detik). */
const mulaiJam = () => {
  const perbarui = () => {
    const sekarang = new Date();
    elemen("jam").textContent = formatJam(sekarang);
    elemen("tanggal").textContent = formatTanggal(sekarang);
  };
  perbarui();
  setInterval(perbarui, 1000);
};

/**
 * Mengambil data cuaca ITERA dari Open-Meteo (Async/Await).
 */
async function fetchCuaca() {
  const wadah = elemen("isiCuaca");
  try {
    const respons = await fetch(URL_CUACA);
    if (!respons.ok) throw new Error(`HTTP ${respons.status}`);

    const { current_weather: cuaca } = await respons.json(); // destructuring + rename
    const { temperature, windspeed, weathercode } = cuaca;

    // Template literal untuk render widget cuaca
    wadah.innerHTML = `
      <p class="cuaca-utama"><span>${ikonCuaca(weathercode)}</span>
        <span class="suhu">${temperature}°C</span></p>
      <p class="cuaca-label">Cuaca kampus ITERA, Lampung Selatan</p>
      <p class="cuaca-detail">💨 Angin ${windspeed} km/j · kode cuaca ${weathercode}</p>`;
  } catch (err) {
    console.error("Gagal memuat cuaca:", err);
    wadah.innerHTML = `<p class="cuaca-gagal">Cuaca gagal dimuat (offline?). Coba muat ulang halaman.</p>`;
  }
}

/**
 * Mengambil quote motivasi acak dari DummyJSON (Async/Await).
 */
async function fetchQuote() {
  const teksEl = elemen("quoteTeks");
  const asalEl = elemen("quoteAsal");
  try {
    const respons = await fetch(URL_QUOTE);
    if (!respons.ok) throw new Error(`HTTP ${respons.status}`);

    const { quote, author } = await respons.json(); // destructuring
    teksEl.textContent = `“${quote}”`;
    asalEl.textContent = `— ${author}`;
  } catch (err) {
    console.error("Gagal memuat quote:", err);
    teksEl.textContent = "Quote gagal dimuat (offline?).";
    asalEl.textContent = "";
  }
}

// Arrow function pembungkus agar mudah dipanggil ulang
const tampilkanQuote = () => fetchQuote();

/* ================= INISIALISASI ================= */

const app = new DashboardApp();

async function init() {
  // Pasang event & render data dari localStorage (jika ada)
  app.pasangEvent();
  const adaData = app.muatDariStorage();
  app.renderTugas();

  // Storage kosong -> coba seed contoh tugas dari JSONPlaceholder
  if (!adaData) await app.seedJikaKosong();

  // Widget asinkron & jam
  mulaiJam();
  await fetchCuaca();
  await tampilkanQuote();
}

init();
