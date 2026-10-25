import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

/**
 * Navbar — navigasi antar halaman menggunakan React Router (NavLink).
 * NavLink otomatis memberi class "active" pada link yang sedang aktif.
 */
export default function Navbar({ nama, nim }) {
  return (
    <nav className="navbar">
      <span className="brand">📚 BookVault</span>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "aktif" : "")}>
          🏠 Daftar Buku
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => (isActive ? "aktif" : "")}>
          📊 Statistik
        </NavLink>
      </div>
      <span className="identitas">
        {nama} · {nim}
      </span>
    </nav>
  );
}

// PropTypes: validasi props Navbar
Navbar.propTypes = {
  nama: PropTypes.string.isRequired,
  nim: PropTypes.string.isRequired,
};
