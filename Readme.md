# BukuKu — Panduan Setup Lengkap

Website perpustakaan buku pribadi berbasis JavaScript murni.
Stack: **Supabase** (auth + database) + **MEGA.nz** (file storage) + **GitHub Pages** (hosting)

---

## 📁 Struktur File

```
bukuku/
├── index.html       ← Halaman login admin
├── library.html     ← Halaman utama perpustakaan
└── SETUP.md         ← Panduan ini
```

---

## 1. Setup Supabase

### A. Buat Project
1. Buka https://supabase.com → New Project
2. Catat **Project URL** dan **anon public key**

### B. Buat Tabel `books`
Jalankan SQL berikut di **SQL Editor** Supabase:

```sql
CREATE TABLE books (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  title        TEXT NOT NULL,
  author       TEXT,
  year         INT,
  genre        TEXT,
  language     TEXT DEFAULT 'id',
  format       TEXT,               -- 'pdf', 'epub', 'mobi', dll
  file_size    BIGINT,             -- dalam bytes
  file_name    TEXT,
  mega_link    TEXT,               -- link MEGA.nz (mega.nz/file/...)
  download_url TEXT,               -- fallback atau direct link
  cover_url    TEXT                -- opsional: URL thumbnail cover
);

-- Aktifkan Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Hanya user yang sudah login bisa baca & tulis
CREATE POLICY "Authenticated can read" ON books
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert" ON books
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete" ON books
  FOR DELETE USING (auth.role() = 'authenticated');
```

### C. Buat Admin User
Di Supabase → Authentication → Users → **Add user**:
- Email: `admin@bukuku.id` (atau email kamu)
- Password: buat password yang kuat

---

## 2. Isi Konfigurasi di HTML

Di **index.html** dan **library.html**, ganti bagian ini:

```javascript
const SUPABASE_URL    = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

---

## 3. Setup Backend Upload MEGA.nz

MEGA.nz tidak mendukung upload langsung dari browser (ada batasan CORS).
Kamu butuh **backend ringan** sebagai proxy. Ada 2 pilihan:

### Pilihan A: Cloudflare Worker (GRATIS, Direkomendasikan)

1. Buat akun https://cloudflare.com
2. Workers & Pages → Create Worker
3. Paste kode ini:

```javascript
// cloudflare-worker.js
import { File, Storage } from 'megajs';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const buffer = await file.arrayBuffer();

    // Koneksi ke MEGA
    const storage = await new Storage({
      email: env.MEGA_EMAIL,
      password: env.MEGA_PASSWORD,
    }).ready;

    const upload = storage.upload({
      name: file.name,
      size: buffer.byteLength,
    }, Buffer.from(buffer));

    const uploadedFile = await upload.complete;
    const link = await uploadedFile.link();

    return new Response(JSON.stringify({ link, success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};
```

4. Di Worker Settings → Environment Variables:
   - `MEGA_EMAIL` = email akun MEGA kamu
   - `MEGA_PASSWORD` = password MEGA kamu

5. Deploy, lalu copy URL worker-nya ke **library.html**:

```javascript
const MEGA_UPLOAD_ENDPOINT = 'https://your-worker.workers.dev/upload';
```

### Pilihan B: Node.js + Express (Self-hosted)

```bash
npm init -y
npm install express megajs multer cors
```

```javascript
// server.js
const express = require('express');
const multer  = require('multer');
const cors    = require('cors');
const { Storage } = require('megajs');

const app    = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const storage = await new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    }).ready;

    const up = storage.upload({
      name: req.file.originalname,
      size: req.file.size,
    }, req.file.buffer);

    const f = await up.complete;
    const link = await f.link();
    res.json({ link, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server jalan di port 3001'));
```

Deploy ke Railway, Render, atau VPS kamu.

---

## 4. Deploy ke GitHub Pages

```bash
# Init repo
git init
git add .
git commit -m "Initial commit: BukuKu"

# Push ke GitHub
git remote add origin https://github.com/username/bukuku.git
git push -u origin main
```

Di GitHub repo → **Settings** → **Pages**:
- Source: `Deploy from branch`
- Branch: `main` / `root`

Website akan live di: `https://username.github.io/bukuku/`

---

## 5. Fitur yang Sudah Tersedia

- ✅ Login/logout admin dengan Supabase Auth
- ✅ Tampilan grid & list dengan toggle
- ✅ Upload buku (file + metadata: judul, penulis, tahun, genre, bahasa)
- ✅ Download buku via link MEGA.nz
- ✅ Hapus buku dari database
- ✅ Pencarian judul & penulis
- ✅ Filter berdasarkan genre & format
- ✅ Stats: total buku, jumlah PDF/EPUB, total ukuran
- ✅ Cover generatif berdasarkan judul (warna unik per buku)
- ✅ Progress bar upload
- ✅ Drag & drop file
- ✅ Notifikasi toast
- ✅ Responsive mobile

---

## 6. Pengembangan Opsional

| Fitur | Cara |
|-------|------|
| Cover buku | Tambah kolom `cover_url`, upload thumbnail ke Supabase Storage |
| Pencarian lanjut | Tambah full-text search di Supabase dengan `to_tsvector` |
| Rating & catatan | Tambah kolom `rating`, `notes` di tabel `books` |
| Multi-user | Tambah kolom `user_id` dan sesuaikan RLS policy |
| Preview PDF | Gunakan PDF.js untuk pratinjau langsung di browser |

---

**Selamat membaca! 📚**
