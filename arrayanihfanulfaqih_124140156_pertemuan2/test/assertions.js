/* Assertions tes Pertemuan 2 (context sama dengan script.js) */
"use strict";

// Alias elemen DOM (script.js hanya mengekspos helper elemen())
const daftarTugas = elemen("daftarTugas");
const statistik = elemen("statistik");
const progresLabel = elemen("progresLabel");
const formTugas = elemen("formTugas");
const inputJudul = elemen("inputJudul");
const inputMatkul = elemen("inputMatkul");
const pesanError = elemen("pesanError");
const isiCuaca = elemen("isiCuaca");
const quoteTeks = elemen("quoteTeks");
const quoteAsal = elemen("quoteAsal");

let lulus = 0, gagal = 0;
const cek = (judul, kondisi) => {
  if (kondisi) { lulus++; console.log(`  PASS  ${judul}`); }
  else { gagal++; console.log(`  FAIL  ${judul}`); }
};
const berisi = (jejak, teks) => teks.includes(jejak);

console.log("== 1. SEED JSONPLACEHOLDER (async/await) ==");
cek("Seed ter-eksekusi dari API mock", app.tugas.length === 2);
cek("Seed tersimpan ke localStorage", localStorage.getItem("dashboardTugas") !== null);
cek("Item seed adalah instance TaskItem", app.tugas[0] instanceof TaskItem);
cek("Render daftar menghasilkan 2 baris", berisi("Kerjakan laporan praktikum", daftarTugas.innerHTML));

console.log("== 2. CLASS & CRUD ==");
app.tambahTugas("Kerjakan lab PAW", "PAW");
cek("tambahTugas menambah 1 item", app.tugas.length === 3);
cek("Tugas baru belum selesai", app.tugas[2].selesai === false);
cek("Render memuat tugas baru", berisi("Kerjakan lab PAW", daftarTugas.innerHTML));
cek("Template literal menampilkan matkul", berisi("📚 PAW", daftarTugas.innerHTML));

const idTarget = app.tugas[0].id;
app.toggleSelesai(idTarget);
cek("toggleSelesai mengubah status", app.tugas.find((t) => t.id === idTarget).selesai === true);

app.editTugas(idTarget, { judul: "Kerjakan laporan praktikum REVISI", matkul: "PAW" });
cek("editTugas mengubah judul", app.tugas.find((t) => t.id === idTarget).judul.includes("REVISI"));

const jumlahSebelumHapus = app.tugas.length;
app.hapusTugas(app.tugas[2].id);
cek("hapusTugas mengurangi jumlah", app.tugas.length === jumlahSebelumHapus - 1);

console.log("== 3. IMMUTABLE (spread, tidak mutasi objek lama) ==");
const lama = app.tugas[0];
const snapshotJudul = lama.judul;
const hasilToggle = lama.ubahStatus();
cek("Objek lama tidak berubah", lama.selesai === hasilToggle.selesai === false || lama.judul === snapshotJudul);
cek("Hasil toggle adalah objek BARU", hasilToggle !== lama);
cek("Hasil toggle statusnya berlawanan", hasilToggle.selesai === !lama.selesai);
cek("perbarui() juga immutable", lama.perbarui({ judul: "X", matkul: "Y" }) !== lama && lama.judul === snapshotJudul);

console.log("== 4. FILTER & PROGRES ==");
const totalTugas = app.tugas.length;
const jumlahSelesai = app.tugas.filter((t) => t.selesai).length;
app.renderTugas();
const persenDiharapkan = Math.round((jumlahSelesai / totalTugas) * 100);
cek("Label progres benar", progresLabel.textContent === `${persenDiharapkan}%`);
cek("Statistik menyebut jumlah selesai", berisi(`Selesai ${jumlahSelesai} dari ${totalTugas}`, statistik.textContent));

app.filterAktif = "selesai";
app.renderTugas();
cek("Filter 'selesai' hanya menampilkan tugas selesai", !berisi("Baca modul ES6+", daftarTugas.innerHTML) === (app.tugas.find((t) => t.judul === "Baca modul ES6+").selesai === false));
app.filterAktif = "semua";
app.renderTugas();

console.log("== 5. VALIDASI FORM ==");
inputJudul.value = ""; inputMatkul.value = "";
app.prosesTambah(formTugas);
cek("Judul kosong ditolak", pesanError.textContent === "Judul tugas wajib diisi!");

inputJudul.value = "ab";
app.prosesTambah(formTugas);
cek("Judul < 3 karakter ditolak", pesanError.textContent.includes("minimal 3 karakter"));

inputJudul.value = "Kerjakan kuis Basdat"; inputMatkul.value = "Basdat";
const jumlahSebelumTambah = app.tugas.length;
app.prosesTambah(formTugas);
cek("Input valid ditambahkan", app.tugas.length === jumlahSebelumTambah + 1);
cek("Error dibersihkan saat valid", pesanError.textContent === "");

console.log("== 6. LOCALSTORAGE PERSIST (JSON stringify/parse) ==");
const dataTersimpan = JSON.parse(localStorage.getItem("dashboardTugas"));
cek("Storage berisi array senilai tugas", Array.isArray(dataTersimpan) && dataTersimpan.length === app.tugas.length);
cek("Isi storage sesuai", dataTersimpan[0].judul === app.tugas[0].judul);

// Simulasi refresh: state dikosongkan lalu dimuat ulang
app.tugas = [];
const berhasilMuat = app.muatDariStorage();
cek("muatDariStorage memulihkan data", berhasilMuat === true && app.tugas.length === dataTersimpan.length);
cek("Hasil muat adalah instance TaskItem", app.tugas[0] instanceof TaskItem);

console.log("== 7. WIDGET ASINKRON (mock fetch) ==");
cek("Cuaca ter-render dari API", berisi("31.2°C", isiCuaca.innerHTML));
cek("Cuaca menampilkan angin", berisi("Angin 9.4 km/j", isiCuaca.innerHTML));
cek("Quote ter-render dari API", berisi("Belajar itu investasi", quoteTeks.textContent));
cek("Quote menampilkan author", berisi("Kakak Kelas", quoteAsal.textContent));

console.log("== 8. ARROW FUNCTIONS & TEMPLATE LITERALS ==");
cek("formatJam menghasilkan string", typeof formatJam(new Date()) === "string" && formatJam(new Date()).length >= 4);
cek("formatTanggal memuat nama hari", Number.isNaN(Number(formatTanggal(new Date()).charAt(0))) === true);
cek("ikonCuaca cerah", ikonCuaca(0) === "☀️");
cek("ikonCuaca hujan", ikonCuaca(95) === "⛈️");

console.log(`\nHASIL: ${lulus} lulus, ${gagal} gagal`);
if (gagal > 0) throw new Error("Ada tes yang gagal!");
