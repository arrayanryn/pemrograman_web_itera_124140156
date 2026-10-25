import PropTypes from "prop-types";
import { useBooks } from "../../context/BookContext";
import "./BookFilter.css";

/**
 * BookFilter — komponen reusable untuk:
 * 1. Filter buku berdasarkan status (semua / milik / baca / beli)
 * 2. Pencarian berdasarkan judul atau nama penulis
 */
export default function BookFilter() {
  const { filterStatus, setFilterStatus, kataKunci, setKataKunci } = useBooks();

  // Daftar pilihan filter (dipetakan agar mudah dikembangkan)
  const opsiFilter = [
    { nilai: "semua", label: "Semua" },
    { nilai: "milik", label: "📚 Milik" },
    { nilai: "baca", label: "📖 Baca" },
    { nilai: "beli", label: "🛒 Beli" },
  ];

  return (
    <div className="book-filter">
      {/* Filter status */}
      <div className="filter-chips" role="group" aria-label="Filter status buku">
        {opsiFilter.map((opsi) => (
          <button
            key={opsi.nilai}
            type="button"
            className={filterStatus === opsi.nilai ? "btn-filter aktif" : "btn-filter"}
            onClick={() => setFilterStatus(opsi.nilai)}
          >
            {opsi.label}
          </button>
        ))}
      </div>

      {/* Pencarian judul/penulis */}
      <input
        type="search"
        className="input-cari"
        placeholder="🔍 Cari judul atau penulis…"
        value={kataKunci}
        onChange={(e) => setKataKunci(e.target.value)}
        aria-label="Cari buku"
      />
    </div>
  );
}

// PropTypes tidak menerima props (ambil dari context), tapi tetap didefinisikan
// agar konsisten dengan aturan "PropTypes di seluruh komponen" — komponen tanpa props.
BookFilter.propTypes = {};
