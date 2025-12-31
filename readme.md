# Rupiya – Smart Expense Tracker 💰
**Domain:** https://rupiya.online  

Rupiya is a modern, AI-powered personal finance and expense tracking platform designed as a **Website, Progressive Web App (PWA), and Mobile Application**.  
It helps users manage expenses across **multiple houses, vehicles, and daily life**, while also storing **documents, notes, and insights** in one secure place.

Rupiya differentiates itself by combining **structured expense tracking**, **vehicle analytics**, **document vault**, and **AI-assisted financial insights** using **Google Gemini**.

---

## 🌟 Key Highlights

- Single app for **expenses, notes, documents, vehicles, and properties**
- Multi-platform: **Web + PWA + Mobile**
- **AI-powered insights** (via Gemini API)
- Offline-first with cloud sync
- Privacy-focused (user-owned data & API keys)
- Built for scalability using Firebase & Vercel

---

## 🧱 Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **State Management:** Zustand / Redux Toolkit
- **PWA:** Workbox + Web App Manifest
- **Charts:** Recharts / Chart.js

### Backend & Infra
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage (documents, receipts)
- **Serverless APIs:** Firebase Functions
- **Deployment:** Vercel
- **Domain:** Hostinger (rupiya.online)

### AI
- **LLM:** Google Gemini API
- **Mode:** User-provided API key (BYOK – Bring Your Own Key)

### Mobile
- **Approach:** React Native (Expo) or Capacitor (from PWA)
- **Target:** Android first, iOS later

---

## 📱 Platforms Supported

| Platform | Status |
|--------|--------|
| Web App | ✅ Planned |
| Progressive Web App (PWA) | ✅ Planned |
| Android App | ✅ Planned |
| iOS App | ⏳ Future |

---

## 🔐 Authentication & Security

- Email / Password
- Google Sign-In
- Firebase Security Rules
- Encrypted document storage
- User-owned Gemini API keys (never shared)

---

## 🏠 Core Modules

### 1. Expense Management
- Daily, weekly, monthly expense tracking
- Categories & sub-categories
- Cash, UPI, card, wallet support
- Expense splitting (future)

### 2. Multi-House Support
- Add up to **3 houses** (owned or rented)
- Track expenses per house
- Rent, utilities, groceries, maintenance
- House-wise analytics

### 3. Vehicle Management
- Add **multiple vehicles**
- Fuel entries with price & quantity
- Maintenance & service records
- Automatic mileage & average calculation
- Cost per km analytics

### 4. Notes & Daily Logs
- Daily notes (journal style)
- Expense-linked notes
- Searchable historical notes

### 5. Document Vault
- Upload bills, receipts, IDs, insurance docs
- OCR (future enhancement)
- Folder & tag system
- Secure Firebase Storage

---

## 🤖 AI Features (Gemini Powered)

Users can optionally add their **own Gemini API key** to unlock AI features:

- Smart expense categorization
- Monthly spending insights
- Budget suggestions
- “Where can I save money?” analysis
- Natural language queries  
  _Example:_  
  > "Show my highest fuel expenses last 3 months"

AI runs **only when user enables it**.

---

## 📊 Analytics & Insights

- Monthly & yearly expense summaries
- Category-wise charts
- House-wise spending comparison
- Vehicle cost analytics
- AI-generated reports (optional)

---

## ⚙️ Installation (Local Development)

```bash
git clone https://github.com/your-username/rupiya
cd rupiya
npm install
npm run dev
