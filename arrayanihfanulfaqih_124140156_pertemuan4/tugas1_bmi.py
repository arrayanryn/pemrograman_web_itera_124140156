"""Tugas 1 - Program Penghitung BMI (Body Mass Index) Sederhana.

Program membaca berat badan (kg) dan tinggi badan (m) dari pengguna,
menghitung nilai BMI dengan rumus BMI = berat / (tinggi * tinggi),
lalu menentukan kategori berat badan menggunakan percabangan
if-elif-else dan menampilkannya dengan f-string 2 angka desimal.
"""


def hitung_bmi(berat, tinggi):
    """Menghitung nilai Body Mass Index (BMI).

    Args:
        berat (float): Berat badan dalam kilogram (kg).
        tinggi (float): Tinggi badan dalam meter (m).

    Returns:
        float: Nilai BMI hasil perhitungan berat / (tinggi * tinggi).
    """
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi):
    """Menentukan kategori berat badan berdasarkan nilai BMI.

    Args:
        bmi (float): Nilai BMI hasil perhitungan.

    Returns:
        str: Kategori berat badan sesuai rentang nilai BMI.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    """Menjalankan alur program: input data, hitung BMI, cetak hasil."""
    print("=== Program Penghitung BMI ===")
    berat = float(input("Masukkan berat badan (kg) : "))
    tinggi = float(input("Masukkan tinggi badan (m) : "))

    bmi = hitung_bmi(berat, tinggi)
    kategori = tentukan_kategori(bmi)

    print()
    print(f"Nilai BMI Anda          : {bmi:.2f}")
    print(f"Kategori                : {kategori}")


if __name__ == "__main__":
    main()
