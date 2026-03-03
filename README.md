<div align="center">

<img src="frontend/src/assets/Logo2.png" alt="Royal Property Finder Logo" width="120" />

# 🏰 Royal Property Finder

### Pakistan's Premium Real Estate Platform

_Find, list, and manage properties with confidence._

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](https://makeapullrequest.com)
[![Made with ❤️ in Pakistan](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20in-Pakistan-01411C?style=for-the-badge)](https://github.com)

</div>

---

<!--
## 📸 Screenshots

> _Post listings, manage your properties, and track orders — all in one dashboard._

<div align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="49%" />
  <img src="docs/screenshots/listings.png" alt="Listings" width="49%" />
</div>
-->

---

## ✨ Features

- 🏠 **Property Listings** — Post, edit, and delete your own property ads
- 🔍 **Smart Search** — Filter by city, type, status, and price range
- 📸 **Image Uploads** — Multi-image support for each property
- 🗺️ **Interactive Maps** — Leaflet-powered location picker with auto-geocoding
- 🔐 **Authentication** — JWT sessions + Google & Facebook OAuth
- 📊 **Seller Dashboard** — Stats, order history, and listing management
- 💰 **PKR Formatting** — Prices auto-displayed in Lakh / Crore / Arab
- 🌙 **Dark Mode** — Full dark/light theme support
- 📱 **Responsive** — Works on all screen sizes

---

## 🏗️ Tech Stack

### 🎨 Frontend

| Technology                                                                                                                       | Version | Purpose                         |
| -------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)](https://nextjs.org/)                                       | 16.1    | React framework with App Router |
| [![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)                             | 19      | UI library                      |
| [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) | 5       | Type safety                     |
| [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)   | 4       | Styling                         |
| [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)  | 2       | Global state management         |
| [![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)                        | 1       | HTTP client                     |
| [![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)                   | 1.9     | Interactive maps                |
| [![Lucide](https://img.shields.io/badge/Lucide_React-F56565?logo=lucide&logoColor=white)](https://lucide.dev/)                   | 0.56    | Icon system                     |
| [![Sonner](https://img.shields.io/badge/Sonner-000000?logo=react&logoColor=white)](https://sonner.emilkowal.ski/)                | 2       | Toast notifications             |

### ⚙️ Backend

| Technology                                                                                                                         | Version | Purpose               |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| [![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)                        | 18+     | Runtime               |
| [![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)                     | 5       | Web framework         |
| [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)   | 5       | Type safety           |
| [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)                   | 8       | Database              |
| [![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)                 | 8       | ODM                   |
| [![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?logo=passport&logoColor=white)](http://www.passportjs.org/)        | 0.7     | OAuth strategies      |
| [![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)                              | 9       | Auth tokens           |
| [![Zod](https://img.shields.io/badge/Zod-3068B7?logo=zod&logoColor=white)](https://zod.dev/)                                       | 4       | Schema validation     |
| [![Multer](https://img.shields.io/badge/Multer-FF6600?logo=node.js&logoColor=white)](https://github.com/expressjs/multer)          | 2       | File uploads          |
| [![Helmet](https://img.shields.io/badge/Helmet-000000?logo=helmet&logoColor=white)](https://helmetjs.github.io/)                   | 8       | HTTP security headers |
| [![bcryptjs](https://img.shields.io/badge/bcryptjs-003366?logo=letsencrypt&logoColor=white)](https://github.com/dcodeIO/bcrypt.js) | 3       | Password hashing      |

---

## 📁 Project Structure

```
RoyalPropertyFinder/
├── 📂 backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── middlewares/       # auth, error handling
│   │   │   └── routes/            # route registrations
│   │   ├── config/                # db, passport
│   │   ├── modules/
│   │   │   ├── auth/              # login, register, OAuth
│   │   │   ├── listing/           # CRUD for properties
│   │   │   └── user/              # user profile
│   │   └── shared/
│   │       ├── errors/            # AppError class
│   │       └── utils/             # catchAsync, multer
│   ├── uploads/                   # user-uploaded images (gitignored)
│   ├── .env.example               # ← copy to .env and fill values
│   └── package.json
│
├── 📂 frontend/
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   │   └── dashboard/         # all dashboard routes
│   │   ├── components/
│   │   │   ├── dashboard/         # listings, orders, settings
│   │   │   └── ui/                # shared UI components
│   │   ├── lib/                   # axios instance
│   │   ├── services/              # auth service
│   │   └── store/                 # Redux slices
│   ├── .env.example               # ← copy to .env.local and fill values
│   └── package.json
│
├── 📄 README.md
└── 🔒 .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [Download](https://nodejs.org/)
- **MongoDB** — [Local](https://www.mongodb.com/try/download/community) or [Atlas (free)](https://cloud.mongodb.com)
- **Git** — [Download](https://git-scm.com/)

### 1. Clone

```bash
git clone https://github.com/your-username/RoyalPropertyFinder.git
cd RoyalPropertyFinder
```

### 2. Backend

```bash
cd backend

# Copy env template and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Start development server (http://localhost:5000)
npm run dev
```

### 3. Frontend

```bash
cd frontend

# Copy env template and fill in your values
cp .env.example .env.local

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev
```

---

## 🔑 Environment Variables

### `backend/.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB (get from https://cloud.mongodb.com)
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_char_random_secret
JWT_EXPIRE=30d
SESSION_SECRET=your_64_char_random_secret

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Facebook OAuth (https://developers.facebook.com)
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

> ⚠️ **`.env` files are gitignored and must never be committed.**

---

## 📡 API Reference

| Method   | Endpoint                         | Auth | Description                 |
| -------- | -------------------------------- | ---- | --------------------------- |
| `POST`   | `/api/v1/auth/register`          | ❌   | Register new user           |
| `POST`   | `/api/v1/auth/login`             | ❌   | Login with email/password   |
| `POST`   | `/api/v1/auth/logout`            | ✅   | Logout                      |
| `GET`    | `/api/v1/auth/google`            | ❌   | Google OAuth                |
| `GET`    | `/api/v1/auth/facebook`          | ❌   | Facebook OAuth              |
| `GET`    | `/api/v1/listings`               | ❌   | Get all active listings     |
| `GET`    | `/api/v1/listings/:id`           | ❌   | Get single listing          |
| `GET`    | `/api/v1/listings/me/properties` | ✅   | Get my listings             |
| `POST`   | `/api/v1/listings`               | ✅   | Create listing (multipart)  |
| `PATCH`  | `/api/v1/listings/:id`           | ✅   | Update listing (owner only) |
| `DELETE` | `/api/v1/listings/:id`           | ✅   | Delete listing (owner only) |

---

## 🛡️ Security

- 🔒 All secrets stored in `.env` — **gitignored by default**
- 🪖 `helmet` sets secure HTTP headers on every response
- 🔑 Passwords hashed with `bcryptjs` (salt rounds: 12)
- 🎫 JWT tokens expire after 30 days
- 🛂 All protected routes verify token via `auth.middleware`
- 📁 Uploaded files stored server-side — never re-served with executable permissions
- ✅ Input validated with `Zod` schema before any DB operation

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Muhammad Awais**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/muhmmadawaistech)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:muhmmadawaistech@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ in Pakistan 🇵🇰

⭐ Star this repo if you find it useful!

</div>
