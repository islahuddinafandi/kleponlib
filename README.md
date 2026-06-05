# 📚 Perpustakaan Digital Pribadi

Aplikasi web pribadi untuk menyimpan dan membaca koleksi buku Anda.
- **Login** → halaman cerah dengan animasi
- **Library** → grid buku dengan pencarian & filter
- **Reader** → baca PDF langsung dari Google Drive
- **Auth & metadata** → Supabase
- **File buku** → Google Drive

---

## 🚀 Panduan Setup Lengkap

### 1. Buat Proyek Supabase

1. Daftar/masuk di [supabase.com](https://supabase.com)
2. Klik **New Project** → isi nama & password
3. Tunggu ~2 menit sampai siap
4. Buka **SQL Editor** → tempel isi file `supabase-schema.sql` → klik **Run**
5. Buka **Authentication → Users** → klik **Add User** → masukkan email & password Anda
6. Buka **Settings → API** → salin:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`

### 2. Siapkan Google Drive

1. Upload file PDF/ebook ke Google Drive
2. Klik kanan file → **Share** → **Change to anyone with the link** → **Viewer**
3. Salin ID dari URL: `drive.google.com/file/d/**[ID INI]**/view`
4. Simpan ID tersebut untuk dimasukkan saat tambah buku

### 3. Push ke GitHub

```bash
git init
git add .
git commit -m "first commit: personal digital library"
git remote add origin https://github.com/USERNAME/digital-library.git
git push -u origin main
```

### 4a. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → **New Project** → import repo
2. Buka **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = URL dari Supabase
   - `VITE_SUPABASE_ANON_KEY` = anon key dari Supabase
3. Klik **Deploy** → selesai!

### 4b. Deploy ke Netlify

1. Buka [netlify.com](https://netlify.com) → **Import from Git** → pilih repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. **Site settings → Environment variables** → tambahkan 2 variabel di atas
5. Klik **Deploy** → selesai!

---

## 🗂️ Struktur Proyek

```
src/
├── lib/
│   ├── supabase.js      ← koneksi Supabase
│   ├── AuthContext.jsx  ← state login/logout
│   └── books.js         ← CRUD buku + helper Drive
├── pages/
│   ├── LoginPage.jsx    ← halaman login cerah
│   └── LibraryPage.jsx  ← halaman utama library
├── components/
│   ├── BookCard.jsx     ← kartu buku
│   ├── AddBookModal.jsx ← form tambah buku
│   └── ReaderModal.jsx  ← reader PDF embedded
└── styles/
    └── global.css
```

---

## 📝 Skema Database Supabase

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key otomatis |
| `user_id` | uuid | Relasi ke auth.users |
| `title` | text | Judul buku (**wajib**) |
| `author` | text | Nama penulis |
| `year` | integer | Tahun terbit |
| `genre` | text | Genre/kategori |
| `description` | text | Sinopsis |
| `gdrive_file_id` | text | ID file Google Drive |
| `cover_url` | text | URL gambar cover |
| `isbn` | text | ISBN (untuk cover otomatis) |

---

## ⚙️ Development Lokal

```bash
cp .env.example .env
# Edit .env dengan nilai Supabase Anda

npm install
npm run dev
# Buka http://localhost:3000
```
