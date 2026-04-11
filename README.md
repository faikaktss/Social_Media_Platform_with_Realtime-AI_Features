<!-- ========================= -->
<!--  Social Media + Realtime AI README -->
<!-- ========================= -->

<div align="center">

# 🌐 Social_Media_Platform_with_Realtime-AI_Features

**Gerçek zamanlı etkileşim + AI destekli özellikler sunan sosyal medya platformu (Node.js/Express + PostgreSQL + Prisma).**  
Docker ile hızlı kurulum; JWT auth, post/like/comment/follow ve Swagger API dokümantasyonu içerir.

<p>
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/DB-PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

</div>

---

## 📌 Proje Özeti

Bu repo, **Instagram-benzeri** bir sosyal medya backend’i sağlar:
- 🔐 **Kimlik doğrulama (JWT)** ve rate-limit korumaları
- 👤 Kullanıcı profili yönetimi
- 🖼️ Post oluşturma + görsel yükleme (uploads klasörü)
- ❤️ Like / 💬 Comment / ➕ Follow / 📰 Feed akışı
- 📚 Swagger UI ile API dokümantasyonu
- 🐳 Docker Compose ile **PostgreSQL + Backend** birlikte çalışır

---

## 🧭 İçindekiler
- [✨ Özellikler](#-özellikler)
- [📦 Teknoloji Yığını](#-teknoloji-yığını)
- [📂 Repo Yapısı](#-repo-yapısı)
- [🚀 Docker ile Çalıştırma (Önerilen)](#-docker-ile-çalıştırma-önerilen)
- [⚙️ Yerel Çalıştırma (Docker’sız)](#️-yerel-çalıştırma-dockersız)
- [🗃️ Veritabanı (Prisma)](#️-veritabanı-prisma)
- [📚 API Dokümantasyonu (Swagger)](#-api-dokümantasyonu-swagger)
- [🧪 Test](#-test)
- [🧯 Sorun Giderme](#-sorun-giderme)

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 🔐 Auth | JWT ile login/register ve güvenlik katmanları |
| 🛡️ Güvenlik | `helmet`, request body limit (10kb), rate-limit |
| 🧼 Basit sanitizasyon | Body/params için temel XSS/$ temizleme |
| 🖼️ Uploads | `/uploads` statik servis edilir |
| 🧩 Modüler yapı | routes/controllers/services/repositories ayrımı |
| 📚 Swagger | `/api-docs` üzerinde API dokümantasyonu |
| 🗄️ Prisma + Postgres | Veri modeli + migration altyapısı |

---

## 📦 Teknoloji Yığını

- **Node.js + Express**
- **PostgreSQL**
- **Prisma ORM** (`@prisma/client`, `prisma`)
- Güvenlik & altyapı:
  - `helmet`, `cors`, `express-rate-limit`
  - `dotenv`
  - `joi` (validation)
  - `bcrypt` (şifre hash)
  - `swagger-jsdoc`, `swagger-ui-express`
- Medya işleme:
  - `multer` (upload)
  - `sharp` (image processing)
  - `cloudinary` (opsiyonel/entegrasyon)

---

## 📂 Repo Yapısı

Kök:
- `docker-compose.yml` → Postgres + backend servisleri
- `package.json` → bağımlılıklar & test script
- `backend/` → backend kaynak kodları

`backend/`:
- `Dockerfile` → backend container build
- `server.js` → app’i ayağa kaldırır
- `src/app.js` → express app ve route mount’ları
- `src/routes/` → `auth`, `users`, `posts`, `likes`, `comments`, `follow`, `feed`
- `src/controllers/` → request handler’lar
- `src/services/` → iş mantığı
- `src/repositories/` → veri erişim katmanı
- `src/middlewares/` → error handler vb.
- `src/config/` → swagger config vb.
- `prisma/schema.prisma` → DB modelleri
- `tests/` → backend testleri

---

## 🚀 Docker ile Çalıştırma (Önerilen)

Compose dosyası iki servis başlatır:
- `postgres` (port: **5433 → 5432**)
- `backend` (port: **3000**)

### 1) Başlat
```bash
docker compose up --build
```

### 2) Uygulamayı aç
- Backend: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- Uploads: `http://localhost:3000/uploads`

> Compose içinde `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT` environment olarak verilir. Varsayılanlar compose dosyasında tanımlı.

---

## ⚙️ Yerel Çalıştırma (Docker’sız)

> DB’yi ayrıca çalıştırman gerekir (PostgreSQL).

```bash
npm install
# (prisma generate gerekebilir)
npx prisma generate

node backend/server.js
```

Varsayılan port:
- `PORT=3000` (tanımlı değilse 3000)

---

## 🗃️ Veritabanı (Prisma)

Prisma datasource:
- Provider: `postgresql`
- URL: `DATABASE_URL` env değişkeninden okunur

### Modeller (schema.prisma)
- `User`
- `Post`
- `Like`
- `Comment`
- `Follow`

> İlişkiler: kullanıcı-post, post-like, post-comment, takipçi/takip edilen (Follow) ilişkileri tanımlı ve bazı index/unique kısıtları mevcut.

---

## 📚 API Dokümantasyonu (Swagger)

Swagger endpoint:
- `GET /api-docs`

Bu sayfa üzerinden:
- endpoint’leri görebilir
- request/response örneklerini inceleyebilir
- (varsa) auth header ile denemeler yapabilirsin

---

## 🧪 Test

`package.json` içindeki test script:
```bash
npm test
```

> Test komutu `NODE_ENV=test npx jest --forceExit` şeklinde çalışır.

---

## 🧯 Sorun Giderme

### 1) Postgres bağlantısı yok
- Docker compose çalışıyor mu kontrol et:
  ```bash
  docker compose ps
  ```
- DB portu: **5433** (host) → 5432 (container)

### 2) Prisma generate / client hatası
- Container içinde zaten `npx prisma generate` çalışıyor.
- Yerelde çalıştırıyorsan:
  ```bash
  npx prisma generate
  ```

### 3) Upload klasörü izin/kalıcılık
- Compose `uploads_data` volume kullanıyor; container restart sonrası dosyalar korunur.

---

## ✅ Hızlı Başlangıç (Cheat Sheet)

```bash
docker compose up --build
# sonra:
# http://localhost:3000
# http://localhost:3000/api-docs
```
