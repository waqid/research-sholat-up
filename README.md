# Sholat UP

**Jadwal Sholat Presisi & Progressive Web App (PWA) untuk Indonesia**

Sholat UP adalah aplikasi jadwal sholat berbasis web modern yang menghitung waktu sholat secara langsung di peramban (*100% client-side*) menggunakan algoritma astronomi presisi tinggi tanpa memerlukan koneksi ke server atau API eksternal.

---

## ✨ Fitur Utama

- **Komputasi Astronomi Jean Meeus & Pak Abdurrouf**: Menggunakan rumus astronomi Jean Meeus untuk kalkulasi Julian Day, deklinasi matahari, dan Equation of Time ($EoT$), dipadukan dengan derivasi trigonometri Pak Abdurrouf untuk perhitungan waktu Asar ($tba = 1$ Imam Syafi'i dan $tba = 2$ Imam Hanafi).
- **100% Client-Side & Offline PWA**: Dibelkasi oleh *Service Worker* (`vite-plugin-pwa`) dan sistem *caching* lokal. Aplikasi dapat diinstal ke layar utama (HP/Desktop) dan berfungsi penuh tanpa koneksi internet.
- **Deteksi GPS Otomatis & Kota Preset**: Mendukung deteksi koordinat GPS secara otomatis dari perangkat pengguna, dengan opsi kota preset Indonesia (Kota Malang, Kota Surabaya, Kota Denpasar, Kota Jakarta).
- **Mode Tampilan "Hari Ini" & Hitung Mundur Real-Time**: Menampilkan hitung mundur detik-demi-detik menuju waktu sholat berikutnya dilengkapi kartu penanda motif *signal-flow*.
- **Kalender Multi-Hari & Ekspor Data**: Tabel jadwal bulanan/tahunan yang mendukung cetak langsung (*Print*) dan pengunduhan berkas **CSV** untuk keperluan dokumentasi.
- **Desain Modern (`dama-design`)**: Dibangun dengan **Tailwind CSS v4** menggunakan palet duotone Teal (`#209CAF`) untuk struktur dan Flame (`#EB7841`) untuk energi, serta otomatis mengikuti mode gelap/terang sistem lunak (*Dark Mode Auto*).

---

## 🛠️ Teknologi & Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Bahasa**: TypeScript (`strict: true`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@theme` dan `@utility` CSS-first)
- **PWA Integration**: `vite-plugin-pwa` (Workbox)
- **Pengujian**: [Vitest](https://vitest.dev/) + Testing Library

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Prasyarat & Instalasi
Pastikan Node.js (v18+) sudah terinstal, lalu jalankan:

```bash
git clone https://github.com/waqid/research-sholat-up.git
cd research-sholat-up
npm install
```

### 2. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

### 3. Menjalankan Pengujian (Testing)
Untuk memverifikasi paritas perhitungan astronomi dan integritas komponen antarmuka:
```bash
# Menjalankan seluruh unit & integration test
npm test

# Menjalankan type-checking TypeScript secara ketat
npx tsc --noEmit
```

### 4. Membangun Versi Produksi (Production Build)
```bash
npm run build
```
Hasil kompilasi beserta berkas *Service Worker* PWA (`sw.js`) akan disimpan di dalam direktori `dist/`. Anda dapat melihat pratinjau lokal dari build produksi menggunakan:
```bash
npm run preview
```

---

## 📐 Arsitektur & Paritas Perhitungan

Perhitungan waktu sholat di `src/lib/astronomy/meeus.ts` merupakan porting langsung dari logika server-side PHP (`functions.php`) yang telah diverifikasi memiliki akurasi yang persis sama hingga ke tingkat menit (`JD 2454995` / 12 Juni 2009 untuk Kota Malang menghasilkan: Subuh `04:18`, Terbit `05:37`, Dhuhur `11:34`, Ashar `14:53`, Maghrib `17:26`, Isya `18:38`).

---

## 📄 Lisensi & Atribusi

- **Algoritma Astronomi**: Jean Meeus & identitas trigonometri Asar oleh Pak Abdurrouf.
- **Desain UI/UX**: `dama-design` system (dama.id).
