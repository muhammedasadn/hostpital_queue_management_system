# 🏥 Hospital CareQueue Management System

A modern, production-grade **Hospital Queue & Digital Pass Management System** built with **React**, **Node.js / Express**, **Socket.IO**, and a **Dual Storage Architecture** (MongoDB + Stateful In-Memory Fallback). Designed with a premium Dark Slate Glassmorphic aesthetic for seamless clinical operations.

---

## ✨ Features & System Highlights

- 🎨 **Dark-Slate Glassmorphic Interface**: Custom design system featuring ambient glows, crisp typography (`Outfit`, `Plus Jakarta Sans`), and high-contrast clinical accessibility.
- ⚡ **Real-Time Socket.IO Updates**: Instant queue updates across Patient Booking, Doctor Dispatch Dashboards, and Public Queue Monitors without manual page reloads.
- 🛡️ **Cryptographically Secure Tokens**: Department-aware token codes (e.g. `GEN-1001`, `CAR-1002`) generated with native `crypto.randomUUID()`.
- 💾 **Dual Storage Persistence**: Supports full **MongoDB Mongoose** persistence when connected, with a seamless **Stateful In-Memory Store Fallback** if MongoDB is offline.
- 📱 **QR Pass Voucher Generation**: Digital token vouchers featuring embedded QR codes, one-click ID copying, and PNG pass downloads.
- 👨‍⚕️ **Doctor & Admin Operations**: Counter management, next-patient call dispatching, completion tracking, and daily queue reset controls.
- 📲 **Mock SMS Alert Service**: Automated logging of SMS notifications for token booking and counter call-outs.

---

## 🚀 Quick Execution Link

For full setup, environment variable instructions, and multi-tab testing steps, check out the dedicated guide:

👉 **[HOW_TO_RUN.md](./HOW_TO_RUN.md)**

---

## ⚡ Quick Start Command Summary

```bash
# 1. Start Express Backend API Server (Port 5000)
cd server
npm run dev

# 2. In a separate terminal, start React Frontend (Port 3000)
cd client
npm start
```

Open `http://localhost:3000` in your web browser.

---

## 📑 License

Licensed under the MIT License.
