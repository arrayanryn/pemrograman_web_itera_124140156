import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import useLocalStorage from "../hooks/useLocalStorage";

/**
 * Context API: BookContext
 * State global seluruh aplikasi manajemen buku:
 * - daftar buku (persisten via useLocalStorage)
 * - operasi CRUD: tambah, edit, hapus
 * - state UI: filter status & kata kunci pencarian
 */

const BookContext = createContext(null);

const KUNCI_STORAGE = "koleksiBuku";

// Data awal saat pertama kali aplikasi dibuka (localStorage kosong)
const BUKU_AWAL = [
  { id: 1, judul: "Belajar React Modern", penulis: "Kent C. Dodds", status: "baca" },
  { id: 2, judul: "Clean Code", penulis: "Robert C. Martin", status: "milik" },
  { id: 3, judul: "You Don't Know JS", penulis: "Kyle Simpson", status: "beli" },
];

export function BookProvider({ children }) {
  // State utama: daftar buku, persisten ke localStorage via custom hook
  const [buku, setBuku] = useLocalStorage(KUNCI_STORAGE, BUKU_AWAL);

  // State UI: filter status & pencarian
  const [filterStatus, setFilterStatus] = useState("semua");
  const [kataKunci, setKataKunci] = useState("");

  /* ---------- OPERASI CRUD ---------- */

  /** Menambah buku baru dengan id unik (timestamp + acak). */
  const tambahBuku = (judul, penulis, status) => {
    const baru = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      judul,
      penulis,
      status,
    };
    // Spread operator: array baru (immutable update)
    setBuku([...buku, baru]);
  };

  /** Mengedit buku berdasarkan id (map immutable). */
  const editBuku = (id, dataBaru) => {
    setBuku(buku.map((b) => (b.id === id ? { ...b, ...dataBaru } : b)));
  };

  /** Menghapus buku berdasarkan id (filter immutable). */
  const hapusBuku = (id) => {
    setBuku(buku.filter((b) => b.id !== id));
  };

  /**
   * Daftar buku hasil filter status + pencarian judul/penulis.
   * useMemo agar tidak dihitung ulang tiap render tanpa perubahan.
   */
  const bukuTampil = useMemo(() => {
    const kunci = kataKunci.trim().toLowerCase();
    return buku.filter((b) => {
      const cocokStatus = filterStatus === "semua" || b.status === filterStatus;
      const cocokKunci =
        kunci === "" ||
        b.judul.toLowerCase().includes(kunci) ||
        b.penulis.toLowerCase().includes(kunci);
      return cocokStatus && cocokKunci;
    });
  }, [buku, filterStatus, kataKunci]);

  // Nilai context yang dibagikan ke seluruh komponen
  const nilai = {
    buku,
    bukuTampil,
    tambahBuku,
    editBuku,
    hapusBuku,
    filterStatus,
    setFilterStatus,
    kataKunci,
    setKataKunci,
  };

  return <BookContext.Provider value={nilai}>{children}</BookContext.Provider>;
}

// PropTypes untuk validasi props Provider
BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/** Hook akses context — melempar error jika dipakai di luar Provider. */
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks harus dipakai di dalam <BookProvider>");
  }
  return context;
}
