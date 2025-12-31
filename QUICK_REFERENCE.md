# Rupiya – Quick Reference Guide

**Last Updated:** December 30, 2025

---

## 📊 Project Status at a Glance

| Aspect | Status | Progress |
|--------|--------|----------|
| **Foundation** | ✅ Complete | 100% |
| **Core Modules** | 🟡 In Progress | 10% |
| **Advanced Features** | 🔴 Planned | 0% |
| **Mobile App** | 🔴 Planned | 0% |
| **Overall** | 🟡 In Development | 25% |

---

## ✅ What's Working

### Infrastructure
- ✅ Next.js 16 with TypeScript
- ✅ Tailwind CSS dark theme
- ✅ Zustand state management
- ✅ Firebase configuration
- ✅ PWA setup
- ✅ Docker support

### Features
- ✅ Dashboard with 10+ metrics
- ✅ Expense tracking (in-memory)
- ✅ Income tracking (data model)
- ✅ Budget tracking (data model)
- ✅ Investment tracking (data model)
- ✅ Goals tracking (data model)
- ✅ Charts and analytics
- ✅ Responsive design
- ✅ Toast notifications

---

## ❌ What's Missing

### Critical
- ❌ Firebase Authentication (not connected)
- ❌ Firestore persistence (in-memory only)
- ❌ User authentication flow
- ❌ Data persistence across sessions

### Core Modules
- ❌ Income management UI
- ❌ Budget management UI
- ❌ Investment management UI
- ❌ Goals management UI
- ❌ House management UI
- ❌ Vehicle management UI
- ❌ Notes management UI
- ❌ Documents management UI

### Advanced
- ❌ Expense splitting
- ❌ Multi-currency support
- ❌ Receipt scanning
- ❌ Calendar integration
- ❌ AI features (Gemini)
- ❌ Mobile app

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Visit `http://localhost:3000`

---

## 📁 Key Files

### Configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env.local.example` - Environment variables template

### Core
- `src/lib/store.ts` - Zustand store (all data models)
- `src/lib/firebase.ts` - Firebase configuration
- `src/components/Navigation.tsx` - Main navigation
- `src/app/layout.tsx` - Root layout

### Pages
- `src/app/page.tsx` - Dashboard (✅ Complete)
- `src/app/expenses/page.tsx` - Expenses (🟡 Partial)
- `src/app/auth/login/page.tsx` - Login (❌ Not connected)
- `src/app/auth/signup/page.tsx` - Signup (❌ Not connected)

### Components
- `src/components/AddExpenseModal.tsx` - Add expense form
- `src/components/RecentExpenses.tsx` - Recent transactions
- `src/components/AdvancedFilterPanel.tsx` - Expense filters
- `src/components/AuthProvider.tsx` - Auth wrapper
- `src/components/PWAProvider.tsx` - PWA setup

---

## 🎯 Immediate Priorities

### This Week
1. Connect Firebase Authentication
2. Set up Firestore database
3. Implement expense persistence
4. Test data flow

### Next Week
1. Build income management
2. Build budget management
3. Build category management
4. Add search functionality

### Next Month
1. Complete all core modules
2. Add advanced filtering
3. Build analytics dashboard
4. Implement error handling

---

## 📊 Data Models

### Expense
```typescript
{
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank' | 'wallet';
}
```

### Income
```typescript
{
  id: string;
  amount: number;
  source: 'salary' | 'freelance' | 'investment' | 'gift' | 'bonus' | 'other';
  description: string;
  date: Date;
}
```

### Budget
```typescript
{
  id: string;
  month: string; // YYYY-MM
  totalBudget: number;
  categories: { food?: number; transport?: number; ... };
}
```

---

## 🔐 Firebase Setup

### 1. Create Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Create new project
- Enable Firestore
- Enable Authentication

### 2. Get Credentials
- Copy Firebase config
- Add to `.env.local`

### 3. Enable Auth Methods
- Email/Password
- Google Sign-In

### 4. Create Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 🧩 Component Structure

### Adding a New Feature

1. **Create Data Model** in `src/lib/store.ts`
2. **Create Component** in `src/components/`
3. **Create Page** in `src/app/module/page.tsx`
4. **Add Route** to Navigation
5. **Connect to Store** with Zustand
6. **Connect to Firebase** for persistence
7. **Add Error Handling**
8. **Test Locally**

---

## 🎨 Styling Guide

### Colors
- Primary: Blue (`bg-blue-600`)
- Success: Green (`bg-green-600`)
- Warning: Yellow (`bg-yellow-600`)
- Error: Red (`bg-red-600`)
- Background: Slate (`bg-slate-900`)

### Spacing
- Small: `p-2` or `p-3`
- Medium: `p-4` or `p-6`
- Large: `p-8` or `p-12`

### Responsive
- Mobile: `<640px`
- Tablet: `640px-1024px`
- Desktop: `>1024px`

---

## 🔄 State Management

### Using Zustand Store

```typescript
import { useAppStore } from '@/lib/store';

// In component
const expenses = useAppStore((state) => state.expenses);
const addExpense = useAppStore((state) => state.addExpense);

// Add expense
addExpense({
  id: '1',
  amount: 100,
  category: 'Food',
  description: 'Lunch',
  date: new Date(),
  paymentMethod: 'cash',
});
```

---

## 📱 Responsive Design

### Mobile First Approach
```typescript
// Mobile (default)
<div className="p-4">

// Tablet and up
<div className="md:p-6">

// Desktop and up
<div className="lg:p-8">
```

---

## 🚨 Common Issues

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Dependencies Not Installed
```bash
npm install
```

### TypeScript Errors
```bash
npm run lint
```

### Build Fails
```bash
npm run build
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_OVERVIEW.md` | High-level overview |
| `QUICKSTART.md` | Quick start guide |
| `SETUP.md` | Detailed setup |
| `FEATURES_AND_ROADMAP.md` | Features & roadmap |
| `IMPLEMENTATION_STATUS.md` | Status dashboard |
| `ARCHITECTURE_OVERVIEW.md` | Technical architecture |
| `NEXT_STEPS.md` | Action plan |
| `QUICK_REFERENCE.md` | This file |

---

## 🔗 Useful Links

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)

### Tools
- [Firebase Console](https://console.firebase.google.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub](https://github.com)

---

## 💻 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Useful shortcuts
npm run dev -- -p 3001  # Run on different port
npm run build -- --debug # Build with debug info
```

---

## 🎯 Module Checklist

When implementing a new module:

- [ ] Create data model in store.ts
- [ ] Create page component
- [ ] Create form component
- [ ] Create list component
- [ ] Add to navigation
- [ ] Connect to Zustand
- [ ] Connect to Firestore
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test on mobile
- [ ] Update documentation

---

## 📊 Dashboard Metrics

Currently Displayed:
- This Month Income
- This Month Expenses
- Cash Flow
- Savings Rate
- Net Worth
- Budget Status
- Investment Performance
- Goals Progress
- Expense Breakdown (Pie)
- Income vs Expense (Bar)
- Spending Trend (Line)
- Income Sources (Pie)

---

## 🔐 Security Checklist

- [ ] Firebase Auth connected
- [ ] Security rules configured
- [ ] User data isolated
- [ ] API keys in .env.local
- [ ] No secrets in code
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Input validation added

---

## 📈 Performance Tips

1. Use `React.memo` for expensive components
2. Implement pagination for large lists
3. Use code splitting with `dynamic()`
4. Optimize images with `next/image`
5. Cache API responses
6. Lazy load components
7. Minimize bundle size
8. Use CDN for static assets

---

## 🧪 Testing Checklist

Before deploying:
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile
- [ ] Tested on tablet
- [ ] Tested offline (PWA)
- [ ] Tested with slow network
- [ ] Tested with no data
- [ ] Tested with large data

---

## 🚀 Deployment Checklist

Before going live:
- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] Build succeeds
- [ ] Environment variables set
- [ ] Firebase configured
- [ ] Security rules deployed
- [ ] Monitoring set up
- [ ] Backup plan ready

---

## 📞 Getting Help

1. Check documentation files
2. Review code comments
3. Check Firebase docs
4. Check Next.js docs
5. Search GitHub issues
6. Ask team members

---

## 🎓 Learning Path

### Week 1
- [ ] Understand project structure
- [ ] Learn Zustand basics
- [ ] Learn Firebase basics
- [ ] Review existing components

### Week 2
- [ ] Implement Firebase Auth
- [ ] Implement Firestore persistence
- [ ] Build first module
- [ ] Test thoroughly

### Week 3+
- [ ] Build remaining modules
- [ ] Add advanced features
- [ ] Optimize performance
- [ ] Deploy to production

---

## 📝 Code Style

### Naming Conventions
- Components: PascalCase (`AddExpenseModal.tsx`)
- Functions: camelCase (`addExpense()`)
- Constants: UPPER_SNAKE_CASE (`MAX_ITEMS = 100`)
- Files: kebab-case or PascalCase

### TypeScript
- Always use types
- Avoid `any` type
- Use interfaces for objects
- Use enums for constants

### React
- Use functional components
- Use hooks for state
- Use composition over inheritance
- Keep components small

---

**Quick Reference Created:** December 30, 2025  
**Last Updated:** December 30, 2025

**Status:** 🟡 Ready for Development
