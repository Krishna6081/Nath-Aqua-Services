# Nath Water Service - Commercial Mobile Application & Backend System

**Nath Water Service** is a full-stack, enterprise-grade water supply and delivery management system built for Android & iOS using React Native (Expo), Redux Toolkit, React Navigation, React Native Paper (Material Design 3), SQLite offline engine, Expo Notifications, Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

---

## Technical Stack

### Frontend (Mobile App)
- **Framework**: React Native (Expo) with TypeScript
- **State Management**: Redux Toolkit (Thunks, Slices)
- **UI & Design**: React Native Paper (Material Design 3 Light/Dark modes), Vector Icons
- **Navigation**: React Navigation (Native Stack + 5-Tab Bottom Navigator)
- **Offline Storage**: SQLite (`expo-sqlite`) with automatic caching & synchronization
- **Notifications**: Expo Notifications
- **Form Validation**: React Hook Form + Yup Validation

### Backend (REST API)
- **Runtime**: Node.js + Express.js with TypeScript
- **ORM & Database**: Prisma ORM with PostgreSQL
- **Security**: JWT Authentication, bcrypt password encryption, Helmet, CORS
- **Payments**: Razorpay backend order verification engine
- **File Uploads**: Multer media storage middleware

---

## User Roles & Capabilities

1. **CUSTOMER**:
   - Register, Login, Forgot Password
   - Browse 20L Water Cans & Municipal Water Tankers
   - Select Quantity, Delivery Date & 2-Hour Time Slots
   - Saved Delivery Address Management
   - Apply Coupon Codes (e.g. `WELCOME10`, `WATER50`)
   - Complete Orders with Cash on Delivery, UPI, or Online Razorpay
   - Live Delivery Order Timeline & 4-Digit Delivery Verification OTP Code
   - Create & Schedule Recurring Water Subscriptions (Daily, Alternate Days, Weekly, Monthly)
   - Push Notifications for order updates

2. **DELIVERY PERSON**:
   - Dedicated Delivery Dashboard
   - View assigned orders with customer contact and address
   - Single-tap Customer Call
   - Start Delivery workflow
   - OTP Verification: Enter customer's 4-digit OTP code to verify completion and update status

3. **ADMIN**:
   - Real-time Analytics Dashboard (Total Revenue, Today's Revenue, Order Counts, Low Stock Alerts)
   - Product Management: Add, edit, price updates, stock management
   - System-wide Order Management: Confirm, prepare, dispatch orders
   - Customer Management: View registered customers, block/unblock accounts
   - Reports & Analytics: Export daily/monthly revenue reports to CSV/PDF

---

## Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL installed locally or database cloud URI (Supabase, Neon, Railway)

### 2. Backend Setup (`/backend`)
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables in .env
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nath_water_db?schema=public"

# Run Prisma Database Migrations
npx prisma migrate dev --name init

# Seed initial Admin, Delivery Staff, Products, and Coupons
npx prisma db seed

# Start Backend Server in development mode
npm run dev
```
The Backend API will start at `http://localhost:5000/api`.

### 3. Frontend Setup (`/frontend`)
```bash
cd frontend

# Install dependencies
npm install

# Start Expo Development Server
npm start
```

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@nathwater.com` | `Admin@123` |
| **Delivery Staff** | `delivery@nathwater.com` | `Delivery@123` |
| **Customer** | `customer@gmail.com` | `Customer@123` |

Quick demo buttons are also built directly into the Login screen for instant 1-tap testing!
