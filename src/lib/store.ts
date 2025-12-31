import { create } from 'zustand';
import { User } from 'firebase/auth';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  createdAt: Date;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  categoryId?: string;
  description: string;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank' | 'wallet';
  paymentMethodId?: string;
  paymentMethodName?: string;
  walletId?: string;
  houseId?: string;
  vehicleId?: string;
  currency?: string; // Phase 2: Multi-currency support
  convertedAmount?: number; // Phase 2: Amount in base currency
  receiptId?: string; // Phase 2: Link to receipt
}

export interface Income {
  id: string;
  amount: number;
  source: 'salary' | 'freelance' | 'investment' | 'gift' | 'bonus' | 'other';
  description: string;
  date: Date;
  category?: string;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  totalBudget: number;
  categories: {
    food?: number;
    transport?: number;
    utilities?: number;
    entertainment?: number;
    shopping?: number;
    health?: number;
    other?: number;
  };
}

export interface BudgetAlert {
  id: string;
  threshold: number; // 50, 75, 80, 90, 100
  enabled: boolean;
  notifyEmail: boolean;
  notifyInApp: boolean;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'crypto' | 'real_estate' | 'gold' | 'bonds' | 'other';
  initialAmount: number;
  currentValue: number;
  purchaseDate: Date;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface InvestmentTransaction {
  id: string;
  investmentId: string;
  type: 'buy' | 'sell' | 'dividend' | 'interest';
  amount: number;
  date: Date;
  notes?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'emergency' | 'vacation' | 'vehicle' | 'property' | 'education' | 'other';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface GoalTransaction {
  id: string;
  goalId: string;
  amount: number;
  date: Date;
  notes?: string;
}

export interface RecurringTransaction {
  id: string;
  type: 'expense' | 'income';
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  category: string;
  isActive: boolean;
}

export interface House {
  id: string;
  name: string;
  type: 'owned' | 'rented';
  address: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  expenseId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  tags: string[];
}

export interface Card {
  id: string;
  cardName: string;
  cardNumber: string;
}

export interface UPI {
  id: string;
  upiName: string;
  upiHandle: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'upi' | 'bank' | 'wallet';
  balance?: number;
  description?: string;
  createdAt: Date;
}

// ============ PHASE 2: EXPENSE SPLITTING ============
export interface SplitParticipant {
  userId: string;
  name: string;
  email?: string;
  amount: number;
  settled: boolean;
}

export interface SplitExpense {
  id: string;
  expenseId: string;
  createdBy: string;
  description: string;
  totalAmount: number;
  currency: string;
  date: Date;
  participants: SplitParticipant[];
  status: 'pending' | 'settled' | 'partial';
  createdAt: Date;
}

export interface Settlement {
  id: string;
  splitExpenseId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  settled: boolean;
  settledAt?: Date;
  createdAt: Date;
}

// ============ PHASE 2: MULTI-CURRENCY SUPPORT ============
export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

export interface UserCurrencySettings {
  baseCurrency: string;
  displayCurrency: string;
  autoConvert: boolean;
  conversionRates: CurrencyRate[];
}

// ============ PHASE 2: RECEIPT SCANNING ============
export interface Receipt {
  id: string;
  expenseId?: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  extractedData?: {
    amount?: number;
    date?: Date;
    merchant?: string;
    category?: string;
    description?: string;
    confidence?: number;
  };
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
}

// ============ PHASE 3: CALENDAR INTEGRATION ============
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'bill_reminder' | 'recurring_transaction' | 'goal_milestone' | 'custom';
  linkedId?: string; // ID of linked recurring transaction, bill, or goal
  linkedType?: 'recurring' | 'bill' | 'goal';
  amount?: number;
  category?: string;
  reminderDays: number; // Days before event to remind
  notificationEnabled: boolean;
  color: string; // Color for calendar display
  createdAt: Date;
}

export interface BillReminder {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  category: string;
  isPaid: boolean;
  reminderDays: number;
  notes?: string;
  createdAt: Date;
}

interface AppStore {
  // Auth
  user: User | null;
  userProfile: { displayName?: string; phoneNumber?: string; currency?: string; theme?: string; notifications?: boolean } | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Data
  categories: Category[];
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  budgetAlerts: BudgetAlert[];
  investments: Investment[];
  investmentTransactions: InvestmentTransaction[];
  goals: Goal[];
  goalTransactions: GoalTransaction[];
  recurringTransactions: RecurringTransaction[];
  houses: House[];
  vehicles: Vehicle[];
  notes: Note[];
  documents: Document[];
  cards: Card[];
  upiAccounts: UPI[];
  bankAccounts: BankAccount[];
  wallets: Wallet[];
  
  // Phase 2: Expense Splitting
  splitExpenses: SplitExpense[];
  settlements: Settlement[];
  
  // Phase 2: Multi-Currency
  currencySettings: UserCurrencySettings | null;
  currencyRates: CurrencyRate[];
  
  // Phase 2: Receipt Scanning
  receipts: Receipt[];

  // Phase 3: Calendar Integration
  calendarEvents: CalendarEvent[];
  billReminders: BillReminder[];

  // Auth Actions
  setUser: (user: User | null) => void;
  setUserProfile: (profile: any) => void;
  setIsLoading: (loading: boolean) => void;
  setIsAuthenticated: (authenticated: boolean) => void;

  // Category Actions
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  setCategories: (categories: Category[]) => void;

  // Expense Actions
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  setExpenses: (expenses: Expense[]) => void;

  // Income Actions
  addIncome: (income: Income) => void;
  removeIncome: (id: string) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  setIncome: (income: Income[]) => void;

  // Budget Actions
  addBudget: (budget: Budget) => void;
  removeBudget: (id: string) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  setBudgets: (budgets: Budget[]) => void;

  // Budget Alert Actions
  addBudgetAlert: (alert: BudgetAlert) => void;
  removeBudgetAlert: (id: string) => void;
  updateBudgetAlert: (id: string, alert: Partial<BudgetAlert>) => void;
  setBudgetAlerts: (alerts: BudgetAlert[]) => void;

  // Investment Actions
  addInvestment: (investment: Investment) => void;
  removeInvestment: (id: string) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  setInvestments: (investments: Investment[]) => void;

  // Investment Transaction Actions
  addInvestmentTransaction: (transaction: InvestmentTransaction) => void;
  removeInvestmentTransaction: (id: string) => void;
  setInvestmentTransactions: (transactions: InvestmentTransaction[]) => void;

  // Goal Actions
  addGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  setGoals: (goals: Goal[]) => void;

  // Goal Transaction Actions
  addGoalTransaction: (transaction: GoalTransaction) => void;
  removeGoalTransaction: (id: string) => void;
  setGoalTransactions: (transactions: GoalTransaction[]) => void;

  // Recurring Transaction Actions
  addRecurringTransaction: (transaction: RecurringTransaction) => void;
  removeRecurringTransaction: (id: string) => void;
  updateRecurringTransaction: (id: string, transaction: Partial<RecurringTransaction>) => void;
  setRecurringTransactions: (transactions: RecurringTransaction[]) => void;

  // House Actions
  addHouse: (house: House) => void;
  removeHouse: (id: string) => void;
  updateHouse: (id: string, house: Partial<House>) => void;
  setHouses: (houses: House[]) => void;

  // Vehicle Actions
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  setVehicles: (vehicles: Vehicle[]) => void;

  // Note Actions
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  setNotes: (notes: Note[]) => void;

  // Document Actions
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  setDocuments: (documents: Document[]) => void;

  // Card Actions
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  setCards: (cards: Card[]) => void;

  // UPI Actions
  addUPI: (upi: UPI) => void;
  removeUPI: (id: string) => void;
  setUPIs: (upis: UPI[]) => void;

  // Bank Account Actions
  addBankAccount: (bank: BankAccount) => void;
  removeBankAccount: (id: string) => void;
  setBankAccounts: (banks: BankAccount[]) => void;

  // Wallet Actions
  addWallet: (wallet: Wallet) => void;
  removeWallet: (id: string) => void;
  updateWallet: (id: string, wallet: Partial<Wallet>) => void;
  setWallets: (wallets: Wallet[]) => void;

  // Phase 2: Split Expense Actions
  addSplitExpense: (splitExpense: SplitExpense) => void;
  removeSplitExpense: (id: string) => void;
  updateSplitExpense: (id: string, splitExpense: Partial<SplitExpense>) => void;
  setSplitExpenses: (splitExpenses: SplitExpense[]) => void;

  // Phase 2: Settlement Actions
  addSettlement: (settlement: Settlement) => void;
  removeSettlement: (id: string) => void;
  updateSettlement: (id: string, settlement: Partial<Settlement>) => void;
  setSettlements: (settlements: Settlement[]) => void;

  // Phase 2: Currency Settings Actions
  setCurrencySettings: (settings: UserCurrencySettings) => void;
  setCurrencyRates: (rates: CurrencyRate[]) => void;

  // Phase 2: Receipt Actions
  addReceipt: (receipt: Receipt) => void;
  removeReceipt: (id: string) => void;
  updateReceipt: (id: string, receipt: Partial<Receipt>) => void;
  setReceipts: (receipts: Receipt[]) => void;

  // Phase 3: Calendar Event Actions
  addCalendarEvent: (event: CalendarEvent) => void;
  removeCalendarEvent: (id: string) => void;
  updateCalendarEvent: (id: string, event: Partial<CalendarEvent>) => void;
  setCalendarEvents: (events: CalendarEvent[]) => void;

  // Phase 3: Bill Reminder Actions
  addBillReminder: (reminder: BillReminder) => void;
  removeBillReminder: (id: string) => void;
  updateBillReminder: (id: string, reminder: Partial<BillReminder>) => void;
  setBillReminders: (reminders: BillReminder[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Auth
  user: null,
  userProfile: null,
  isLoading: false,
  isAuthenticated: false,

  // Data
  categories: [],
  expenses: [],
  income: [],
  budgets: [],
  budgetAlerts: [],
  investments: [],
  investmentTransactions: [],
  goals: [],
  goalTransactions: [],
  recurringTransactions: [],
  houses: [],
  vehicles: [],
  notes: [],
  documents: [],
  cards: [],
  upiAccounts: [],
  bankAccounts: [],
  wallets: [],
  
  // Phase 2: Expense Splitting
  splitExpenses: [],
  settlements: [],
  
  // Phase 2: Multi-Currency
  currencySettings: null,
  currencyRates: [],
  
  // Phase 2: Receipt Scanning
  receipts: [],

  // Phase 3: Calendar Integration
  calendarEvents: [],
  billReminders: [],

  // Auth Actions
  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  // Category Actions
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  setCategories: (categories) => set({ categories }),

  // Expense Actions
  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),
  removeExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),
  updateExpense: (id, updates) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  setExpenses: (expenses) => set({ expenses }),

  // Income Actions
  addIncome: (income) =>
    set((state) => ({ income: [...state.income, income] })),
  removeIncome: (id) =>
    set((state) => ({
      income: state.income.filter((i) => i.id !== id),
    })),
  updateIncome: (id, updates) =>
    set((state) => ({
      income: state.income.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),
  setIncome: (income) => set({ income }),

  // Budget Actions
  addBudget: (budget) =>
    set((state) => ({ budgets: [...state.budgets, budget] })),
  removeBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),
  updateBudget: (id, updates) =>
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
  setBudgets: (budgets) => set({ budgets }),

  // Budget Alert Actions
  addBudgetAlert: (alert) =>
    set((state) => ({ budgetAlerts: [...state.budgetAlerts, alert] })),
  removeBudgetAlert: (id) =>
    set((state) => ({
      budgetAlerts: state.budgetAlerts.filter((a) => a.id !== id),
    })),
  updateBudgetAlert: (id, updates) =>
    set((state) => ({
      budgetAlerts: state.budgetAlerts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  setBudgetAlerts: (alerts) => set({ budgetAlerts: alerts }),

  // Investment Actions
  addInvestment: (investment) =>
    set((state) => ({ investments: [...state.investments, investment] })),
  removeInvestment: (id) =>
    set((state) => ({
      investments: state.investments.filter((i) => i.id !== id),
    })),
  updateInvestment: (id, updates) =>
    set((state) => ({
      investments: state.investments.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),
  setInvestments: (investments) => set({ investments }),

  // Investment Transaction Actions
  addInvestmentTransaction: (transaction) =>
    set((state) => ({
      investmentTransactions: [...state.investmentTransactions, transaction],
    })),
  removeInvestmentTransaction: (id) =>
    set((state) => ({
      investmentTransactions: state.investmentTransactions.filter((t) => t.id !== id),
    })),
  setInvestmentTransactions: (transactions) =>
    set({ investmentTransactions: transactions }),

  // Goal Actions
  addGoal: (goal) =>
    set((state) => ({ goals: [...state.goals, goal] })),
  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),
  setGoals: (goals) => set({ goals }),

  // Goal Transaction Actions
  addGoalTransaction: (transaction) =>
    set((state) => ({
      goalTransactions: [...state.goalTransactions, transaction],
    })),
  removeGoalTransaction: (id) =>
    set((state) => ({
      goalTransactions: state.goalTransactions.filter((t) => t.id !== id),
    })),
  setGoalTransactions: (transactions) =>
    set({ goalTransactions: transactions }),

  // Recurring Transaction Actions
  addRecurringTransaction: (transaction) =>
    set((state) => ({
      recurringTransactions: [...state.recurringTransactions, transaction],
    })),
  removeRecurringTransaction: (id) =>
    set((state) => ({
      recurringTransactions: state.recurringTransactions.filter((t) => t.id !== id),
    })),
  updateRecurringTransaction: (id, updates) =>
    set((state) => ({
      recurringTransactions: state.recurringTransactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  setRecurringTransactions: (transactions) =>
    set({ recurringTransactions: transactions }),

  // House Actions
  addHouse: (house) =>
    set((state) => ({ houses: [...state.houses, house] })),
  removeHouse: (id) =>
    set((state) => ({
      houses: state.houses.filter((h) => h.id !== id),
    })),
  updateHouse: (id, updates) =>
    set((state) => ({
      houses: state.houses.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
    })),
  setHouses: (houses) => set({ houses }),

  // Vehicle Actions
  addVehicle: (vehicle) =>
    set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
  removeVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    })),
  updateVehicle: (id, updates) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),
  setVehicles: (vehicles) => set({ vehicles }),

  // Note Actions
  addNote: (note) =>
    set((state) => ({ notes: [...state.notes, note] })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),
  setNotes: (notes) => set({ notes }),

  // Document Actions
  addDocument: (doc) =>
    set((state) => ({ documents: [...state.documents, doc] })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  setDocuments: (documents) => set({ documents }),

  // Card Actions
  addCard: (card) =>
    set((state) => ({ cards: [...state.cards, card] })),
  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
    })),
  setCards: (cards) => set({ cards }),

  // UPI Actions
  addUPI: (upi) =>
    set((state) => ({ upiAccounts: [...state.upiAccounts, upi] })),
  removeUPI: (id) =>
    set((state) => ({
      upiAccounts: state.upiAccounts.filter((u) => u.id !== id),
    })),
  setUPIs: (upis) => set({ upiAccounts: upis }),

  // Bank Account Actions
  addBankAccount: (bank) =>
    set((state) => ({ bankAccounts: [...state.bankAccounts, bank] })),
  removeBankAccount: (id) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.filter((b) => b.id !== id),
    })),
  setBankAccounts: (banks) => set({ bankAccounts: banks }),

  // Wallet Actions
  addWallet: (wallet) =>
    set((state) => ({ wallets: [...state.wallets, wallet] })),
  removeWallet: (id) =>
    set((state) => ({
      wallets: state.wallets.filter((w) => w.id !== id),
    })),
  updateWallet: (id, updates) =>
    set((state) => ({
      wallets: state.wallets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),
  setWallets: (wallets) => set({ wallets }),

  // Phase 2: Split Expense Actions
  addSplitExpense: (splitExpense) =>
    set((state) => ({ splitExpenses: [...state.splitExpenses, splitExpense] })),
  removeSplitExpense: (id) =>
    set((state) => ({
      splitExpenses: state.splitExpenses.filter((s) => s.id !== id),
    })),
  updateSplitExpense: (id, updates) =>
    set((state) => ({
      splitExpenses: state.splitExpenses.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  setSplitExpenses: (splitExpenses) => set({ splitExpenses }),

  // Phase 2: Settlement Actions
  addSettlement: (settlement) =>
    set((state) => ({ settlements: [...state.settlements, settlement] })),
  removeSettlement: (id) =>
    set((state) => ({
      settlements: state.settlements.filter((s) => s.id !== id),
    })),
  updateSettlement: (id, updates) =>
    set((state) => ({
      settlements: state.settlements.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  setSettlements: (settlements) => set({ settlements }),

  // Phase 2: Currency Settings Actions
  setCurrencySettings: (settings) => set({ currencySettings: settings }),
  setCurrencyRates: (rates) => set({ currencyRates: rates }),

  // Phase 2: Receipt Actions
  addReceipt: (receipt) =>
    set((state) => ({ receipts: [...state.receipts, receipt] })),
  removeReceipt: (id) =>
    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
    })),
  updateReceipt: (id, updates) =>
    set((state) => ({
      receipts: state.receipts.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
  setReceipts: (receipts) => set({ receipts }),

  // Phase 3: Calendar Event Actions
  addCalendarEvent: (event) =>
    set((state) => ({ calendarEvents: [...state.calendarEvents, event] })),
  removeCalendarEvent: (id) =>
    set((state) => ({
      calendarEvents: state.calendarEvents.filter((e) => e.id !== id),
    })),
  updateCalendarEvent: (id, updates) =>
    set((state) => ({
      calendarEvents: state.calendarEvents.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  setCalendarEvents: (events) => set({ calendarEvents: events }),

  // Phase 3: Bill Reminder Actions
  addBillReminder: (reminder) =>
    set((state) => ({ billReminders: [...state.billReminders, reminder] })),
  removeBillReminder: (id) =>
    set((state) => ({
      billReminders: state.billReminders.filter((b) => b.id !== id),
    })),
  updateBillReminder: (id, updates) =>
    set((state) => ({
      billReminders: state.billReminders.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
  setBillReminders: (reminders) => set({ billReminders: reminders }),
}));
