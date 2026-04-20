# KomikVoid 🌑

Website baca manga, manhwa, dan manhua dengan UI hitam & biru neon.

## Stack
- **Next.js 14** (Pages Router)
- **Cheerio + Axios** untuk scraping (dijalankan di API Routes server-side)

## Cara Deploy ke Vercel

### 1. Upload ke GitHub
```bash
git init
git add .
git commit -m "init komikvoid"
git remote add origin https://github.com/USERNAME/komikvoid.git
git push -u origin main
```

### 2. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) → **New Project**
2. Import repo GitHub kamu
3. Framework: **Next.js** (auto-detected)
4. Klik **Deploy** ✅

### 3. Jalankan Lokal
```bash
npm install
npm run dev
# Buka http://localhost:3000
```

## Halaman
| Path | Keterangan |
|------|-----------|
| `/` | Home — slider, populer, terbaru |
| `/browse` | Browse per kategori + pagination |
| `/search?q=...` | Hasil pencarian |
| `/komik/[slug]` | Detail komik + daftar chapter |
| `/baca/[slug]` | Reader chapter |
| `/genre/[slug]` | Komik per genre |

## API Routes
| Endpoint | Params |
|----------|--------|
| `GET /api/home` | — |
| `GET /api/list` | `type`, `page` |
| `GET /api/search` | `q`, `page` |
| `GET /api/detail` | `url` |
| `GET /api/chapter` | `url` |
| `GET /api/genre` | `slug`, `page` |
