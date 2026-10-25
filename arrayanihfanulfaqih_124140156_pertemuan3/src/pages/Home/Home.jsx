import BookForm from "../../components/BookForm/BookForm";
import BookList from "../../components/BookList/BookList";
import BookFilter from "../../components/BookFilter/BookFilter";
import "./Home.css";

/**
 * Home — halaman utama berisi form tambah, filter/pencarian,
 * dan daftar buku.
 */
export default function Home() {
  return (
    <div className="home">
      <div className="home-kolom-form">
        <BookForm />
      </div>
      <div className="home-kolom-daftar">
        <BookFilter />
        <BookList />
      </div>
    </div>
  );
}
