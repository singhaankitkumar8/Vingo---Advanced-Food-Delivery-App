# 🍔 ReelBites — Advanced Food Delivery Platform

ReelBites is a full-stack **MERN-based food delivery application** that blends modern food ordering with social media-style engagement. It allows restaurant owners to manage listings, users to explore food through reels, and delivery partners to handle logistics efficiently.

---

## 🚀 Features

### 👤 User Features

* 🔐 Authentication (JWT + Google Auth)
* 🎥 Watch food reels (like Instagram Reels)
* ❤️ Like, 💬 comment, 🔖 save reels
* 🔍 Location-based food search
* 🛒 Order food items
* 📦 Real-time delivery tracking
* 🔑 OTP-based secure delivery confirmation

  ### 💳 Payment Options
- 💰 **Cash on Delivery (COD)** — Pay at the time of delivery
- 💳 **Online Payment via Razorpay**
  - Secure checkout
  - Supports UPI, Cards, Net Banking, Wallets
  - Fast and reliable transactions


---

### 🏪 Restaurant Owner (Admin)

* 🏨 Register and manage hotels/restaurants
* 🍽️ Add, update, delete food items
* 🎬 Upload food reels for promotion
* 📊 Manage orders
* 🚚 Assign delivery partners

---

### 🚴 Delivery Partner

* 📦 Accept/reject delivery requests
* 🗺️ View assigned deliveries
* 📊 Dashboard with delivery statistics
* 🔐 OTP verification before delivery completion

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* Axios
* Firebase (Google Authentication)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cloudinary (Media Uploads)

### Payment Integration
- Razorpay (Online Payments)
- COD (Cash Handling System)

### Other Tools

* Vercel (Frontend Deployment)
* Render (Backend Deployment)
* Resend / Nodemailer (Email Service)

---

## 📁 Project Structure

```
Vingo/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

---

## 🔐 Authentication Flow

* Email/Password login with JWT stored in HTTP-only cookies
* Google Authentication using Firebase
* Secure backend verification with token

---

## 📦 API Endpoints

### Auth Routes

* `POST /api/auth/signup`
* `POST /api/auth/signin`
* `POST /api/auth/googleauth`
* `POST /api/auth/logout`

### User Routes

* `GET /api/user/current`
* `PUT /api/user/update`

### Food & Reels

* `POST /api/reels/add`
* `GET /api/reels/all`
* `POST /api/reels/like`
* `POST /api/reels/comment`

### Orders

* `POST /api/order/create`
* `GET /api/order/user`
* `PUT /api/order/status`

### Delivery

* `GET /api/delivery/orders`
* `PUT /api/delivery/accept`
* `POST /api/delivery/verify-otp`

---

## ⚙️ Environment Variables

### Backend (.env)

```
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

EMAIL=your_email
EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Frontend (.env)

```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🧪 Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/vingo.git
cd vingo
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

### Frontend

* Deploy on **Vercel**

### Backend

* Deploy on **Render**

---

## 🔥 Key Highlights

* 📱 Social-media-style food discovery (Reels)
* 📍 Location-based intelligent search
* 🔐 Secure OTP delivery system
* ⚡ Scalable MERN architecture
* 🌐 Fully deployed cloud-based system

---

## 📸 Future Enhancements

* 💳 Online payments (Stripe/Razorpay)
* 🤖 AI-based food recommendations
* 📡 Real-time tracking with WebSockets
* 🌎 Multi-language support

---

## 👨‍💻 Author

**Ankit Kumar Singha**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🛠️ Contribute

---

## 📜 License

This project is licensed under the MIT License.
