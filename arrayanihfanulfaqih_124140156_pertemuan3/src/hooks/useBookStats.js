import { useMemo } from "react";

/**
 * Custom Hook #2: useBookStats
 * Menghitung statistik koleksi buku dari array buku.
 * useMemo agar perhitungan hanya diulang saat daftar buku berubah.
 *
 * @param {Array<{status: string}>} buku - daftar buku dari BookContext
 * @returns {{milik: number, baca: number, beli: number, total: number, persen: number}}
 */
export default function useBookStats(buku) {
  return useMemo(() => {
    const total = buku.length;
    const milik = buku.filter((b) => b.status === "milik").length;
    const baca = buku.filter((b) => b.status === "baca").length;
    const beli = buku.filter((b) => b.status === "beli").length;

    // "Selesai" dianggap: buku milik + buku sedang dibaca vs total koleksi
    const progres = milik + baca;
    const persen = total === 0 ? 0 : Math.round((progres / total) * 100);

    return { milik, baca, beli, total, persen };
  }, [buku]);
}
