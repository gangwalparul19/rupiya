/**
 * Type definitions for Rupiya app
 * Centralized TypeScript interfaces for all data models
 */

// Expense types
export type PaymentMethodType = 'cash' | 'card' | 'upi' | 'bank' | 'wallet';

export interface Expense {
  id: string;
  userId?: string;
  amount: number;
  category: string;
  categoryId?: string;
  description: string;
  date: Date;
  paymentMethod: PaymentMethodType;
  paymentMethodId?: string;
  paymentMethodName?: string;
  walletId?: string;
  houseId?: string;
  vehicleId?: string;
  currency?: string;
  convertedAmount?: number;
  receiptId?: string;
  receipt?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Income types
export type IncomeSource = 'salary' | 'freelance' | 'investment' | 'gift' | 'bonus' | 'other';

export interface Income {
  id: string;
  userId?: string;
  amount: number;
  source: IncomeSource;
  description: string;
  date: Date;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Budget types
export interface Budget {
  id: string;
  userId?: string;
  month: string;
  totalBudget: number;
  categories: Record<string, number | undefined>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Goal types
export type GoalCategory = 'emergency' | 'vacation' | 'vehicle' | 'property' | 'education' | 'other';
export type GoalPriority = 'high' | 'medium' | 'low';

export interface Goal {
  id: string;
  userId?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: GoalCategory;
  priority: GoalPriority;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Investment types
export type InvestmentType = 'stock' | 'mutual_fund' | 'crypto' | 'real_estate' | 'gold' | 'bonds' | 'other';

export interface Investment {
  id: string;
  userId?: string;
  name: string;
  type: InvestmentType;
  initialAmount: number;
  currentValue: number;
  purchaseDate: Date;
  quantity: number;
  unitPrice: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Category types
export type CategoryType = 'expense' | 'income' | 'both';

export interface Category {
  id: string;
  userId?: string;
  name: string;
  emoji: string;
  color: string;
  type: CategoryType;
  createdAt?: Date;
  updatedAt?: Date;
}

// Calendar event types
export type EventType = 'bill_reminder' | 'recurring_transaction' | 'goal_milestone' | 'custom';

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: Date;
  type: EventType;
  amount?: number;
  category?: string;
  reminderDays: number;
  notificationEnabled: boolean;
  color: string;
  createdAt: Date;
}

// Bill reminder types
export type BillFrequency = 'monthly' | 'quarterly' | 'yearly' | 'one-time';

export interface BillReminder {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: BillFrequency;
  category?: string;
  isPaid: boolean;
  reminderDays: number;
  createdAt: Date;
}

// Recurring transaction types
export interface RecurringTransaction {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  frequency: BillFrequency;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Payment method types (for PaymentMethod component)
export interface PaymentMethod {
  id: string;
  userId: string;
  name: string;
  type: PaymentMethodType;
  isDefault: boolean;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User profile types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currency: string;
  timezone: string;
  theme: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

// Form data types
export interface BudgetFormData {
  month: string;
  totalBudget: string;
  food: string;
  transport: string;
  utilities: string;
  entertainment: string;
  shopping: string;
  health: string;
  other: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  type: EventType;
  amount: string;
  category: string;
  reminderDays: string;
  color: string;
}

export interface BillFormData {
  name: string;
  amount: string;
  dueDate: string;
  frequency: BillFrequency;
  category: string;
  reminderDays: string;
}

export interface CategoryFormData {
  name: string;
  emoji: string;
  color: string;
  type: CategoryType;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

export interface IncomeFormData {
  amount: string;
  source: string;
  description: string;
  date: string;
}

export interface GoalFormData {
  name: string;
  targetAmount: string;
  targetDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export interface InvestmentFormData {
  name: string;
  type: InvestmentType;
  initialAmount: string;
  quantity: string;
  unitPrice: string;
  purchaseDate: string;
  notes: string;
}

// Store state types
export interface AppState {
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  goals: Goal[];
  investments: Investment[];
  categories: Category[];
  calendarEvents: CalendarEvent[];
  billReminders: BillReminder[];
  recurringTransactions: RecurringTransaction[];
  paymentMethods: PaymentMethod[];
  userProfile?: UserProfile;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Analytics types
export interface ExpenseAnalytics {
  totalExpenses: number;
  averageExpense: number;
  highestExpense: number;
  lowestExpense: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
  trend: 'up' | 'down' | 'stable';
}

export interface IncomeAnalytics {
  totalIncome: number;
  averageIncome: number;
  highestIncome: number;
  lowestIncome: number;
  bySource: Record<string, number>;
  byMonth: Record<string, number>;
  trend: 'up' | 'down' | 'stable';
}

export interface BudgetAnalytics {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  byCategory: Record<string, { budget: number; spent: number; remaining: number }>;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Report types
export interface FinancialReport {
  id: string;
  userId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: Record<string, number>;
  createdAt: Date;
}

// Confirm dialog types
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Toast notification types
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Modal types
export interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  maxHeight?: string;
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface ExpenseFilter {
  category?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
}

export interface IncomeFilter {
  source?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  percentage?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}
