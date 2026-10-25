import { useState } from "react";
import PropTypes from "prop-types";
import { useBooks } from "../../context/BookContext";
import "./BookList.css";

/**
 * BookItem — satu baris buku pada daftar.
 * Komponen reusable: menampilkan info buku + aksi edit inline / hapus.
 * Mode edit: judul & penulis jadi input, status jadi dropdown.
 */
function BookItem({ buku }) {
  const { editBuku, hapusBuku } = useBooks();

  const [sedangEdit, setSedangEdit] = useState(false);
  const [judul, setJudul] = useState(buku.judul);
  const [penulis, setPenulis] = useState(buku.penulis);
  const [status, setStatus] = useState(buku.status);

  /** Simpan hasil edit (validasi: judul & penulis tidak boleh kosong). */
  const simpanEdit = () => {
    if (judul.trim() === "" || penulis.trim() === "") return; // validasi sederhana
    editBuku(buku.id, { judul: judul.trim(), penulis: penulis.trim(), status });
    setSedangEdit(false);
  };

  // Mode edit inline
  if (sedangEdit) {
    return (
      <li className="book-item sedang-edit" data-testid={`book-item-${buku.id}`}>
        <div className="edit-form">
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="edit-input"
            aria-label="Edit judul"
          />
          <input
            type="text"
            value={penulis}
            onChange={(e) => setPenulis(e.target.value)}
            className="edit-input"
            aria-label="Edit penulis"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="edit-select"
            aria-label="Edit status"
          >
            <option value="milik">📚 Milik</option>
            <option value="baca">📖 Sedang Dibaca</option>
            <option value="beli">🛒 Ingin Dibeli</option>
          </select>
          <div className="edit-aksi">
            <button type="button" className="btn btn-kecil btn-primary" onClick={simpanEdit}>
              💾 Simpan
            </button>
            <button
              type="button"
              className="btn btn-kecil btn-abu"
              onClick={() => {
                // batalkan: kembalikan nilai awal
                setJudul(buku.judul);
                setPenulis(buku.penulis);
                setStatus(buku.status);
                setSedangEdit(false);
              }}
            >
              Batal
            </button>
          </div>
        </div>
      </li>
    );
  }

  // Mode tampilan normal
  return (
    <li className="book-item" data-testid={`book-item-${buku.id}`}>
      <span className={`badge badge-${buku.status}`}>
        {buku.status === "milik" && "📚 Milik"}
        {buku.status === "baca" && "📖 Baca"}
        {buku.status === "beli" && "🛒 Beli"}
      </span>
      <div className="info">
        <span className="judul">{buku.judul}</span>
        <span className="penulis">✍️ {buku.penulis}</span>
      </div>
      <div className="aksi">
        <button
          type="button"
          className="btn btn-kecil btn-edit"
          onClick={() => setSedangEdit(true)}
          aria-label={`Edit ${buku.judul}`}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn btn-kecil btn-danger"
          onClick={() => hapusBuku(buku.id)}
          aria-label={`Hapus ${buku.judul}`}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

// PropTypes: validasi tipe props buku
BookItem.propTypes = {
  buku: PropTypes.shape({
    id: PropTypes.number.isRequired,
    judul: PropTypes.string.isRequired,
    penulis: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["milik", "baca", "beli"]).isRequired,
  }).isRequired,
};

/**
 * BookList — komponen daftar buku (reusable).
 * Menampilkan hasil filter + pencarian dari BookContext.
 */
export default function BookList() {
  const { bukuTampil, buku } = useBooks();

  if (buku.length === 0) {
    return (
      <p className="kosong" data-testid="daftar-kosong">
        Koleksi masih kosong. Tambahkan buku pertamamu! 📚
      </p>
    );
  }

  if (bukuTampil.length === 0) {
    return (
      <p className="kosong" data-testid="filter-kosong">
        Tidak ada buku yang cocok dengan filter/pencarian. 🔍
      </p>
    );
  }

  return (
    <ul className="book-list" data-testid="book-list">
      {bukuTampil.map((b) => (
        <BookItem key={b.id} buku={b} />
      ))}
    </ul>
  );
}
