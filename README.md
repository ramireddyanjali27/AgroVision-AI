# 🌱 AgroVision AI

**Smart Fruit & Vegetable Disease Detection and Treatment Recommendation System**

AgroVision AI is a full-stack web application that helps farmers, gardeners, and agricultural users identify diseases affecting fruits, vegetables, and plant leaves by uploading an image.

The system analyzes the image and provides the plant/fruit name, disease name, description, confidence percentage, severity level, possible causes, treatment recommendations, prevention tips, and stores a full detection history.

---

## ✨ Features

- 🔐 **Authentication & Roles** — User registration/login with JWT, password encryption (BCrypt), protected routes, role-based authorization (USER / ADMIN).
- 📸 **Image Detection** — Drag-and-drop upload with preview, validation (JPG/JPEG/PNG, max 10MB), and loading animation.
- 🤖 **AI Disease Detection** — Detects whether a plant is **Healthy** or **Diseased**, with confidence & severity.
- 💊 **Treatment Recommendations** — Numbered, actionable rectification steps.
- 🌱 **Prevention Tips** — Recommendations to protect future crops.
- 📊 **Detection History** — Full history with thumbnails, view-details and delete.
- 👨‍💼 **Admin Dashboard** — Statistics, user management, disease management (CRUD), recent uploads.
- 🎨 **Modern Responsive UI** — Professional agriculture + AI theme.

---

## 🛠️ Technology Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Frontend       | React.js, JavaScript, HTML5, CSS3, React Router, Axios, Vite |
| Backend        | Java 21, Spring Boot, Spring Web, Spring Data JPA, Spring Security, JWT, Maven |
| Database       | MySQL                                              |
| AI Service     | Python, FastAPI (TensorFlow / PyTorch ready)       |

---

## 📁 Project Structure

```text
AgroVision-AI/
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── services/         # API client & service layer
│   │   ├── context/          # Auth context
│   │   ├── assets/           # Global styles
│   │   └── App.jsx           # App entry & routing
│   └── package.json
│
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/agrovision/
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic
│   │   ├── repository/       # Spring Data repositories
│   │   ├── entity/           # JPA entities
│   │   ├── dto/              # Data transfer objects
│   │   ├── config/           # Security / web / data seeding
│   │   ├── security/         # JWT filter & service
│   │   └── exception/        # Global exception handling
│   └── pom.xml
│
├── ai-service/               # Python FastAPI AI service
│   ├── app/
│   │   ├── main.py           # FastAPI endpoints
│   │   └── predictor/        # Mock (and future real) predictors
│   ├── models/               # Place trained models here
│   └── requirements.txt
│
├── database/
│   └── schema.sql            # Manual MySQL schema (optional)
│
└── README.md
```

---

## 🏗️ How the AI Pipeline Works

```text
React (image upload)
   ↓  POST /api/detection/analyze
Spring Boot API
   ↓
AI Service API (FastAPI at :8000)
   ↓
TensorFlow / PyTorch Model
   ↓
Disease Prediction (JSON)
```

For the initial version, a **realistic mock prediction service** is included so the whole system runs **without** a trained model. The mock uses a deterministic hash of the uploaded file to produce stable, realistic results across a catalog of common plant diseases.

### Swapping in a real AI model

1. In `ai-service/app/predictor/`, add a class implementing `predict(image_bytes) -> dict` (e.g. `TensorFlowPredictor` / `PyTorchPredictor`).
2. Place your weights (`.h5` / `.pt`) in `ai-service/models/`.
3. In `ai-service/app/main.py`, replace `MockPredictor()` with your real predictor.
4. Install the ML framework in `requirements.txt` (commented placeholders included).

The Spring Boot backend calls the AI service and, if it is unreachable, **gracefully falls back** to its own embedded mock prediction so the app always works end-to-end.

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** (JDK)
- **Maven 3.8+** (or use the included Maven wrapper)
- **Node.js 18+** and npm
- **Python 3.9+** (for the AI service — optional for mock mode)
- **MySQL 8+**

---

### 1. Database Setup

Create the database (the app creates tables automatically via JPA):

```sql
CREATE DATABASE IF NOT EXISTS agrovision CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the provided script:

```bash
mysql -u root -p < database/schema.sql
```

---

### 2. Backend (Spring Boot)

```bash
cd backend

# Configure environment (optional - defaults are in application.properties)
# Copy backend/.env.example and set MYSQL_USER / MYSQL_PASSWORD, JWT_SECRET etc.

# Run using Maven (installed)
mvn spring-boot:run

# OR using the Maven wrapper
./mvnw spring-boot:run
```

The backend starts at **http://localhost:8080**.

> **Default admin account** (auto-seeded on first run):
> - Email: `admin@agrovision.com`
> - Password: `admin123`

---

### 3. AI Service (FastAPI) — optional but recommended

```bash
cd ai-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The AI service starts at **http://localhost:8000**. If you skip this step, the backend falls back to its built-in mock prediction.

---

### 4. Frontend (React)

```bash
cd frontend

# Copy env example (optional)
copy .env.example .env

npm install
npm run dev
```

The frontend starts at **http://localhost:5173**. The Vite dev server proxies `/api` and `/uploads` to the backend, so everything works out of the box.

> **Note:** For the dev server, `VITE_API_URL` in the frontend `.env` is not required to make requests work (the proxy handles them). It is only used for production builds where you may point directly at the backend origin.

---

## 🔗 REST API Endpoints

### Authentication
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| POST   | `/api/auth/register`      | Register a user   |
| POST   | `/api/auth/login`         | Login, get JWT    |

### Disease Detection (authenticated)
| Method | Endpoint                    | Description               |
|--------|------------------------------|---------------------------|
| POST   | `/api/detection/analyze`     | Upload image & analyze    |
| GET    | `/api/detection/history`     | Detection history         |
| GET    | `/api/detection/{id}`        | Single detection detail   |
| DELETE | `/api/detection/{id}`        | Delete detection          |

### Admin (authenticated, ADMIN role)
| Method | Endpoint                          | Description                 |
|--------|-----------------------------------|-----------------------------|
| GET    | `/api/admin/statistics`           | Platform statistics         |
| GET    | `/api/admin/users`                | List/search users           |
| DELETE | `/api/admin/users/{id}`           | Delete a user               |
| GET    | `/api/admin/recent-detections`    | Recent uploads              |
| GET    | `/api/admin/diseases`             | List diseases               |
| GET    | `/api/admin/diseases/{id}`        | Disease detail              |
| POST   | `/api/admin/diseases`             | Create disease              |
| PUT    | `/api/admin/diseases/{id}`        | Update disease              |
| DELETE | `/api/admin/diseases/{id}`        | Delete disease              |

---

## 🔐 Environment Variables

Environment variables are read by the backend from `application.properties` (with sensible defaults). Create a local `.env` or set them in your shell — see `backend/.env.example`.

| Variable          | Default                                     | Purpose                        |
|-------------------|---------------------------------------------|--------------------------------|
| `MYSQL_HOST`      | `localhost`                                 | Database host                  |
| `MYSQL_PORT`      | `3306`                                      | Database port                  |
| `MYSQL_DB`        | `agrovision`                                | Database name                  |
| `MYSQL_USER`      | `root`                                      | Database user                  |
| `MYSQL_PASSWORD`  | `root`                                      | Database password              |
| `JWT_SECRET`      | (development secret)                        | JWT signing key                |
| `AI_SERVICE_URL`  | `http://localhost:8000`                     | Python AI service URL          |
| `UPLOAD_DIR`      | `./uploads`                                 | Where uploaded images are kept |

> ⚠️ **Security:** Never commit real secrets. The `JWT_SECRET` shown is a development placeholder — replace it with a long, random value in production.

---

## ✔️ What's Included

- ✅ Complete, functional React frontend (no placeholder pages)
- ✅ Complete, layered Spring Boot backend
- ✅ JWT authentication with role-based authorization
- ✅ Image upload + disease detection flow
- ✅ Detection history (view & delete)
- ✅ User dashboard with statistics
- ✅ Admin dashboard (stats, users, disease CRUD)
- ✅ MySQL schema
- ✅ Mock AI detection service (FastAPI) + graceful backend fallback
- ✅ Global error handling & validation
- ✅ Responsive, professional UI with loading/error/empty states
- ✅ `.env.example` files & complete README

---

## 🧪 Running the Full Stack

Open three terminals:

```bash
# Terminal 1 — Backend
cd backend && mvn spring-boot:run

# Terminal 2 — AI Service (optional)
cd ai-service && uvicorn app.main:app --reload --port 8000

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Then open **http://localhost:5173**.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request for improvements, especially integrating a real trained disease-detection model.

---

## ⚠️ Disclaimer

Detection results are generated using AI and should be used as guidance only. For serious crop problems, consult a qualified agricultural expert.

---

© 2026 AgroVision AI · Built for farmers & gardeners
