# iDesk Helpdesk

[English](README.md) · **Bahasa Indonesia**

iDesk adalah sistem tiket helpdesk dengan backend NestJS dan frontend React. Agen mengerjakan tiket di papan kanban yang diperbarui secara langsung melalui Socket.io, sementara pelanggan dapat membuat dan memantau tiket dari portal klien atau lewat bot Telegram. Nama kode proyek ini "Antigravity". Repositori ini masih berupa prototipe pengembangan; baca [Status proyek](#status-proyek) sebelum men-deploy-nya.

![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-010101?logo=socketdotio&logoColor=white)

## Daftar isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur repositori](#struktur-repositori)
- [Memulai](#memulai)
- [Konfigurasi](#konfigurasi)
- [Docker](#docker)
- [Pengujian](#pengujian)
- [Status proyek](#status-proyek)
- [Lisensi](#lisensi)

## Fitur

- Tiket: buat, tugaskan, dan perbarui tiket melalui papan kanban drag-and-drop maupun tampilan daftar. Status dan pesan diperbarui langsung di semua browser yang terbuka melalui Socket.io.
- SLA: target SLA diatur per prioritas, dan job per jam memeriksa tiket terhadap target tersebut.
- Saved replies untuk jawaban yang sering dikirim agen.
- Survei kepuasan pelanggan yang dikirim setelah tiket selesai dan diisi di halaman publik `/feedback/:token`.
- Knowledge base berisi artikel untuk swalayan.
- Laporan dengan grafik dan ekspor Excel.
- Lampiran file yang disimpan di folder `uploads/` backend.
- Integrasi Telegram melalui adapter, sehingga penyedia chat lain bisa ditambahkan nanti tanpa mengubah logika tiket. Pesan masuk diterima oleh webhook controller.
- Pengguna dan departemen, dengan hak akses berbasis peran untuk `ADMIN`, `AGENT`, dan `USER` (pelanggan). Pelanggan memakai area klien tersendiri (`/client/my-tickets`).
- Autentikasi JWT, hash password bcrypt, dan header keamanan Helmet.

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Backend | NestJS 10, TypeORM, PostgreSQL, Socket.io, Passport JWT, nodemailer, handlebars, exceljs |
| Frontend | React 18, Vite 5, Tailwind CSS, TanStack Query, Zustand, React Router, dnd-kit, recharts, socket.io-client |
| Tooling | skrip root dengan `concurrently`, Docker Compose |

## Struktur repositori

```
apps/
  backend/                API NestJS (port 5050)
    src/modules/
      auth/               login, strategi JWT (lapisan clean architecture)
      ticketing/          tiket, pesan, SLA, saved replies, survei, adapter Telegram
      knowledge-base/     artikel
      reports/            dashboard dan ekspor
      uploads/            endpoint unggah lampiran
      users/              pengguna, departemen, peran
    src/seed.ts           membuat akun admin pertama
  frontend/               aplikasi React + Vite (port 4050)
docker-compose.yml        postgres + backend + frontend
docker-compose.db.yml     PostgreSQL saja, untuk development lokal
startup.bat               start development sekali klik di Windows
```

## Memulai

Prasyarat: Node.js 18 atau lebih baru dan Docker (untuk PostgreSQL).

### 1. Jalankan PostgreSQL

```bash
cp .env.example .env      # isi nilai DB_* dan JWT_SECRET yang kuat
docker compose -f docker-compose.db.yml --env-file .env up -d
```

Di Windows, `deploy_database_docker.bat` melakukan hal yang sama.

### 2. Pasang dependensi

```bash
npm install
npm run install:all
```

### 3. Jalankan backend dan frontend

```bash
npm start
```

Perintah ini menjalankan `nest start --watch` untuk backend dan `vite` untuk frontend dalam satu terminal. Di Windows Anda juga bisa klik dua kali `startup.bat`; skrip membuka setiap service di jendela sendiri lalu membuka `http://localhost:4050`.

TypeORM berjalan dengan `synchronize: true`, sehingga tabel dibuat otomatis saat start pertama.

### 4. Buat admin pertama

```bash
cd apps/backend
npx ts-node src/seed.ts
```

Seed membuat akun `admin@antigravity.com` dengan password `admin123` bila akun itu belum ada. Ganti password setelah login pertama.

| Service | URL |
|---|---|
| Frontend | http://localhost:4050 |
| Backend API dan Socket.io | http://localhost:5050 |

## Konfigurasi

Backend tidak memuat file `.env` sendiri. Variabel berikut dibaca dari environment proses, dengan nilai default seperti di tabel:

| Variabel | Default | Keterangan |
|---|---|---|
| `DB_HOST` | `localhost` | Host PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_USERNAME` | `postgres` | User database |
| `DB_PASSWORD` | `postgres` | Password database |
| `DB_DATABASE` | `idesk_db` | Nama database |
| `JWT_SECRET` | tidak ada | Secret untuk menandatangani access token. Selalu isi |
| `TELEGRAM_BOT_TOKEN` | tidak ada | Token bot Telegram untuk kanal chatbot |
| `FRONTEND_URL` | tidak ada | Diteruskan oleh `docker-compose.yml`; kode saat ini belum membacanya |

Frontend membaca `VITE_API_URL` (default `http://localhost:5050`). URL Socket.io saat ini masih tertulis tetap `http://localhost:5050` di `apps/frontend/src/lib/socket.ts`.

## Docker

`docker-compose.yml` membangun PostgreSQL, backend, dan frontend (disajikan nginx di port 80):

```bash
docker compose --env-file .env up -d --build
```

Sebelum mengandalkannya, perhatikan bahwa file compose memublikasikan backend di port 3000, sedangkan aplikasi listen di 5050. Sesuaikan dulu port mapping, origin CORS, serta URL API dan Socket.io di frontend dengan lingkungan Anda.

## Pengujian

```bash
cd apps/backend
npm test           # unit test Jest
npm run test:cov   # dengan coverage
```

[QA_CHECKLIST.md](QA_CHECKLIST.md) berisi skenario uji manual (login, CORS, unggah file, pembaruan realtime, persistensi sesi), dan [Walktrough.md](Walktrough.md) menjelaskan alur utama aplikasi.

## Status proyek

iDesk adalah prototipe yang berfungsi untuk pengembangan dan evaluasi. Hal yang perlu diselesaikan sebelum dipakai di produksi:

- Ganti `synchronize: true` dengan migrasi TypeORM.
- Pindahkan origin `localhost` yang masih tertulis tetap (CORS, Socket.io) ke konfigurasi.
- Perbaiki port mapping Docker seperti dijelaskan di atas.
- Anggap kredensial apa pun yang pernah ter-commit, termasuk di file contoh, sudah bocor dan segera ganti.
- `apps/backend/prisma/schema.prisma` adalah sisa desain lama; kode yang berjalan memakai entity TypeORM.

## Lisensi

Repositori ini belum menyertakan file lisensi. Hubungi pengembang sebelum menggunakan ulang kode ini.

Dikembangkan oleh Yohanes Octavian Rizky ([@torpedoliar](https://github.com/torpedoliar)).
