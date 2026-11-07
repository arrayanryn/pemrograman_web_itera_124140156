"""Tugas 3 - Modul math_operations.

Modul kustom berisi fungsi perhitungan luas & keliling tiga bentuk
geometri (persegi, persegi panjang, lingkaran), dua fungsi konversi
temperatur (Celsius ke Fahrenheit dan Celsius ke Kelvin), serta satu
variabel konstanta PI.
"""

# Konstanta lingkaran (pi), dibulatkan menjadi 3.14159
PI = 3.14159


# ==================== FUNGSI GEOMETRI ====================

def luas_persegi(sisi):
    """Menghitung luas persegi.

    Args:
        sisi (float): Panjang sisi persegi.

    Returns:
        float: Luas persegi = sisi * sisi.
    """
    return sisi * sisi


def keliling_persegi(sisi):
    """Menghitung keliling persegi.

    Args:
        sisi (float): Panjang sisi persegi.

    Returns:
        float: Keliling persegi = 4 * sisi.
    """
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang.

    Args:
        panjang (float): Panjang persegi panjang.
        lebar (float): Lebar persegi panjang.

    Returns:
        float: Luas persegi panjang = panjang * lebar.
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang.

    Args:
        panjang (float): Panjang persegi panjang.
        lebar (float): Lebar persegi panjang.

    Returns:
        float: Keliling persegi panjang = 2 * (panjang + lebar).
    """
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran menggunakan konstanta PI modul ini.

    Args:
        jari_jari (float): Panjang jari-jari lingkaran.

    Returns:
        float: Luas lingkaran = PI * jari_jari ** 2.
    """
    return PI * jari_jari ** 2


def keliling_lingkaran(jari_jari):
    """Menghitung keliling lingkaran menggunakan konstanta PI modul ini.

    Args:
        jari_jari (float): Panjang jari-jari lingkaran.

    Returns:
        float: Keliling lingkaran = 2 * PI * jari_jari.
    """
    return 2 * PI * jari_jari


# ==================== FUNGSI KONVERSI SUHU ====================

def celsius_ke_fahrenheit(celsius):
    """Mengonversi suhu dari Celsius ke Fahrenheit.

    Args:
        celsius (float): Suhu dalam derajat Celsius.

    Returns:
        float: Suhu dalam derajat Fahrenheit = (C * 9/5) + 32.
    """
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius):
    """Mengonversi suhu dari Celsius ke Kelvin.

    Args:
        celsius (float): Suhu dalam derajat Celsius.

    Returns:
        float: Suhu dalam Kelvin = C + 273.15.
    """
    return celsius + 273.15
