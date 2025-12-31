# Rupiya – Architecture & Technical Overview

**Last Updated:** December 30, 2025

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React 19 Components                      │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │  Dashboard  │  │   Expenses   │  │  Budgets   │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │ Investments │  │    Goals     │  │   Houses   │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │  Vehicles   │  │    Notes     │  │ Documents  │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         State Management (Zustand)                   │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Global Store (useAppStore)                    │  │   │
│  │  │  - Expenses, Income, Budgets, Investments     │  │   │
│  │  │  - Goals, Houses, Vehicles, Notes, Documents  │  │   │
│  │  │  - User Auth, Categories, Payment Methods     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         UI Components & Utilities                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Navigation | Toast | Modal | Charts | Forms   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Styling (Tailwind CSS 4)                     │   │
│  │  Dark Theme | Responsive | Mobile-First             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  NEXT.JS LAYER (Server)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         App Router (Next.js 16)                      │   │
│  │  /                    /expenses                      │   │
│  │  /auth/login          /auth/signup                   │   │
│  │  /budgets             /investments                   │   │
│  │  /goals               /houses                        │   │
│  │  /vehicles            /notes                         │   │
│  │  /documents           /analytics                     │   │
│  │  /categories          /recurring                     │   │
│  │  /splitting           /calendar                      │   │
│  │  /reports             /profile                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Middleware & Providers                       │   │
│  │  - AuthProvider (Firebase Auth)                      │   │
│  │  - PWAProvider (Service Worker)                      │   │
│  │  - ToastProvider (Notifications)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND LAYER (Firebase)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Firebase Authentication                      │   │
│  │  - Email/Password                                    │   │
│  │  - Google Sign-In                                    │   │
│  │  - Session Management                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Firestore Database                           │   │
│  │  Collections:                                        │   │
│  │  - users/{userId}/expenses                           │   │
│  │  - users/{userId}/income                             │   │
│  │  - users/{userId}/budgets                            │   │
│  │  - users/{userId}/investments                        │   │
│  │  - users/{userId}/goals                              │   │
│  │  - users/{userId}/houses                             │   │
│  │  - users/{userId}/vehicles                           │   │
│  │  - users/{userId}/notes                              │   │
│  │  - users/{userId}/documents                          │   │
│  │  - users/{userId}/categories                         │   │
│  │  - users/{userId}/paymentMethods                     │   │
│  │  - users/{userId}/recurringTransactions              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Firebase Storage                             │   │
│  │  - Document uploads                                  │   │
│  │  - Receipt images                                    │   │
│  │  - User avatars                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Firebase Functions (Future)                  │   │
│  │  - Recurring transaction generation                  │   │
│  │  - Budget alerts                                     │   │
│  │  - Data aggregation                                  │   │
│  │  - Notifications                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES (Future)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Google Gemini API                            │   │
│  │  - Smart categorization                              │   │
│  │  - Spending insights                                 │   │
│  │  - Budget recommendations                            │   │
│  │  - Natural language queries                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Google Vision API (Future)                   │   │
│  │  - Receipt OCR                                       │   │
│  │  - Document scanning                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Exchange Rate API (Future)                   │   │
│  │  - Currency conversion                               │   │
│  │  - Real-time rates                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
rupiya/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout with PWA meta
│   │   ├── page.tsx                  # Dashboard (✅ Complete)
│   │   ├── globals.css               # Global styles
│   │   ├── favicon.ico               # App icon
│   │   │
│   │   ├── expenses/                 # Expense module (🟡 Partial)
│   │   │   └── page.tsx
│   │   │
│   │   ├── income/                   # Income module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── budgets/                  # Budget module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── investments/              # Investment module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── goals/                    # Goals module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── houses/                   # House module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── vehicles/                 # Vehicle module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── notes/                    # Notes module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── documents/                # Documents module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── categories/               # Categories module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── recurring/                # Recurring module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── splitting/                # Splitting module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── calendar/                 # Calendar module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── analytics/                # Analytics module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── reports/                  # Reports module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── profile/                  # Profile module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   ├── receipts/                 # Receipts module (❌ Placeholder)
│   │   │   └── page.tsx
│   │   │
│   │   └── auth/                     # Authentication (✅ UI Ready)
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── signup/
│   │           └── page.tsx
│   │
│   ├── components/                   # Reusable React components
│   │   ├── Navigation.tsx            # ✅ Main navigation
│   │   ├── PWAProvider.tsx           # ✅ Service worker
│   │   ├── AuthProvider.tsx          # ✅ Auth wrapper
│   │   ├── RecentExpenses.tsx        # ✅ Recent transactions
│   │   ├── AddExpenseModal.tsx       # ✅ Add expense form
│   │   ├── AdvancedFilterPanel.tsx   # ✅ Filter expenses
│   │   ├── Toast.tsx                 # ✅ Toast notification
│   │   ├── ToastWrapper.tsx          # ✅ Toast container
│   │   └── [Other components]        # 🟡 To be built
│   │
│   └── lib/                          # Utilities & configuration
│       ├── store.ts                  # ✅ Zustand store (complete)
│       ├── firebase.ts               # ✅ Firebase config
│       ├── toastContext.ts           # ✅ Toast context
│       └── [Other utilities]         # 🟡 To be built
│
├── public/                           # Static assets
│   ├── manifest.json                 # ✅ PWA manifest
│   ├── sw.js                         # ✅ Service worker
│   ├── next.svg                      # App icons
│   ├── vercel.svg
│   ├── globe.svg
│   ├── window.svg
│   ├── file.svg
│   └── [Icons needed]                # 🟡 To be added
│
├── .env.local.example                # ✅ Environment template
├── .env.local                        # 🟡 To be configured
├── .gitignore                        # ✅ Git ignore
├── .eslintrc.json                    # ✅ ESLint config
├── next.config.js                    # ✅ Next.js config
├── next.config.ts                    # ✅ Next.js config (TS)
├── tsconfig.json                     # ✅ TypeScript config
├── tailwind.config.js                # ✅ Tailwind config
├── postcss.config.mjs                # ✅ PostCSS config
├── package.json                      # ✅ Dependencies
├── package-lock.json                 # ✅ Lock file
├── Dockerfile                        # ✅ Docker config
├── docker-compose.yml                # ✅ Docker compose
├── PROJECT_OVERVIEW.md               # ✅ Project overview
├── QUICKSTART.md                     # ✅ Quick start
├── SETUP.md                          # ✅ Setup guide
├── readme.md                         # ✅ README
├── FEATURES_AND_ROADMAP.md           # ✅ This roadmap
├── IMPLEMENTATION_STATUS.md          # ✅ Status dashboard
└── ARCHITECTURE_OVERVIEW.md          # ✅ This file
```

---

## 🔄 Data Flow

### Adding an Expense (Current Flow)

```
User Input (Form)
    ↓
AddExpenseModal Component
    ↓
Zustand Store (useAppStore.addExpense)
    ↓
In-Memory State Update
    ↓
Component Re-render
    ↓
Display in Dashboard/Recent Expenses
```

### Adding an Expense (Future Flow with Firebase)

```
User Input (Form)
    ↓
AddExpenseModal Component
    ↓
Zustand Store (useAppStore.addExpense)
    ↓
Firebase Firestore Write
    ↓
Real-time Listener Update
    ↓
Zustand Store Update
    ↓
Component Re-render
    ↓
Display in Dashboard/Recent Expenses
```

---

## 🗄️ Data Models

### Core Entities

```typescript
// Expense
{
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank' | 'wallet';
  houseId?: string;
  vehicleId?: string;
}

// Income
{
  id: string;
  amount: number;
  source: 'salary' | 'freelance' | 'investment' | 'gift' | 'bonus' | 'other';
  description: string;
  date: Date;
  category?: string;
}

// Budget
{
  id: string;
  month: string; // YYYY-MM
  totalBudget: number;
  categories: { food?: number; transport?: number; ... };
}

// Investment
{
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'crypto' | 'real_estate' | 'gold' | 'bonds';
  initialAmount: number;
  currentValue: number;
  purchaseDate: Date;
}

// Goal
{
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'emergency' | 'vacation' | 'vehicle' | 'property' | 'education';
}

// House
{
  id: string;
  name: string;
  type: 'owned' | 'rented';
  address: string;
}

// Vehicle
{
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
}

// Note
{
  id: string;
  title: string;
  content: string;
  date: Date;
  expenseId?: string;
}

// Document
{
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  tags: string[];
}
```

---

## 🔐 Security Architecture

### Current State
- ✅ Environment variables for secrets
- ✅ Firebase configuration ready
- ❌ Security rules not implemented
- ❌ Authentication not connected

### Planned Security Measures

```
┌─────────────────────────────────────────┐
│      User Authentication                 │
│  - Email/Password (Firebase Auth)        │
│  - Google Sign-In                        │
│  - Session tokens                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Authorization                       │
│  - User-owned data only                  │
│  - Role-based access (future)            │
│  - Firestore Security Rules              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Data Protection                     │
│  - Encrypted at rest (Firebase)          │
│  - HTTPS in transit                      │
│  - User-owned API keys (Gemini)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Privacy                             │
│  - No data sharing                       │
│  - User data isolation                   │
│  - GDPR compliance (future)              │
└─────────────────────────────────────────┘
```

---

## 📊 State Management (Zustand)

### Store Structure

```typescript
useAppStore = {
  // Auth State
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Data State
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  investments: Investment[];
  goals: Goal[];
  houses: House[];
  vehicles: Vehicle[];
  notes: Note[];
  documents: Document[];
  categories: Category[];
  recurringTransactions: RecurringTransaction[];
  
  // Phase 2 State
  splitExpenses: SplitExpense[];
  settlements: Settlement[];
  receipts: Receipt[];
  currencySettings: UserCurrencySettings;
  
  // Phase 3 State
  calendarEvents: CalendarEvent[];
  billReminders: BillReminder[];

  // Actions (CRUD operations for each entity)
  addExpense, removeExpense, updateExpense, setExpenses;
  addIncome, removeIncome, updateIncome, setIncome;
  // ... and so on for all entities
}
```

---

## 🎨 Component Hierarchy

```
App (layout.tsx)
├── PWAProvider
├── ToastProvider
├── AuthProvider
│   ├── Navigation
│   └── Page Content
│       ├── Dashboard (/)
│       │   ├── MetricCards
│       │   ├── RecentExpenses
│       │   ├── Charts (Pie, Bar, Line)
│       │   └── AddExpenseModal
│       │
│       ├── Expenses (/expenses)
│       │   ├── ExpenseList
│       │   ├── AddExpenseModal
│       │   ├── AdvancedFilterPanel
│       │   └── ExpenseDetails
│       │
│       ├── [Other Modules]
│       │   └── [To be built]
│       │
│       └── Auth (/auth/*)
│           ├── LoginForm
│           └── SignupForm
│
└── ToastWrapper
```

---

## 🚀 Deployment Architecture

### Development
```
npm run dev
↓
Next.js Dev Server (localhost:3000)
↓
Hot Module Replacement (HMR)
```

### Production
```
npm run build
↓
Next.js Build Output
↓
Vercel / Docker / Traditional Server
↓
Optimized Bundle
```

### Docker Deployment
```
Dockerfile
↓
Docker Image
↓
docker-compose.yml
↓
Container Runtime
↓
Port 3000
```

---

## 📱 PWA Architecture

```
┌─────────────────────────────────────┐
│      Web App Manifest                │
│  - App name, icons, theme            │
│  - Display mode (standalone)         │
│  - Start URL                         │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│      Service Worker                  │
│  - Cache-first strategy              │
│  - Offline support                   │
│  - Background sync (future)          │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│      Browser Storage                 │
│  - LocalStorage (user preferences)   │
│  - IndexedDB (large data)            │
│  - Cache API (assets)                │
└─────────────────────────────────────┘
```

---

## 🔌 API Integration Points

### Current
- ✅ Firebase Auth API
- ✅ Firestore API (configured, not used)
- ✅ Firebase Storage API (configured, not used)

### Planned
- 🔴 Google Gemini API (AI features)
- 🔴 Google Vision API (OCR)
- 🔴 Exchange Rate API (currency conversion)
- 🔴 Firebase Functions (backend logic)

---

## 📈 Performance Considerations

### Current Optimizations
- ✅ Next.js code splitting
- ✅ Image optimization (next/image)
- ✅ CSS-in-JS with Tailwind
- ✅ Component lazy loading (future)

### Planned Optimizations
- 🔴 Database query optimization
- 🔴 Caching strategies
- 🔴 Pagination for large lists
- 🔴 Virtual scrolling
- 🔴 Bundle size optimization

---

## 🧪 Testing Strategy

### Current
- ❌ No tests implemented

### Planned
- 🔴 Unit tests (Jest)
- 🔴 Integration tests (React Testing Library)
- 🔴 E2E tests (Cypress/Playwright)
- 🔴 Performance tests

---

## 📚 Technology Stack Summary

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| **Frontend** | React | 19.2.3 | ✅ |
| **Framework** | Next.js | 16.1.1 | ✅ |
| **Language** | TypeScript | 5.x | ✅ |
| **Styling** | Tailwind CSS | 4.x | ✅ |
| **State** | Zustand | 5.0.9 | ✅ |
| **Charts** | Recharts | 3.6.0 | ✅ |
| **Backend** | Firebase | 12.7.0 | ✅ |
| **HTTP** | Axios | 1.13.2 | ✅ |
| **Image Compression** | browser-image-compression | 2.0.2 | ✅ |
| **Linting** | ESLint | 9.x | ✅ |
| **Build Tool** | Next.js | 16.1.1 | ✅ |

---

## 🔄 Development Workflow

```
1. Feature Planning
   ↓
2. Create Branch (feature/module-name)
   ↓
3. Implement Feature
   - Update data model in store.ts
   - Create components
   - Create page
   - Add styling
   ↓
4. Test Locally
   npm run dev
   ↓
5. Build Check
   npm run build
   ↓
6. Lint Check
   npm run lint
   ↓
7. Commit & Push
   ↓
8. Deploy to Vercel
```

---

## 📞 Architecture Decision Records

### Why Zustand?
- Lightweight state management
- No boilerplate
- TypeScript support
- Easy to test

### Why Tailwind CSS?
- Utility-first approach
- Dark mode support
- Responsive design
- Small bundle size

### Why Firebase?
- Real-time database
- Built-in authentication
- Scalable storage
- Serverless functions

### Why Next.js?
- Server-side rendering
- API routes
- Image optimization
- Built-in PWA support

---

**Last Updated:** December 30, 2025  
**Next Review:** January 15, 2026
