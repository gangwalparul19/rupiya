# Rupiya – Quick Start Guide

## 🚀 Get Running in 2 Minutes

### 1. Start Development Server
```bash
cd rupiya
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Explore the App
- **Dashboard** - Overview of all modules
- **Expenses** - Add and track expenses (working demo)
- **Houses, Vehicles, Notes, Documents, Analytics** - Placeholders ready for implementation

### 3. Firebase Setup (Optional for now)
To enable data persistence:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable:
   - Authentication (Email/Password, Google Sign-In)
   - Firestore Database
   - Storage
4. Copy your config to `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
rupiya/
├── app/                    # Pages & routes
│   ├── page.tsx           # Dashboard
│   ├── expenses/          # Expense module (working)
│   ├── houses/            # House module (placeholder)
│   ├── vehicles/          # Vehicle module (placeholder)
│   ├── notes/             # Notes module (placeholder)
│   ├── documents/         # Documents module (placeholder)
│   ├── analytics/         # Analytics module (placeholder)
│   └── auth/              # Login/Signup pages
├── components/            # React components
├── lib/
│   ├── firebase.ts        # Firebase config
│   └── store.ts           # Zustand state management
└── public/
    ├── manifest.json      # PWA manifest
    └── sw.js              # Service worker
```

## 🎯 What's Working

✅ **Dashboard** - Shows total expenses, transactions count
✅ **Expense Tracking** - Add expenses with category, payment method
✅ **PWA Ready** - Service worker, manifest, offline support
✅ **State Management** - Zustand store for global state
✅ **Responsive Design** - Mobile-first Tailwind CSS

## 🔧 Next Steps

### Immediate (Phase 1)
1. Connect Firebase Authentication
2. Persist expenses to Firestore
3. Add expense filtering & search
4. Implement category management

### Short-term (Phase 2)
1. House management module
2. Vehicle tracking with fuel analytics
3. Notes & daily logs
4. Document upload & storage

### Medium-term (Phase 3)
1. Gemini API integration for AI insights
2. Monthly reports & analytics
3. Budget suggestions
4. Natural language queries

### Long-term (Phase 4)
1. PWA installation prompts
2. Offline-first sync
3. React Native mobile app
4. Push notifications

## 📦 Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **Firebase** - Backend (Auth, Firestore, Storage)
- **Recharts** - Charts & graphs
- **PWA** - Offline support

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t rupiya .
docker run -p 3000:3000 rupiya
```

## 📝 Notes

- All data is currently stored in browser memory (Zustand)
- Firebase integration is configured but not yet connected to UI
- PWA is ready but needs icons (add to `public/`)
- Mobile app can be built with React Native/Expo later

## 🆘 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installed?**
```bash
npm install
```

**TypeScript errors?**
```bash
npm run lint
```

---

Happy coding! 🎉
