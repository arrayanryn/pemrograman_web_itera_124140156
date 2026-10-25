import { useEffect, useState } from "react";

/**
 * Custom Hook #1: useLocalStorage
 * Menyimpan state ke localStorage secara persisten.
 * Penggunaan: const [buku, setBuku] = useLocalStorage("kunci", nilaiAwal)
 *
 * - Lazy initializer: membaca localStorage sekali saat mount.
 * - useEffect: menulis ke localStorage setiap kali state berubah.
 */
export default function useLocalStorage(kunci, nilaiAwal) {
  // useState dengan fungsi initializer agar localStorage hanya dibaca sekali
  const [nilai, setNilai] = useState(() => {
    try {
      const data = localStorage.getItem(kunci);
      return data !== null ? JSON.parse(data) : nilaiAwal;
    } catch (err) {
      console.error(`Gagal membaca localStorage "${kunci}":`, err);
      return nilaiAwal;
    }
  });

  // Sinkronkan setiap perubahan state ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(kunci, JSON.stringify(nilai));
    } catch (err) {
      console.error(`Gagal menulis localStorage "${kunci}":`, err);
    }
  }, [kunci, nilai]);

  return [nilai, setNilai];
}
