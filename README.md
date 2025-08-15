# Proyek Chatbot Survei Percakapan Wisatawan Nusantara (Wisnus)

Selamat datang di repositori Proyek Chatbot Survei Percakapan Wisnus. Proyek ini adalah aplikasi web yang dirancang untuk melakukan survei kepada wisatawan nusantara melalui antarmuka chatbot yang interaktif dan menarik. Aplikasi ini dibangun dengan arsitektur modern yang memisahkan antara frontend dan backend.

## 📝 Deskripsi Proyek

Tujuan utama dari proyek ini adalah untuk menggantikan metode survei tradisional yang seringkali kaku dan membosankan dengan pengalaman yang lebih dinamis dan personal. Chatbot akan memandu pengguna melalui serangkaian pertanyaan survei dengan cara yang terasa seperti percakapan alami, sehingga diharapkan dapat meningkatkan tingkat partisipasi dan kualitas data yang terkumpul.

## ✨ Fitur Utama

- **Antarmuka Chat Interaktif**: Pengalaman mengisi survei yang modern dan ramah pengguna.
- **Alur Percakapan Dinamis**: Pertanyaan yang diajukan dapat beradaptasi berdasarkan jawaban pengguna sebelumnya.
- **Autentikasi Pengguna**: Sistem login untuk memastikan keamanan dan integritas data.
- **Manajemen Sesi**: Pengguna dapat melanjutkan survei yang belum selesai.
- **Analitik & Visualisasi**: (Fitur dalam pengembangan) Dasbor untuk melihat hasil survei secara agregat.

## 🛠️ Tumpukan Teknologi

Proyek ini dibagi menjadi dua bagian utama: frontend dan backend.

### Frontend (`wisnus-chatbot-survey`)

- **Framework**: [Next.js](https://nextjs.org/) (React Framework)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Manajemen State**: React Context API

### Backend (`backend-conversational-survey`)

- **Framework**: [Express.js](https://expressjs.com/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) dengan [Mongoose](https://mongoosejs.com/) ODM
- **Autentikasi**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **AI & NLP**: [LangChain](https://www.langchain.com/) dengan model dari [Google Gemini](https://ai.google.dev/) & [OpenAI](https://openai.com/)

## 🚀 Memulai Proyek Secara Lokal

Untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda, ikuti langkah-langkah di bawah ini.

### 1. Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di mesin Anda:
- [Node.js](https://nodejs.org/en/) (v18 atau lebih baru direkomendasikan)
- [npm](https://www.npmjs.com/) atau [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Akses ke cluster MongoDB (lokal atau cloud seperti MongoDB Atlas)

### 2. Kloning Repositori

Kloning kedua repositori (frontend dan backend) ke direktori lokal Anda.

```bash
# Kloning Frontend
git clone [URL_REPOSITORI_FRONTEND]
cd wisnus-chatbot-survey

# Kloning Backend
git clone [URL_REPOSITORI_BACKEND]
cd backend-conversational-survey
```

### 3. Konfigurasi Backend

- Masuk ke direktori `backend-conversational-survey`.
- Salin file `.env.example` menjadi `.env` dan isi variabel lingkungan yang diperlukan, seperti koneksi database MongoDB dan kunci API untuk layanan AI.
- Instal dependensi:
  ```bash
  npm install
  ```
- Jalankan server backend:
  ```bash
  npm run dev
  ```

Server backend akan berjalan di port yang ditentukan dalam file `.env` Anda (misalnya, `http://localhost:5000`).

### 4. Konfigurasi Frontend

- Masuk ke direktori `wisnus-chatbot-survey`.
- Salin file `.env.example` menjadi `.env` dan atur `NEXT_PUBLIC_API_URL` agar menunjuk ke alamat server backend Anda.
- Instal dependensi:
  ```bash
  npm install
  ```
- Jalankan server pengembangan frontend:
  ```bash
  npm run dev
  ```

Aplikasi frontend akan dapat diakses di `http://localhost:3000`.
