# 🛒 E-Commerce Application

A production-grade full-stack e-commerce platform built with the **MERN stack**, featuring secure payments, an AI-powered shopping assistant, product comparison, a comprehensive admin dashboard, and a complete **DevOps pipeline** with Docker, Kubernetes, and Jenkins CI/CD.

🌐 **Live Demo:** [ecommerce-five-rose-77.vercel.app](https://ecommerce-lrhxwiaa8-hemalekhar23cse-4570s-projects.vercel.app/)
&nbsp;&nbsp;|&nbsp;&nbsp;
📁 **GitHub:** [github.com/hemalekha28/ecommerce](https://github.com/hemalekha28/ecommerce)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [DevOps & Deployment](#-devops--deployment)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 👤 User Features
- **Authentication** — JWT-based register/login with bcrypt password hashing and token expiry checking
- **Product Catalog** — Browse products with category filters, search, and sorting
- **Product Comparison** — Side-by-side comparison of multiple products
- **Wishlist** — Save products for later
- **Cart** — Persistent cart with guest-to-user sync on login
- **Secure Checkout** — Razorpay payment integration with server-side HMAC-SHA256 signature verification
- **Order Tracking** — Track order status lifecycle (Pending → Processing → Shipped → Delivered)
- **Verified Reviews** — Leave reviews only on products you have ordered (enforced at database level)
- **AI Chatbot** — OpenAI-powered shopping assistant with live order and product context injection
- **Email Notifications** — Order confirmation emails via Nodemailer/SMTP

### 🛠️ Admin Features
- **Admin Dashboard** — Revenue by month, sales by category, top products and top-spending users
- **Product Management** — Create, update, delete products with image upload (Multer)
- **Order Management** — View and update order status across all users
- **User Management** — View and manage all registered users
- **Analytics** — Built on MongoDB aggregation pipelines (`$lookup`, `$group`, `$sort`)

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router DOM v7 | Client-side routing with role-based route trees |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP client with JWT interceptor |
| Chart.js / ApexCharts / Recharts | Admin analytics charts |
| Framer Motion | UI animations |
| React Context API | Global state (Auth, Cart, Wishlist, Compare, Notifications) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Token (JWT) | Authentication and authorisation |
| bcryptjs | Password hashing |
| Razorpay | Payment gateway with HMAC-SHA256 verification |
| OpenAI API | AI shopping assistant |
| Nodemailer | Transactional emails |
| Multer | Image/file uploads |
| express-validator | Request validation |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerisation (multi-stage build for frontend) |
| Docker Compose | Local integration testing environment |
| Kubernetes | Production orchestration (Deployments, StatefulSet, HPA) |
| Jenkins | CI/CD pipeline automation |
| Slack / Email | Build status notifications |

---

## 🏗️ Architecture

```
Browser
  │
  ▼
React + Vite (Nginx)          ← Frontend container
  │   (REST API calls + JWT)
  ▼
Express API (Node.js)         ← Backend container (2–10 pods via HPA)
  │
  ├── MongoDB (StatefulSet)   ← Persistent volume (PVC 1Gi)
  ├── Razorpay API            ← Payment gateway
  ├── OpenAI API              ← AI chatbot
  └── SMTP (Nodemailer)       ← Email notifications
```

### CI/CD Pipeline (Jenkins)

```
[Code Push]
    │
    ▼
Clone Repository
    │
    ▼
Build API Docker Image
    │
    ▼
docker-compose up → Run Tests → docker-compose down
    │
    ▼  (only if tests pass)
Build Frontend Docker Image
    │
    ▼
kubectl apply -f k8s/
    │
    ▼
kubectl rollout status (verify deployment)
    │
    ├── ✅ Success → Slack notification
    └── ❌ Failure → Email + Slack alert
```

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── config.js           # Environment config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── userController.js
│   │   └── chatbotController.js
│   ├── middlewares/
│   │   ├── auth.js             # JWT protect + admin role check
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   ├── reviews.js
│   │   ├── analytics.js
│   │   ├── chatbot.js
│   │   ├── payment.routes.js
│   │   └── users.js
│   ├── utils/
│   │   └── seedData.js
│   ├── Dockerfile
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── authContext.jsx
│   │   │   ├── cartContext.jsx
│   │   │   ├── notificationContext.jsx
│   │   │   ├── compareContext.jsx
│   │   │   └── wishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx  (via context)
│   │   │   ├── Checkout.jsx
│   │   │   ├── WishList.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── utils/
│   │   │   └── api.jsx          # Shared Axios instance with JWT interceptor
│   │   └── App.jsx              # Role-based routing
│   ├── nginx.conf
│   └── Dockerfile               # Multi-stage build
│
├── k8s/
│   ├── api-deployment.yaml      # API Deployment + ClusterIP Service
│   ├── frontend-deployment.yaml # Frontend Deployment + NodePort Service
│   ├── mongodb-statefulset.yaml # MongoDB StatefulSet + Headless Service + PVC
│   └── hpa.yaml                 # HorizontalPodAutoscaler (2–10 pods, 50% CPU)
│
├── docker-compose.yml
└── Jenkinsfile
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas URI)
- Docker (optional, for containerised setup)

### 1. Clone the repository

```bash
git clone https://github.com/hemalekha28/ecommerce.git
cd ecommerce
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
MONGODB_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

OPENAI_API_KEY=your_openai_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=your_email@gmail.com
```

```bash
npm run dev        # Start dev server (nodemon)
npm run seed       # Seed sample products into DB
npm test           # Run Jest tests
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
```

### 4. Run with Docker Compose (recommended)

```bash
# From the root directory
docker-compose up --build
```

This starts all three services (MongoDB, Backend, Frontend) on a shared bridge network.

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (used for HMAC-SHA256 verification) |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |
| `OPENAI_API_KEY` | OpenAI API key for chatbot |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP login email |
| `SMTP_PASS` | SMTP app password |
| `MAIL_FROM` | Sender email address |
| `VITE_API_URL` | Backend API base URL (frontend) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key for frontend checkout widget |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Cart
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/cart` | User |
| POST | `/api/cart` | User |
| DELETE | `/api/cart/:itemId` | User |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | User |
| GET | `/api/orders/myorders` | User |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

### Payments
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/payments/create-order` | User |
| POST | `/api/payments/verify` | User |

### Analytics
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/analytics/revenue` | Admin |
| GET | `/api/analytics/category` | Admin |
| GET | `/api/analytics/top-products` | Admin |
| GET | `/api/analytics/top-users` | Admin |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews` | User (verified purchase) |
| GET | `/api/reviews/:productId` | Public |

### Chatbot
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/chatbot` | User |

---

## ⚙️ DevOps & Deployment

### Docker

**Backend** — single-stage Node.js image:
```bash
docker build -t mern-api ./backend
```

**Frontend** — multi-stage build (Node builds, Nginx serves):
```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t mern-frontend ./frontend
```

### Kubernetes

```bash
# Create secrets from environment values
kubectl create secret generic mern-secrets \
  --from-literal=MONGODB_URI=<your_uri> \
  --from-literal=JWT_SECRET=<your_secret> \
  --dry-run=client -o yaml | kubectl apply -f -

# Deploy all manifests
kubectl apply -f k8s/

# Verify rollout
kubectl rollout status deployment/mern-api
kubectl rollout status deployment/mern-frontend
```

**What gets deployed:**

| Manifest | Type | Details |
|---|---|---|
| `api-deployment.yaml` | Deployment + ClusterIP Service | 2 replicas, reads secrets from `mern-secrets` |
| `frontend-deployment.yaml` | Deployment + NodePort Service | 1 replica, exposed on port 30007 |
| `mongodb-statefulset.yaml` | StatefulSet + Headless Service | 1 replica, PVC 1Gi (`ReadWriteOnce`) |
| `hpa.yaml` | HorizontalPodAutoscaler | Scales API 2–10 pods at 50% CPU |

### Jenkins Pipeline

The `Jenkinsfile` automates the full CI/CD flow:

1. **Clone** — pulls latest code
2. **Build API** — builds backend Docker image
3. **Test** — spins up `docker-compose`, runs Jest tests inside container, tears down
4. **Build Frontend** — builds frontend image (only if tests pass)
5. **Deploy** — applies all Kubernetes manifests, verifies rollout with `kubectl rollout status`
6. **Notify** — Slack on success, Email + Slack on failure

Secrets (`MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) are stored as Jenkins Credentials and injected at pipeline runtime — never hardcoded.

---

## 🗃️ Database Schema

### Collections & Relationships

```
User ──────┬── owns ──────── Cart
           ├── places ─────── Order ──── includes ─── Product
           └── writes ─────── Review ──── verifies ─── Order
                              └── references ────────── Product
```

**Key design decisions:**
- Cart and Order line items **denormalise** product name/price/image at time of addition — historical orders don't change if product prices are later updated
- Reviews enforce **compound unique index** on `(user, product, order)` — verified purchase constraint at the database level, not the application layer
- MongoDB StatefulSet uses a **PersistentVolumeClaim** — data survives pod restarts in Kubernetes

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/hemalekha28">Hemalekha</a></p>
