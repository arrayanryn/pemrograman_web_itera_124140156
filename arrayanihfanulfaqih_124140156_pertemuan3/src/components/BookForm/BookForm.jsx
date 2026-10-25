import { useState } from "react";
import PropTypes from "prop-types";
import { useBooks } from "../../context/BookContext";
import "./BookForm.css";

/**
 * BookForm — komponen form tambah buku.
 * Validasi: judul & penulis wajib diisi (feedback visual merah jika kosong).
 * Status buku: milik / baca / beli (radio button bergaya chip).
 */
export default function BookForm() {
  const { tambahBuku } = useBooks();

  // State form (controlled components)
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [status, setStatus] = useState("milik");

  // State error validasi per field
  const [errorJudul, setErrorJudul] = useState("");
  const [errorPenulis, setErrorPenulis] = useState("");

  /** Validasi kolom wajib + submit buku baru. */
  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;

    // Validasi judul wajib isi
    if (judul.trim() === "") {
      setErrorJudul("Judul buku wajib diisi!");
      valid = false;
    } else {
      setErrorJudul("");
    }

    // Validasi penulis wajib isi
    if (penulis.trim() === "") {
      setErrorPenulis("Nama penulis wajib diisi!");
      valid = false;
    } else {
      setErrorPenulis("");
    }

    if (!valid) return; // batalkan submit jika ada error

    tambahBuku(judul.trim(), penulis.trim(), status);

    // Reset form setelah sukses
    setJudul("");
    setPenulis("");
    setStatus("milik");
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">➕ Tambah Buku Baru</h2>

      <div className="form-group">
        <label htmlFor="inputJudul">Judul Buku *</label>
        <input
          id="inputJudul"
          type="text"
          placeholder="Contoh: Belajar React Modern"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className={errorJudul ? "input-error" : ""}
        />
        {errorJudul && <small className="pesan-error">{errorJudul}</small>}
      </div>

      <div className="form-group">
        <label htmlFor="inputPenulis">Penulis *</label>
        <input
          id="inputPenulis"
          type="text"
          placeholder="Contoh: Kent C. Dodds"
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
          className={errorPenulis ? "input-error" : ""}
        />
        {errorPenulis && <small className="pesan-error">{errorPenulis}</small>}
      </div>

      <div className="form-group">
        <span className="label-status">Status Buku</span>
        <div className="status-chips" role="radiogroup" aria-label="Status buku">
          <label className={status === "milik" ? "chip aktif" : "chip"}>
            <input
              type="radio"
              name="status"
              value="milik"
              checked={status === "milik"}
              onChange={(e) => setStatus(e.target.value)}
            />
            📚 Milik
          </label>
          <label className={status === "baca" ? "chip aktif" : "chip"}>
            <input
              type="radio"
              name="status"
              value="baca"
              checked={status === "baca"}
              onChange={(e) => setStatus(e.target.value)}
            />
            📖 Sedang Dibaca
          </label>
          <label className={status === "beli" ? "chip aktif" : "chip"}>
            <input
              type="radio"
              name="status"
              value="beli"
              checked={status === "beli"}
              onChange={(e) => setStatus(e.target.value)}
            />
            🛒 Ingin Dibeli
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Tambah ke Koleksi
      </button>
    </form>
  );
}
