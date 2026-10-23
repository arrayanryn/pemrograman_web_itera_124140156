# 📚 Folder Modul — Praktikum Pertemuan 2 (JavaScript Next Gen / ES6+)

Folder ini berisi **file latihan yang dikerjakan selama mengikuti materi praktikum** Pertemuan 2, berupa project demo interaktif **`project-js-nextgen`** sesuai modul "Setup Project".

## 👤 Identitas

| | |
|---|---|
| **Nama** | Arrayan Ihfanul Faqih |
| **NIM** | 124140156 |
| **Kelas** | RA |

## ▶️ Cara Menjalankan

1. Buka folder `modul/` ini di **VS Code**.
2. Install ekstensi **Live Server** (jika belum ada).
3. Klik kanan `index.html` → **Open with Live Server**.

> ⚠️ **Wajib Live Server** (jangan double-click file): project memakai `<script type="module">`, dan browser memblokir `import` ES modules pada protokol `file://` (batasan CORS). Butuh koneksi internet untuk CDN Tailwind.

4. Klik tombol **Run Demo** → 12 kartu hasil demo muncul; **Clear Output** untuk membersihkan.

## 📁 Struktur

```
modul/
├── index.html          # Halaman utama + tombol Run/Clear Demo
├── css/style.css       # Styling kustom pendamping Tailwind
└── js/
    ├── main.js         # Entry point: addOutput(), runAllDemos(), event tombol
    ├── app.js          # 12 fungsi demo ES6+ (export)
    └── modules/
        ├── data.js     # Data contoh (sampleUsers, sampleProducts)
        └── utils.js    # Helper (formatRupiah, capitalize)
```

## 🧪 Daftar 12 Demo yang Diimplementasikan

| # | Demo | Materi ES6+ |
|---|---|---|
| 1 | `demoVariables` | `var` vs `let` vs `const`, block scope, mutable content objek const |
| 2 | `demoArrowFunctions` | Fungsi reguler vs arrow, implicit return, aturan kurung parameter |
| 3 | `demoTemplateLiterals` | Interpolasi `${}`, multi-line, ekspresi di dalam string |
| 4 | `demoDestructuring` | Object/array destructuring, rename, default, nested, skip, rest, swap |
| 5 | `demoSpreadRest` | Spread array/objek (copy, merge, override), rest parameter |
| 6 | `demoDefaultParams` | Default parameter, ekspresi, referensi parameter sebelumnya |
| 7 | `demoClasses` | `class`, `constructor`, method, `extends`, `super`, override, `instanceof` |
| 8 | `demoObjectLiterals` | Property/method shorthand, computed property names |
| 9 | `demoArrayMethods` | `map`, `filter`, `find`, `some`, `every`, `reduce`, method chaining |
| 10 | `demoAdvancedArrays` | `Array.from`, `Array.of`, `flat`, `flatMap`, `includes` |
| 11 | `demoPromises` | `new Promise`, `.then/.catch`, chaining, `Promise.all`, `Promise.race` |
| 12 | `demoAsyncAwait` | `async/await`, `try/catch`, eksekusi paralel `Promise.all` |

## ✅ Checklist Latihan dari Modul

- [x] Menjalankan project dengan Live Server (ES modules)
- [x] Membandingkan `var` di dalam/luar block & error re-assign `const`
- [x] Membuat arrow function dengan berbagai sintaks
- [x] Template literals untuk HTML string
- [x] Destructuring nested properties & rest parameters
- [x] Merge objek dengan spread + override properti
- [x] Class dengan inheritance (`User` → `Admin`)
- [x] Computed property names
- [x] Higher-order functions (map/filter/reduce/chaining)
- [x] Promise (dasar, chain, all, race) & async/await (try/catch, paralel)
