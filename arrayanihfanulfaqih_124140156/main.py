"""Tugas 3 - Program Utama (main.py).

Mengimpor dan menggunakan seluruh fungsi dari modul math_operations
dengan berbagai nilai pengujian, menerapkan dua cara impor berbeda:
1. import math_operations                      (akses lewat nama modul)
2. from math_operations import <nama_fungsi>   (akses langsung fungsi)
"""

import math_operations
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin


def main():
    """Fungsi utama: menguji dan menampilkan seluruh fungsi modul math_operations."""
    print("=" * 60)
    print("   PENGUJIAN MODUL math_operations".center(60))
    print("=" * 60)

    # ----- Cara impor 1: import math_operations -----
    print("\n[1] GEOMETRI - Persegi (sisi = 5)")
    print(f"    Luas     : {math_operations.luas_persegi(5)}")
    print(f"    Keliling : {math_operations.keliling_persegi(5)}")

    print("\n[2] GEOMETRI - Persegi Panjang (panjang = 10, lebar = 4)")
    print(f"    Luas     : {math_operations.luas_persegi_panjang(10, 4)}")
    print(f"    Keliling : {math_operations.keliling_persegi_panjang(10, 4)}")

    print("\n[3] GEOMETRI - Lingkaran (jari-jari = 7, PI = "
          f"{math_operations.PI})")
    print(f"    Luas     : {math_operations.luas_lingkaran(7):.2f}")
    print(f"    Keliling : {math_operations.keliling_lingkaran(7):.2f}")

    # ----- Cara impor 2: from math_operations import ... -----
    print("\n[4] KONVERSI SUHU")
    suhu_celsius = [0.0, 25.0, 100.0]
    for suhu in suhu_celsius:
        print(f"    {suhu:>6} C = {celsius_ke_fahrenheit(suhu):>7.2f} F"
              f" = {celsius_ke_kelvin(suhu):>7.2f} K")

    print("\n" + "=" * 60)
    print("   SEMUA FUNGSI BERHASIL DIUJI".center(60))
    print("=" * 60)


if __name__ == "__main__":
    main()
