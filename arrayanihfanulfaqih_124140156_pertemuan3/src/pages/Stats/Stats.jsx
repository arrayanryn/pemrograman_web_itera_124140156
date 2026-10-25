import { useEffect } from "react";
import { useBooks } from "../../context/BookContext";
import useBookStats from "../../hooks/useBookStats";
import "./Stats.css";

/**
 * Stats — halaman statistik koleksi buku.
 * Memakai custom hook useBookStats (useMemo) untuk perhitungan.
 * useEffect dipakai untuk mengubah judul dokumen sesuai halaman (lifecycle).
 */
export default function Stats() {
  const { buku } = useBooks();
  const statistik = useBookStats(buku);

  // useEffect: lifecycle — update judul tab browser saat halaman Stats dibuka
  useEffect(() => {
    document.title = "Statistik — BookVault";
    // Cleanup saat pindah halaman
    return () => {
      document.title = "BookVault — Manajemen Buku";
    };
  }, []);

  const kartu = [
    { label: "Total Koleksi", nilai: statistik.total, ikon: "📚", warna: "#38bdf8" },
    { label: "Dimiliki", nilai: statistik.milik, ikon: "✅", warna: "#34d399" },
    { label: "Sedang Dibaca", nilai: statistik.baca, ikon: "📖", warna: "#fbbf24" },
    { label: "Ingin Dibeli", nilai: statistik.beli, ikon: "🛒", warna: "#f472b6" },
  ];

  return (
    <div className="stats">
      <div className="stats-grid">
        {kartu.map((k) => (
          <div className="stat-kartu" key={k.label}>
            <span className="stat-ikon">{k.ikon}</span>
            <span className="stat-nilai" style={{ color: k.warna }}>
              {k.nilai}
            </span>
            <span className="stat-label">{k.label}</span>
          </div>
        ))}
      </div>

      <div className="stat-progres">
        <div className="progres-header">
          <span>Progres Koleksi</span>
          <span>{statistik.persen}%</span>
        </div>
        <div className="progres-bar">
          <div className="progres-isi" style={{ width: `${statistik.persen}%` }} />
        </div>
        <p className="progres-keterangan">
          {statistik.milik + statistik.baca} dari {statistik.total} buku sudah dimiliki atau
          sedang dibaca.
        </p>
      </div>
    </div>
  );
}
