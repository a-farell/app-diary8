# Tugas Praktikum Pertemuan 8 - Mobile Programming
## React Redux Toolkit pada React Native (Diary App)

**Nama**: Farel Anwar
**NIM**: 2430511047
**Program Studi**: Teknik Informatika
**Universitas**: Universitas Muhammadiyah Sukabumi

## Tentang Aplikasi
**Diary App** berbasis React Native + Expo Router. Pada Pertemuan 8, global state (daftar diary dan status favorite) yang sebelumnya memakai Context API (Pertemuan 6) dipindahkan ke **Redux Toolkit**. Belum ada backend / REST API / MySQL, sehingga data hanya hidup di memori aplikasi.

## Fitur
- Home: daftar diary, **statistik Total Diary & Total Favorite**, pencarian, **filter mood**, dan **empty state informatif**.
- Tambah Diary dengan **validasi judul minimal 3 karakter** dan isi wajib diisi.
- **Edit Diary** (`app/edit/[id].tsx`) untuk mengubah title, body, dan mood melalui Redux.
- Favorite: toggle hati, daftar favorite (derived state), tombol **Hapus Semua Favorite** (`clearAllFavorites`), dan empty state informatif.
- Detail: tambah/hapus favorite, edit, dan hapus diary.

## Struktur Project
```
app/
├── _layout.tsx            -> <Provider store={store}>
├── (tabs)/ index, favorites, create, settings
├── detail/[id].tsx
└── edit/[id].tsx          -> screen edit (tugas)
src/
├── app/ store.ts, hooks.ts          -> configureStore + typed hooks
├── features/diary/diarySlice.ts     -> state, reducers, selectors
├── components/DiaryCard.tsx
├── constants/moods.ts
├── hooks/ useDiarySearch.ts, useLikedEntries.ts
└── styles/tokens.ts
```

## Cara Menjalankan Project
1. Pastikan **Node.js LTS** sudah terpasang.
2. Buka terminal di folder `diary-app8`, lalu instal dependensi (sudah termasuk `@reduxjs/toolkit` dan `react-redux`):

       npm install

3. Jalankan aplikasi:

       npx expo start -c

4. Tekan `a` untuk Android Emulator, atau scan QR code dengan **Expo Go**.

## Alur Redux di Aplikasi Ini
`User menekan tombol -> dispatch(action) -> reducer di slice -> state baru di Store -> useSelector -> komponen re-render`

| Istilah | Di project ini |
| :--- | :--- |
| **Store** | `src/app/store.ts` (`configureStore`) |
| **Slice** | `diarySlice.ts` (state + reducer + action) |
| **Action** | `addDiary`, `editDiary`, `toggleFavorite`, `clearAllFavorites`, `deleteDiary`, `setFilter` |
| **Reducer** | fungsi di dalam `reducers: {}` pada `createSlice` |
| **Dispatch** | `useAppDispatch()` |
| **Selector** | `useAppSelector(selectEntries)`, `selectTotalDiary`, `selectTotalFavorite`, `selectEntryById` |
| **Provider** | `app/_layout.tsx` |

## Perbedaan Local State, Global Redux State, dan Persistent Database

| Aspek | Local State (`useState`) | Global State (Redux) | Persistent Database |
| :--- | :--- | :--- | :--- |
| **Lokasi data** | Di dalam satu komponen/screen | Di Redux Store (memori aplikasi) | Di server / penyimpanan permanen |
| **Cakupan** | Hanya komponen tersebut | Semua screen yang membutuhkan | Seluruh aplikasi dan semua pengguna/perangkat |
| **Bertahan setelah app di-restart?** | Tidak | Tidak (kembali ke `initialState`) | **Ya** |
| **Contoh di app ini** | Isi TextInput judul/isi/mood, kata kunci pencarian, filter mood | Daftar diary dan status favorite | Belum ada (rencana: MySQL/REST API) |

Redux **bukan database**: Store berada di memori, sehingga diary yang ditambahkan akan hilang saat aplikasi di-reload. Pada pertemuan berikutnya Redux akan menjadi state sisi client, sedangkan database menjadi penyimpanan persisten.

## Hooks yang Digunakan
| Hook | Kegunaan di project ini |
| :--- | :--- |
| `useState` | State lokal: isi form (Create/Edit), kata kunci pencarian, filter mood |
| `useEffect` | Debounce pencarian 350ms di `useDiarySearch` |
| `useMemo` | Hasil filter pencarian dan daftar favorite (`useLikedEntries`) |
| `useCallback` | Fungsi `openDetail` dan `handleReset` agar referensinya stabil |
| `useRef` | Fokus ke kolom pencarian saat tombol Reset ditekan |
| `useAppSelector` / `useAppDispatch` | Pengganti `useContext` dari Pertemuan 6 untuk membaca dan mengubah global state |
