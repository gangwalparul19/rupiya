import { create } from 'zustand';
import { useAppStore } from './store';
import {
  expenseService,
  incomeService,
  budgetService,
  investmentService,
  goalService,
  houseService,
  vehicleService,
  noteService,
  documentService,
  categoryService,
  recurringTransactionService,
  splitExpenseService,
  settlementService,
  calendarEventService,
  billReminderService,
  walletService,
  cardService,
  upiService,
  bankAccountService,
  houseHelpService,
  houseHelpPaymentService,
} from './firebaseService';
import { authService, AuthUser } from './firebaseAuth';

interface FirebaseStoreState {
  currentUser: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  setCurrentUser: (user: AuthUser | null) => void;

  // Sync actions
  syncExpensesFromFirebase: () => Promise<void>;
  syncIncomeFromFirebase: () => Promise<void>;
  syncBudgetsFromFirebase: () => Promise<void>;
  syncInvestmentsFromFirebase: () => Promise<void>;
  syncGoalsFromFirebase: () => Promise<void>;
  syncHousesFromFirebase: () => Promise<void>;
  syncVehiclesFromFirebase: () => Promise<void>;
  syncNotesFromFirebase: () => Promise<void>;
  syncDocumentsFromFirebase: () => Promise<void>;
  syncCategoriesFromFirebase: () => Promise<void>;
  syncRecurringTransactionsFromFirebase: () => Promise<void>;
  syncSplitExpensesFromFirebase: () => Promise<void>;
  syncSettlementsFromFirebase: () => Promise<void>;
  syncCalendarEventsFromFirebase: () => Promise<void>;
  syncBillRemindersFromFirebase: () => Promise<void>;
  syncWalletsFromFirebase: () => Promise<void>;
  syncCardsFromFirebase: () => Promise<void>;
  syncUPIFromFirebase: () => Promise<void>;
  syncBankAccountsFromFirebase: () => Promise<void>;
  syncHouseHelpsFromFirebase: () => Promise<void>;
  syncHouseHelpPaymentsFromFirebase: () => Promise<void>;

  // Persist actions
  persistExpense: (expense: any) => Promise<void>;
  persistIncome: (income: any) => Promise<void>;
  persistBudget: (budget: any) => Promise<void>;
  persistInvestment: (investment: any) => Promise<void>;
  persistGoal: (goal: any) => Promise<void>;
  persistHouse: (house: any) => Promise<void>;
  persistVehicle: (vehicle: any) => Promise<void>;
  persistNote: (note: any) => Promise<void>;
  persistDocument: (document: any) => Promise<void>;
  persistCategory: (category: any) => Promise<void>;
  persistRecurringTransaction: (transaction: any) => Promise<void>;
  persistSplitExpense: (splitExpense: any) => Promise<void>;
  persistSettlement: (settlement: any) => Promise<void>;
  persistCalendarEvent: (event: any) => Promise<void>;
  persistBillReminder: (reminder: any) => Promise<void>;
  persistWallet: (wallet: any) => Promise<void>;
  persistCard: (card: any) => Promise<void>;
  persistUPI: (upi: any) => Promise<void>;
  persistBankAccount: (account: any) => Promise<void>;
  persistHouseHelp: (help: any) => Promise<void>;
  persistHouseHelpPayment: (payment: any) => Promise<void>;

  // Sync all
  syncAllFromFirebase: () => Promise<void>;

  // Delete actions
  deleteExpenseFromFirebase: (expenseId: string) => Promise<void>;
  deleteIncomeFromFirebase: (incomeId: string) => Promise<void>;
  deleteBudgetFromFirebase: (budgetId: string) => Promise<void>;
  deleteInvestmentFromFirebase: (investmentId: string) => Promise<void>;
  deleteGoalFromFirebase: (goalId: string) => Promise<void>;
  deleteHouseFromFirebase: (houseId: string) => Promise<void>;
  deleteVehicleFromFirebase: (vehicleId: string) => Promise<void>;
  deleteNoteFromFirebase: (noteId: string) => Promise<void>;
  deleteDocumentFromFirebase: (documentId: string) => Promise<void>;
  deleteCategoryFromFirebase: (categoryId: string) => Promise<void>;
  deleteRecurringTransactionFromFirebase: (transactionId: string) => Promise<void>;
  deleteSplitExpenseFromFirebase: (splitExpenseId: string) => Promise<void>;
  deleteSettlementFromFirebase: (settlementId: string) => Promise<void>;
  deleteCalendarEventFromFirebase: (eventId: string) => Promise<void>;
  deleteBillReminderFromFirebase: (reminderId: string) => Promise<void>;
  deleteWalletFromFirebase: (walletId: string) => Promise<void>;
  deleteCardFromFirebase: (cardId: string) => Promise<void>;
  deleteUPIFromFirebase: (upiId: string) => Promise<void>;
  deleteBankAccountFromFirebase: (accountId: string) => Promise<void>;
  deleteHouseHelpFromFirebase: (helpId: string) => Promise<void>;
  deleteHouseHelpPaymentFromFirebase: (paymentId: string) => Promise<void>;
}

export const useFirebaseStore = create<FirebaseStoreState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  // Auth actions
  signUp: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp(email, password, displayName);
      set({ currentUser: user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ currentUser: user, isLoading: false });
      // Sync all data after sign in
      await get().syncAllFromFirebase();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signOut();
      set({ currentUser: null, isLoading: false });
      // Clear local store
      useAppStore.setState({
        expenses: [],
        income: [],
        budgets: [],
        investments: [],
        goals: [],
        houses: [],
        vehicles: [],
        notes: [],
        documents: [],
        categories: [],
        recurringTransactions: [],
        splitExpenses: [],
        settlements: [],
        calendarEvents: [],
        billReminders: [],
        wallets: [],
        cards: [],
        upiAccounts: [],
        bankAccounts: [],
        houseHelps: [],
        houseHelpPayments: [],
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  sendPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.sendPasswordReset(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setCurrentUser: (user: AuthUser | null) => {
    set({ currentUser: user });
  },

  // Sync actions
  syncExpensesFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const expenses = await expenseService.getAll(currentUser.uid);
      useAppStore.setState({ expenses });
    } catch (error) {
      console.error('Error syncing expenses:', error);
    }
  },

  syncIncomeFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const income = await incomeService.getAll(currentUser.uid);
      useAppStore.setState({ income });
    } catch (error) {
      console.error('Error syncing income:', error);
    }
  },

  syncBudgetsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const budgets = await budgetService.getAll(currentUser.uid);
      useAppStore.setState({ budgets });
    } catch (error) {
      console.error('Error syncing budgets:', error);
    }
  },

  syncInvestmentsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const investments = await investmentService.getAll(currentUser.uid);
      useAppStore.setState({ investments });
    } catch (error) {
      console.error('Error syncing investments:', error);
    }
  },

  syncGoalsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const goals = await goalService.getAll(currentUser.uid);
      useAppStore.setState({ goals });
    } catch (error) {
      console.error('Error syncing goals:', error);
    }
  },

  syncHousesFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const houses = await houseService.getAll(currentUser.uid);
      useAppStore.setState({ houses });
    } catch (error) {
      console.error('Error syncing houses:', error);
    }
  },

  syncVehiclesFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const vehicles = await vehicleService.getAll(currentUser.uid);
      useAppStore.setState({ vehicles });
    } catch (error) {
      console.error('Error syncing vehicles:', error);
    }
  },

  syncNotesFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const notes = await noteService.getAll(currentUser.uid);
      useAppStore.setState({ notes });
    } catch (error) {
      console.error('Error syncing notes:', error);
    }
  },

  syncDocumentsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const documents = await documentService.getAll(currentUser.uid);
      useAppStore.setState({ documents });
    } catch (error) {
      console.error('Error syncing documents:', error);
    }
  },

  syncCategoriesFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const categories = await categoryService.getAll(currentUser.uid);
      useAppStore.setState({ categories });
    } catch (error) {
      console.error('Error syncing categories:', error);
    }
  },

  syncRecurringTransactionsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const recurringTransactions = await recurringTransactionService.getAll(currentUser.uid);
      useAppStore.setState({ recurringTransactions });
    } catch (error) {
      console.error('Error syncing recurring transactions:', error);
    }
  },

  syncSplitExpensesFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const splitExpenses = await splitExpenseService.getAll(currentUser.uid);
      useAppStore.setState({ splitExpenses });
    } catch (error) {
      console.error('Error syncing split expenses:', error);
    }
  },

  syncSettlementsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const settlements = await settlementService.getAll(currentUser.uid);
      useAppStore.setState({ settlements });
    } catch (error) {
      console.error('Error syncing settlements:', error);
    }
  },

  syncCalendarEventsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const calendarEvents = await calendarEventService.getAll(currentUser.uid);
      useAppStore.setState({ calendarEvents });
    } catch (error) {
      console.error('Error syncing calendar events:', error);
    }
  },

  syncBillRemindersFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const billReminders = await billReminderService.getAll(currentUser.uid);
      useAppStore.setState({ billReminders });
    } catch (error) {
      console.error('Error syncing bill reminders:', error);
    }
  },

  syncWalletsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const wallets = await walletService.getAll(currentUser.uid);
      useAppStore.setState({ wallets });
    } catch (error) {
      console.error('Error syncing wallets:', error);
    }
  },

  syncCardsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const cards = await cardService.getAll(currentUser.uid);
      useAppStore.setState({ cards });
    } catch (error) {
      console.error('Error syncing cards:', error);
    }
  },

  syncUPIFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const upiAccounts = await upiService.getAll(currentUser.uid);
      useAppStore.setState({ upiAccounts });
    } catch (error) {
      console.error('Error syncing UPI accounts:', error);
    }
  },

  syncBankAccountsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const bankAccounts = await bankAccountService.getAll(currentUser.uid);
      useAppStore.setState({ bankAccounts });
    } catch (error) {
      console.error('Error syncing bank accounts:', error);
    }
  },

  syncHouseHelpsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const houseHelps = await houseHelpService.getAll(currentUser.uid);
      useAppStore.setState({ houseHelps });
    } catch (error) {
      console.error('Error syncing house helps:', error);
    }
  },

  syncHouseHelpPaymentsFromFirebase: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const houseHelpPayments = await houseHelpPaymentService.getAll(currentUser.uid);
      useAppStore.setState({ houseHelpPayments });
    } catch (error) {
      console.error('Error syncing house help payments:', error);
    }
  },

  syncAllFromFirebase: async () => {
    const firebaseStore = get();
    await Promise.all([
      firebaseStore.syncExpensesFromFirebase(),
      firebaseStore.syncIncomeFromFirebase(),
      firebaseStore.syncBudgetsFromFirebase(),
      firebaseStore.syncInvestmentsFromFirebase(),
      firebaseStore.syncGoalsFromFirebase(),
      firebaseStore.syncHousesFromFirebase(),
      firebaseStore.syncVehiclesFromFirebase(),
      firebaseStore.syncNotesFromFirebase(),
      firebaseStore.syncDocumentsFromFirebase(),
      firebaseStore.syncCategoriesFromFirebase(),
      firebaseStore.syncRecurringTransactionsFromFirebase(),
      firebaseStore.syncSplitExpensesFromFirebase(),
      firebaseStore.syncSettlementsFromFirebase(),
      firebaseStore.syncCalendarEventsFromFirebase(),
      firebaseStore.syncBillRemindersFromFirebase(),
      firebaseStore.syncWalletsFromFirebase(),
      firebaseStore.syncCardsFromFirebase(),
      firebaseStore.syncUPIFromFirebase(),
      firebaseStore.syncBankAccountsFromFirebase(),
      firebaseStore.syncHouseHelpsFromFirebase(),
      firebaseStore.syncHouseHelpPaymentsFromFirebase(),
    ]);
  },

  // Persist actions
  persistExpense: async (expense: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await expenseService.create(expense, currentUser.uid);
    } catch (error) {
      console.error('Error persisting expense:', error);
    }
  },

  persistIncome: async (income: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await incomeService.create(income, currentUser.uid);
    } catch (error) {
      console.error('Error persisting income:', error);
    }
  },

  persistBudget: async (budget: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await budgetService.create(budget, currentUser.uid);
    } catch (error) {
      console.error('Error persisting budget:', error);
    }
  },

  persistInvestment: async (investment: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await investmentService.create(investment, currentUser.uid);
    } catch (error) {
      console.error('Error persisting investment:', error);
    }
  },

  persistGoal: async (goal: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await goalService.create(goal, currentUser.uid);
    } catch (error) {
      console.error('Error persisting goal:', error);
    }
  },

  persistHouse: async (house: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await houseService.create(house, currentUser.uid);
    } catch (error) {
      console.error('Error persisting house:', error);
    }
  },

  persistVehicle: async (vehicle: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await vehicleService.create(vehicle, currentUser.uid);
    } catch (error) {
      console.error('Error persisting vehicle:', error);
    }
  },

  persistNote: async (note: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await noteService.create(note, currentUser.uid);
    } catch (error) {
      console.error('Error persisting note:', error);
    }
  },

  persistDocument: async (document: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await documentService.create(document, currentUser.uid);
    } catch (error) {
      console.error('Error persisting document:', error);
    }
  },

  persistCategory: async (category: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await categoryService.create(category, currentUser.uid);
    } catch (error) {
      console.error('Error persisting category:', error);
    }
  },

  persistRecurringTransaction: async (transaction: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await recurringTransactionService.create(transaction, currentUser.uid);
    } catch (error) {
      console.error('Error persisting recurring transaction:', error);
    }
  },

  persistSplitExpense: async (splitExpense: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await splitExpenseService.create(splitExpense, currentUser.uid);
    } catch (error) {
      console.error('Error persisting split expense:', error);
    }
  },

  persistSettlement: async (settlement: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await settlementService.create(settlement, currentUser.uid);
    } catch (error) {
      console.error('Error persisting settlement:', error);
    }
  },

  persistCalendarEvent: async (event: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await calendarEventService.create(event, currentUser.uid);
    } catch (error) {
      console.error('Error persisting calendar event:', error);
    }
  },

  persistBillReminder: async (reminder: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await billReminderService.create(reminder, currentUser.uid);
    } catch (error) {
      console.error('Error persisting bill reminder:', error);
    }
  },

  persistWallet: async (wallet: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await walletService.create(wallet, currentUser.uid);
    } catch (error) {
      console.error('Error persisting wallet:', error);
    }
  },

  persistCard: async (card: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await cardService.create(card, currentUser.uid);
    } catch (error) {
      console.error('Error persisting card:', error);
    }
  },

  persistUPI: async (upi: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await upiService.create(upi, currentUser.uid);
    } catch (error) {
      console.error('Error persisting UPI:', error);
    }
  },

  persistBankAccount: async (account: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await bankAccountService.create(account, currentUser.uid);
    } catch (error) {
      console.error('Error persisting bank account:', error);
    }
  },

  persistHouseHelp: async (help: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await houseHelpService.create(help, currentUser.uid);
    } catch (error) {
      console.error('Error persisting house help:', error);
    }
  },

  persistHouseHelpPayment: async (payment: any) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await houseHelpPaymentService.create(payment, currentUser.uid);
    } catch (error) {
      console.error('Error persisting house help payment:', error);
    }
  },

  // Delete actions
  deleteExpenseFromFirebase: async (expenseId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await expenseService.delete(currentUser.uid, expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  },

  deleteIncomeFromFirebase: async (incomeId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await incomeService.delete(currentUser.uid, incomeId);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  },

  deleteBudgetFromFirebase: async (budgetId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await budgetService.delete(currentUser.uid, budgetId);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  },

  deleteInvestmentFromFirebase: async (investmentId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await investmentService.delete(currentUser.uid, investmentId);
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  },

  deleteGoalFromFirebase: async (goalId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await goalService.delete(currentUser.uid, goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  },

  deleteHouseFromFirebase: async (houseId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await houseService.delete(currentUser.uid, houseId);
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  },

  deleteVehicleFromFirebase: async (vehicleId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await vehicleService.delete(currentUser.uid, vehicleId);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  },

  deleteNoteFromFirebase: async (noteId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await noteService.delete(currentUser.uid, noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },

  deleteDocumentFromFirebase: async (documentId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await documentService.delete(currentUser.uid, documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  },

  deleteCategoryFromFirebase: async (categoryId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await categoryService.delete(currentUser.uid, categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },

  deleteRecurringTransactionFromFirebase: async (transactionId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await recurringTransactionService.delete(currentUser.uid, transactionId);
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
    }
  },

  deleteSplitExpenseFromFirebase: async (splitExpenseId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await splitExpenseService.delete(currentUser.uid, splitExpenseId);
    } catch (error) {
      console.error('Error deleting split expense:', error);
    }
  },

  deleteSettlementFromFirebase: async (settlementId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await settlementService.delete(currentUser.uid, settlementId);
    } catch (error) {
      console.error('Error deleting settlement:', error);
    }
  },

  deleteCalendarEventFromFirebase: async (eventId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await calendarEventService.delete(currentUser.uid, eventId);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
    }
  },

  deleteBillReminderFromFirebase: async (reminderId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await billReminderService.delete(currentUser.uid, reminderId);
    } catch (error) {
      console.error('Error deleting bill reminder:', error);
    }
  },

  deleteWalletFromFirebase: async (walletId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await walletService.delete(currentUser.uid, walletId);
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  },

  deleteCardFromFirebase: async (cardId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await cardService.delete(currentUser.uid, cardId);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  },

  deleteUPIFromFirebase: async (upiId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await upiService.delete(currentUser.uid, upiId);
    } catch (error) {
      console.error('Error deleting UPI:', error);
    }
  },

  deleteBankAccountFromFirebase: async (accountId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await bankAccountService.delete(currentUser.uid, accountId);
    } catch (error) {
      console.error('Error deleting bank account:', error);
    }
  },

  deleteHouseHelpFromFirebase: async (helpId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await houseHelpService.delete(currentUser.uid, helpId);
    } catch (error) {
      console.error('Error deleting house help:', error);
    }
  },

  deleteHouseHelpPaymentFromFirebase: async (paymentId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await houseHelpPaymentService.delete(currentUser.uid, paymentId);
    } catch (error) {
      console.error('Error deleting house help payment:', error);
    }
  },
}));

// Helper function to sync all data - removed as it's now part of the store
