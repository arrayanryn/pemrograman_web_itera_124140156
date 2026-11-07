"""Tugas 2 - Program Pengelolaan Data Nilai Mahasiswa.

Program menyimpan data mahasiswa dalam list berisi dictionary,
menghitung nilai akhir dengan bobot (30% UTS + 40% UAS + 30% Tugas),
menentukan grade A-E, menampilkan seluruh data dalam format tabel
rapi, serta mencari mahasiswa dengan nilai tertinggi dan terendah.
"""

MAHASISWA = [
    {"nama": "Andi Pratama", "nim": "124140101", "nilai_uts": 78, "nilai_uas": 85, "nilai_tugas": 88},
    {"nama": "Budi Santoso", "nim": "124140102", "nilai_uts": 65, "nilai_uas": 70, "nilai_tugas": 80},
    {"nama": "Citra Dewi", "nim": "124140103", "nilai_uts": 55, "nilai_uas": 62, "nilai_tugas": 70},
    {"nama": "Dimas Aditya", "nim": "124140104", "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 60},
    {"nama": "Eka Putri", "nim": "124140105", "nilai_uts": 72, "nilai_uas": 68, "nilai_tugas": 75},
    {"nama": "Fajar Ramadhan", "nim": "124140106", "nilai_uts": 80, "nilai_uas": 90, "nilai_tugas": 85},
]

BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30


def hitung_nilai_akhir(uts, uas, tugas):
    """Menghitung nilai akhir berdasarkan bobot persentase.

    Args:
        uts (int): Nilai UTS mahasiswa.
        uas (int): Nilai UAS mahasiswa.
        tugas (int): Nilai tugas mahasiswa.

    Returns:
        float: Nilai akhir = (30% * UTS) + (40% * UAS) + (30% * Tugas).
    """
    return (BOBOT_UTS * uts) + (BOBOT_UAS * uas) + (BOBOT_TUGAS * tugas)


def tentukan_grade(nilai_akhir):
    """Menentukan grade huruf berdasarkan nilai akhir.

    Args:
        nilai_akhir (float): Nilai akhir hasil perhitungan bobot.

    Returns:
        str: Grade huruf "A", "B", "C", "D", atau "E".
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def proses_data(data_mahasiswa):
    """Memproses seluruh data mahasiswa menjadi data lengkap.

    Setiap dictionary mahasiswa ditambahkan kunci `nilai_akhir` hasil
    perhitungan bobot dan kunci `grade` hasil penentuan grade.

    Args:
        data_mahasiswa (list): List berisi dictionary data mahasiswa.

    Returns:
        list: List dictionary data mahasiswa yang sudah dilengkapi
        nilai akhir dan grade.
    """
    hasil = []
    for mhs in data_mahasiswa:
        akhir = hitung_nilai_akhir(mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"])
        hasil.append({
            "nama": mhs["nama"],
            "nim": mhs["nim"],
            "nilai_uts": mhs["nilai_uts"],
            "nilai_uas": mhs["nilai_uas"],
            "nilai_tugas": mhs["nilai_tugas"],
            "nilai_akhir": akhir,
            "grade": tentukan_grade(akhir),
        })
    return hasil


def tampilkan_tabel(data_mahasiswa):
    """Menampilkan seluruh data mahasiswa dalam format tabel rapi.

    Args:
        data_mahasiswa (list): List dictionary data mahasiswa lengkap.

    Returns:
        None: Hanya mencetak tabel ke terminal.
    """
    garis = "=" * 88
    tipis = "-" * 88

    print(garis)
    print("DATA NILAI MAHASISWA".center(88))
    print(garis)
    # Perataan angka kanan dengan f-string :>n, teks rata kiri :<n
    print(f"{'No':<4}{'Nama':<20}{'NIM':<14}{'UTS':>5}{'UAS':>6}{'Tugas':>7}{'Akhir':>8}{'Grade':>7}")
    print(tipis)

    for urutan, mhs in enumerate(data_mahasiswa, start=1):
        print(
            f"{urutan:<4}"
            f"{mhs['nama']:<20}"
            f"{mhs['nim']:<14}"
            f"{mhs['nilai_uts']:>5}"
            f"{mhs['nilai_uas']:>6}"
            f"{mhs['nilai_tugas']:>7}"
            f"{mhs['nilai_akhir']:>8.2f}"
            f"{mhs['grade']:>7}"
        )

    print(garis)


def tampilkan_nilai_ekstrem(data_mahasiswa):
    """Mencari dan menampilkan mahasiswa dengan nilai tertinggi dan terendah.

    Args:
        data_mahasiswa (list): List dictionary data mahasiswa lengkap.

    Returns:
        None: Hanya mencetak hasil ke terminal.
    """
    tertinggi = max(data_mahasiswa, key=lambda mhs: mhs["nilai_akhir"])
    terendah = min(data_mahasiswa, key=lambda mhs: mhs["nilai_akhir"])

    print()
    print("NILAI TERTINGGI")
    print(f"  {'Nama':<12}: {tertinggi['nama']} ({tertinggi['nim']})")
    print(f"  {'Nilai Akhir':<12}: {tertinggi['nilai_akhir']:.2f} (Grade {tertinggi['grade']})")
    print()
    print("NILAI TERENDAH")
    print(f"  {'Nama':<12}: {terendah['nama']} ({terendah['nim']})")
    print(f"  {'Nilai Akhir':<12}: {terendah['nilai_akhir']:.2f} (Grade {terendah['grade']})")


def main():
    """Menjalankan alur program: proses data, cetak tabel dan ekstrem."""
    data_lengkap = proses_data(MAHASISWA)
    tampilkan_tabel(data_lengkap)
    tampilkan_nilai_ekstrem(data_lengkap)


if __name__ == "__main__":
    main()
