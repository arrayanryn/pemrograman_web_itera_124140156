import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BookProvider, useBooks } from "../context/BookContext";
import BookForm from "../components/BookForm/BookForm";
import BookList from "../components/BookList/BookList";
import BookFilter from "../components/BookFilter/BookFilter";
import Stats from "../pages/Stats/Stats";
import App from "../App";

/**
 * Unit test aplikasi Manajemen Buku (Vitest + React Testing Library).
 * Mencakup: validasi form, tambah buku, edit & hapus, filter status,
 * pencarian, dan custom hook useBookStats.
 */

// Helper: render komponen dalam Provider + Router (karena memakai useBooks/Link)
const renderDenganProvider = (ui) =>
  render(
    <BookProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </BookProvider>
  );

// ============================================================
// Test 1: Validasi form — submit dengan input kosong
// ============================================================
test("Test 1: menampilkan pesan error jika judul/penulis kosong", () => {
  renderDenganProvider(<BookForm />);

  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  // Feedback visual: pesan error wajib isi muncul
  expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
  expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument();

  // Tidak ada item baru yang muncul
  expect(screen.queryByTestId("book-list")).not.toBeInTheDocument();
});

// ============================================================
// Test 2: Menambah buku baru lewat form
// ============================================================
test("Test 2: menambah buku baru muncul di daftar", () => {
  renderDenganProvider(
    <>
      <BookForm />
      <BookList />
    </>
  );

  fireEvent.change(screen.getByLabelText(/judul buku/i), {
    target: { value: "React Testing Handbook" },
  });
  fireEvent.change(screen.getByLabelText(/penulis/i), {
    target: { value: "Kent C. Dodds" },
  });
  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  // Buku tampil di daftar dengan status awal "Milik"
  const item = screen.getByText(/react testing handbook/i).closest("li");
  expect(within(item).getByText(/kent c. dodds/i)).toBeInTheDocument();
  expect(within(item).getByText(/milik/i)).toBeInTheDocument();

  // Form direset setelah submit
  expect(screen.getByLabelText(/judul buku/i)).toHaveValue("");
});

// ============================================================
// Test 3: Filter berdasarkan status
// ============================================================
test("Test 3: filter status menyembunyikan buku dengan status lain", () => {
  renderDenganProvider(
    <>
      <BookForm />
      <BookFilter />
      <BookList />
    </>
  );

  // Tambah 2 buku dengan status berbeda
  fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: "Buku Milik" } });
  fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: "Penulis A" } });
  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: "Buku Beli" } });
  fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: "Penulis B" } });
  fireEvent.click(screen.getByRole("radio", { name: /ingin dibeli/i }));
  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  // Kedua buku tampil saat filter "Semua"
  expect(screen.getByText(/buku milik/i)).toBeInTheDocument();
  expect(screen.getByText(/buku beli/i)).toBeInTheDocument();

  // Klik filter "Beli" → hanya buku beli yang tampil (cari di dalam group filter)
  const grupFilter = screen.getByRole("group", { name: /filter status buku/i });
  fireEvent.click(within(grupFilter).getByRole("button", { name: /beli/i }));
  expect(screen.getByText(/buku beli/i)).toBeInTheDocument();
  expect(screen.queryByText(/buku milik/i)).not.toBeInTheDocument();
});

// ============================================================
// Test 4: Pencarian berdasarkan judul atau penulis
// ============================================================
test("Test 4: pencarian menyaring buku berdasarkan judul/penulis", () => {
  renderDenganProvider(
    <>
      <BookForm />
      <BookFilter />
      <BookList />
    </>
  );

  fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: "Dunia Shards" } });
  fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: "Brandon Sanderson" } });
  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: "Atomic Habits" } });
  fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: "James Clear" } });
  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  // Cari berdasarkan sebagian judul
  fireEvent.change(screen.getByPlaceholderText(/cari judul atau penulis/i), {
    target: { value: "dunia" },
  });
  expect(screen.getByText(/dunia shards/i)).toBeInTheDocument();
  expect(screen.queryByText(/atomic habits/i)).not.toBeInTheDocument();

  // Cari berdasarkan nama penulis
  fireEvent.change(screen.getByPlaceholderText(/cari judul atau penulis/i), {
    target: { value: "james" },
  });
  expect(screen.getByText(/atomic habits/i)).toBeInTheDocument();
  expect(screen.queryByText(/dunia shards/i)).not.toBeInTheDocument();
});

// ============================================================
// Test 5: Edit dan hapus buku
// ============================================================
test("Test 5: mengedit lalu menghapus buku dari daftar", () => {
  renderDenganProvider(
    <>
      <BookForm />
      <BookList />
    </>
  );

  // Tambah buku
  fireEvent.change(screen.getByLabelText(/judul buku/i), { target: { value: "Judul Awal" } });
  fireEvent.change(screen.getByLabelText(/penulis/i), { target: { value: "Penulis Awal" } });
  fireEvent.click(screen.getByRole("button", { name: /tambah ke koleksi/i }));

  // Edit buku
  fireEvent.click(screen.getByRole("button", { name: /edit judul awal/i }));
  const inputEdit = screen.getByLabelText(/edit judul/i);
  fireEvent.change(inputEdit, { target: { value: "Judul Revisi" } });
  fireEvent.click(screen.getByRole("button", { name: /simpan/i }));

  expect(screen.getByText(/judul revisi/i)).toBeInTheDocument();
  expect(screen.queryByText(/judul awal/i)).not.toBeInTheDocument();

  // Hapus buku
  fireEvent.click(screen.getByRole("button", { name: /hapus judul revisi/i }));
  expect(screen.queryByText(/judul revisi/i)).not.toBeInTheDocument();
  // Daftar jadi kosong (data awal seed 3 buku - 1 dihapus, tapi localStorage test bersih)
});

// ============================================================
// Test 6: useBookStats menghitung statistik dengan benar
// ============================================================
test("Test 6: halaman statistik menampilkan jumlah per status", () => {
  // Stats memakai useBooks (butuh Provider) — tanpa Router karena tidak ada Link di dalamnya
  render(
    <BookProvider>
      <Stats />
    </BookProvider>
  );

  // Data awal seed BookContext: 1 milik, 1 baca, 1 beli → total 3
  expect(screen.getByText("3")).toBeInTheDocument(); // total
  // Kartu statistik tampil (label bisa muncul 2x: kartu & keterangan → getAllByText)
  expect(screen.getAllByText(/total koleksi/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/dimiliki/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/sedang dibaca/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/ingin dibeli/i).length).toBeGreaterThan(0);
  // Nilai per status: milik=1, baca=1, beli=1 (angka "1" muncul 3x → getAllByText)
  expect(screen.getAllByText("1")).toHaveLength(3);
});

// ============================================================
// Test 7: Navigasi React Router antar halaman
// ============================================================
test("Test 7: navigasi dari Daftar Buku ke Statistik via React Router", () => {
  render(<App />);

  // Awalnya di halaman utama (form terlihat)
  expect(screen.getByText(/tambah buku baru/i)).toBeInTheDocument();

  // Klik link Statistik
  fireEvent.click(screen.getByRole("link", { name: /statistik/i }));

  // Halaman statistik tampil
  expect(screen.getByText(/total koleksi/i)).toBeInTheDocument();
  expect(screen.queryByText(/tambah buku baru/i)).not.toBeInTheDocument();
});
