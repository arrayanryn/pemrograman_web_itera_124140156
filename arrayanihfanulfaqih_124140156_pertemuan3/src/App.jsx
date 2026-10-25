import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import { BookProvider } from "./context/BookContext";
import "./App.css";

/**
 * App — komponen root.
 * - BookProvider: Context API untuk state global buku
 * - BrowserRouter + Routes: React Router multi-halaman
 *   (/ = daftar buku, /stats = statistik, * = redirect ke /)
 */
export default function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar nama="Arrayan Ihfanul Faqih" nim="124140156" />
          <main className="konten">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              {/* Route tidak dikenal → kembali ke halaman utama */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>
              Arrayan Ihfanul Faqih — 124140156 — RA | Praktikum Pemrograman Web ITERA ·
              Pertemuan 3 (React Basics)
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </BookProvider>
  );
}
