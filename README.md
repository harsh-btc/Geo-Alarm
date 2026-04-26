# 📍 GeoAlarm — Location-Based Alarm System

A full-stack web application that triggers alarms when you **enter a location**, not at a fixed time.

![GeoAlarm Banner](https://via.placeholder.com/1200x400/080c14/00d4ff?text=GeoAlarm+%E2%80%94+Location+Alarms)

---

## ✨ Features

- 🗺️ **Interactive map** — Click on Leaflet map to set alarm locations
- 📡 **Live GPS tracking** — `watchPosition` continuously monitors your location
- 📐 **Haversine distance** — Precise great-circle distance calculation
- 🔔 **5 alarm sounds** — Web Audio API, no external files needed
- 🖥️ **Browser notifications** — Native OS notifications on arrival
- 🌗 **Dark / Light mode** — Persistent theme toggle
- 🔐 **JWT auth** — Register, login, protected routes
- 📋 **Alarm history** — Full log of every trigger
- ⚡ **Stats dashboard** — Active alarms, trigger count, proximity bars
- 📱 **Fully responsive** — Works on mobile & desktop

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Map | Leaflet + react-leaflet |
| Notifications | react-hot-toast |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |

---

## 📁 Project Structure

```
geoalarm/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   └── alarmController.js  # CRUD + trigger + history
│   ├── middleware/
│   │   ├── auth.js             # JWT verify
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validate.js         # Input validation chains
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Alarm.js            # Alarm schema
│   │   └── AlarmHistory.js     # History log schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   └── alarms.js           # /api/alarms/*
│   ├── server.js               # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js        # Axios instance + interceptors
│   │   │   ├── auth.js         # Auth API calls
│   │   │   └── alarms.js       # Alarm API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── MapPicker.jsx   # Click-to-set map
│   │   │   ├── TrackingMap.jsx # Live tracking map
│   │   │   ├── AlarmCard.jsx   # Alarm tile with proximity bar
│   │   │   └── AddAlarmModal.jsx # 2-step alarm creation wizard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useGeolocation.js   # watchPosition hook
│   │   │   └── useAlarmTrigger.js  # Haversine + sound + notify
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── History.jsx
│   │   ├── utils/
│   │   │   └── haversine.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/geoalarm?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_minimum_32_chars
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Getting your MongoDB URI (Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up free
2. Create a **Free Tier** cluster (M0)
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add your IP or `0.0.0.0/0` for all IPs
5. Click **Connect → Connect your application** and copy the URI
6. Replace `<username>` and `<password>` with your credentials

---

## 🚀 Running Locally

### Prerequisites

- Node.js v18+ 
- npm v9+
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/geoalarm.git
cd geoalarm
```

### 2. Setup backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

The API will start at: `http://localhost:5000`

### 3. Setup frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will open at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Alarm Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/alarms` | Get all user alarms | ✅ |
| POST | `/api/alarms` | Create alarm | ✅ |
| PUT | `/api/alarms/:id` | Update alarm | ✅ |
| DELETE | `/api/alarms/:id` | Delete alarm | ✅ |
| POST | `/api/alarms/:id/trigger` | Record trigger | ✅ |
| GET | `/api/alarms/history` | Get trigger history | ✅ |

---

## 🗺️ How Alarms Work

1. **Set** — User clicks on map → selects radius (50m–2km)
2. **Track** — Click "Start Tracking" on dashboard → browser asks for GPS permission
3. **Calculate** — Every GPS update runs the Haversine formula against all active alarms
4. **Trigger** — If `distance ≤ radius`:
   - 🔊 Web Audio API plays selected sound
   - 🔔 Browser notification fires (if permitted)
   - 🟢 Toast popup appears on screen
   - 📋 Trigger logged to history with 5-minute cooldown
5. **Log** — Backend records trigger count, timestamp, and history entry

### Haversine Formula
```
a = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)
c = 2·atan2(√a, √(1−a))
d = R·c  (R = 6,371,000 meters)
```

---

## 🛡️ Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens expire in 30 days
- All alarm routes require `Authorization: Bearer <token>`
- Input validated with **express-validator** on every endpoint
- Duplicate emails prevented at both schema and controller level
- Sensitive fields (password) excluded from all responses with `select: false`
- CORS restricted to `CLIENT_URL`

---

## 🚢 Deployment

### Backend (Railway / Render)
1. Push `backend/` to GitHub
2. Create a new service on Railway or Render
3. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV=production`)
4. Deploy — the `start` script runs `node server.js`

### Frontend (Vercel / Netlify)
1. Push `frontend/` to GitHub
2. Create a project on Vercel or Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Update `vite.config.js` proxy target to your deployed backend URL
   (or use `VITE_API_URL` env variable)

---

## 📱 Browser Support

| Feature | Requirement |
|---------|------------|
| Geolocation | All modern browsers (HTTPS required in production) |
| Web Audio API | All modern browsers |
| Notifications API | Chrome, Firefox, Edge, Safari 16.4+ |

> ⚠️ **Note:** Geolocation requires **HTTPS** in production. On localhost, it works over HTTP.

---

## 📝 License

MIT © 2024 GeoAlarm
