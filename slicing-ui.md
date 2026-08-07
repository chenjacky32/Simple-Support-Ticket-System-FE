# Slicing UI Plan: Simple Support Ticket System

Dokumen ini adalah panduan dan perencanaan (*planning*) untuk melakukan Slicing UI. Panduan ini ditujukan untuk Junior Frontend Developer dan/atau AI Model.

## 1. Tech Stack
- Next.js v16
- TypeScript
- Tailwind CSS
- shadcn/ui

## 2. Konfigurasi Semantic Style (`globals.css`)
- **Wajib menggunakan variabel shadcnui**: Saat melakukan slicing UI, dilarang menggunakan warna (hex/rgb), spacing, font-size, border-radius secara manual (hardcode) pada *class* Tailwind (contoh dilarang: `text-[#123456]`, `rounded-[10px]`).
- **Gunakan variabel semantic**: Cari variabel warna atau style di `globals.css` yang paling mendekati dengan desain UI. (contoh: gunakan `bg-primary`, `text-muted-foreground`, `rounded-md`).
- **Sesuaikan di globals.css**: Sesuaikan konfigurasi *color palette*, *spacing*, *font-size*, *border-radius*, *opacity*, *animasi*, dan *shadows* berdasarkan desain gambar ke dalam file `globals.css` (di bagian `@theme inline`, `:root`, dan `.dark`).
- Tujuan: Memudahkan pemeliharaan (maintenance) jika suatu saat ada perubahan tema atau warna secara global.

## 3. Typography & Icons
- **Font Utama**: `Inter`
- **Icon Library**: `lucide-react`

## 4. UI Components (shadcnui)
- Gunakan komponen bawaan dari shadcnui semaksimal mungkin.
- Dokumentasi: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- **DILARANG** mengubah isi dari file komponen yang ada di `/components/ui` dan file utilitas pendukung `/lib/utils.ts`.

## 5. Dependencies yang Wajib Di-install
Pastikan untuk menginstal pustaka berikut sebelum mulai bekerja:
- `Tanstack Query` (`@tanstack/react-query`)
- `React Hook Forms` (`react-hook-form`)
- `Zod Validation` (`zod`, `@hookform/resolvers`)
- `Axios` (`axios`)
- `Tanstack Table` (`@tanstack/react-table`)

## 6. Aturan Penggunaan TanStack Table
- Buat data grid menggunakan TanStack Table secara **headless**.
- Definisikan definisi kolom, model baris, pengurutan (sorting), pemfilteran (filtering), paginasi (pagination), pemilihan (selection), visibilitas (visibility), dan status terkontrol (controlled state) **tanpa menentukan markup bawaan**.
- Render elemen tabel secara semantik.
- Sinkronkan status tabel ke URL atau server *hanya jika produk / fitur membutuhkannya*.

## 7. Daftar Pages yang Akan Dibuat
- `/` (Halaman Login)
- `/register` (Halaman Register)
- `/dashboard` (Halaman Dashboard)
- `/tickets` (Halaman List Tickets)
- `/tickets/create` (Halaman Create Ticket)
- `/tickets/:id` (Halaman Ticket Detail)
- `/users/list` (Halaman List Users)

## 8. Struktur Folder Next.js
Gunakan struktur App Router berikut ini:
```text
- app/ 
    - dashboard/
        - page.tsx
    - tickets/
        - [slug]/
            - page.tsx
        - create/
            - page.tsx
    - users/
        - list/
            - page.tsx
    - login/
    - register/
- components/
    - ui/
    - tickets/
    - users/
    - auth/
- lib/
- hooks/
- types/
- utils/
- services/
- schemas/ 
```

## 9. Aturan Pengerjaan (DOs)
- Lakukan pekerjaan *strict* sesuai dengan apa yang ada di dalam dokumen ini.
- Penggunaan *style* wajib konsisten di seluruh pages.
- Fokus utama pada tugas *slicing ui* berdasarkan gambar referensi yang dikirimkan.
- Menggunakan `next/router` (atau `next/navigation` untuk Next.js App Router) untuk perpindahan rute (routing).
- Gunakan foto / referensi desain UI yang berada di folder `/simple-ticketing-app-image`.

## 10. Larangan (DON'Ts)
- **DILARANG** menggunakan library atau tools pihak ketiga lain selain yang sudah ditentukan di atas.
- **DILARANG** melakukan perubahan style warna secara manual di tiap komponen; **WAJIB** menggunakan semantic style yang sudah ditentukan di `globals.css`.
- **DILARANG** menggunakan JavaScript murni (`.js` / `.jsx`), **WAJIB** menggunakan TypeScript (`.ts` / `.tsx`).
- **DILARANG** mengubah isi file di direktori `/components/ui` dan file `/lib/utils.ts`.
