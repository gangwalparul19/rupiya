import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import {
  Expense,
  Income,
  Budget,
  Investment,
  Goal,
  House,
  Vehicle,
  Note,
  Document,
  Card,
  UPI,
  BankAccount,
  Wallet,
  Category,
  RecurringTransaction,
  SplitExpense,
  Settlement,
  CalendarEvent,
  BillReminder,
} from './store';

// Helper function to convert Firestore Timestamp to Date
const convertTimestamp = (data: any): any => {
  if (!data) return data;
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// Helper function to convert Date to Firestore Timestamp
const convertToTimestamp = (data: any): any => {
  if (!data) return data;
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Date) {
      converted[key] = Timestamp.fromDate(converted[key]);
    }
  });
  return converted;
};

// Generic CRUD operations
export const firebaseService = {
  // Create
  async create<T>(collectionName: string, data: T, userId: string): Promise<string> {
    try {
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');
      
      const docRef = await addDoc(collection(db, 'users', userId, collectionName), convertToTimestamp(data));
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw error;
    }
  },

  // Read all
  async readAll<T>(collectionName: string, userId: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');
      
      const q = query(collection(db, 'users', userId, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamp(doc.data()),
      })) as T[];
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error);
      throw error;
    }
  },

  // Read single
  async readOne<T>(collectionName: string, userId: string, docId: string): Promise<T | null> {
    try {
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');
      
      const docSnap = await getDocs(query(collection(db, 'users', userId, collectionName), where('__name__', '==', docId)));
      if (docSnap.empty) return null;
      return {
        id: docSnap.docs[0].id,
        ...convertTimestamp(docSnap.docs[0].data()),
      } as T;
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error);
      throw error;
    }
  },

  // Update
  async update<T>(collectionName: string, userId: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');
      
      const docRef = doc(db, 'users', userId, collectionName, docId);
      await updateDoc(docRef, convertToTimestamp(data));
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete
  async delete(collectionName: string, userId: string, docId: string): Promise<void> {
    try {
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');
      
      const docRef = doc(db, 'users', userId, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    }
  },

  // Query with constraints
  async query<T>(collectionName: string, userId: string, constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');
      
      const q = query(collection(db, 'users', userId, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamp(doc.data()),
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  },
};

// Specific collection operations
export const expenseService = {
  async create(expense: Expense, userId: string): Promise<string> {
    return firebaseService.create('expenses', expense, userId);
  },
  async getAll(userId: string): Promise<Expense[]> {
    return firebaseService.readAll('expenses', userId, [orderBy('date', 'desc')]);
  },
  async update(userId: string, expenseId: string, data: Partial<Expense>): Promise<void> {
    return firebaseService.update('expenses', userId, expenseId, data);
  },
  async delete(userId: string, expenseId: string): Promise<void> {
    return firebaseService.delete('expenses', userId, expenseId);
  },
  async getByCategory(userId: string, category: string): Promise<Expense[]> {
    return firebaseService.query('expenses', userId, [where('category', '==', category), orderBy('date', 'desc')]);
  },
  async getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]> {
    return firebaseService.query('expenses', userId, [
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc'),
    ]);
  },
};

export const incomeService = {
  async create(income: Income, userId: string): Promise<string> {
    return firebaseService.create('income', income, userId);
  },
  async getAll(userId: string): Promise<Income[]> {
    return firebaseService.readAll('income', userId, [orderBy('date', 'desc')]);
  },
  async update(userId: string, incomeId: string, data: Partial<Income>): Promise<void> {
    return firebaseService.update('income', userId, incomeId, data);
  },
  async delete(userId: string, incomeId: string): Promise<void> {
    return firebaseService.delete('income', userId, incomeId);
  },
  async getBySource(userId: string, source: string): Promise<Income[]> {
    return firebaseService.query('income', userId, [where('source', '==', source), orderBy('date', 'desc')]);
  },
};

export const budgetService = {
  async create(budget: Budget, userId: string): Promise<string> {
    return firebaseService.create('budgets', budget, userId);
  },
  async getAll(userId: string): Promise<Budget[]> {
    return firebaseService.readAll('budgets', userId);
  },
  async update(userId: string, budgetId: string, data: Partial<Budget>): Promise<void> {
    return firebaseService.update('budgets', userId, budgetId, data);
  },
  async delete(userId: string, budgetId: string): Promise<void> {
    return firebaseService.delete('budgets', userId, budgetId);
  },
  async getByMonth(userId: string, month: string): Promise<Budget[]> {
    return firebaseService.query('budgets', userId, [where('month', '==', month)]);
  },
};

export const investmentService = {
  async create(investment: Investment, userId: string): Promise<string> {
    return firebaseService.create('investments', investment, userId);
  },
  async getAll(userId: string): Promise<Investment[]> {
    return firebaseService.readAll('investments', userId);
  },
  async update(userId: string, investmentId: string, data: Partial<Investment>): Promise<void> {
    return firebaseService.update('investments', userId, investmentId, data);
  },
  async delete(userId: string, investmentId: string): Promise<void> {
    return firebaseService.delete('investments', userId, investmentId);
  },
  async getByType(userId: string, type: string): Promise<Investment[]> {
    return firebaseService.query('investments', userId, [where('type', '==', type)]);
  },
};

export const goalService = {
  async create(goal: Goal, userId: string): Promise<string> {
    return firebaseService.create('goals', goal, userId);
  },
  async getAll(userId: string): Promise<Goal[]> {
    return firebaseService.readAll('goals', userId);
  },
  async update(userId: string, goalId: string, data: Partial<Goal>): Promise<void> {
    return firebaseService.update('goals', userId, goalId, data);
  },
  async delete(userId: string, goalId: string): Promise<void> {
    return firebaseService.delete('goals', userId, goalId);
  },
  async getByCategory(userId: string, category: string): Promise<Goal[]> {
    return firebaseService.query('goals', userId, [where('category', '==', category)]);
  },
};

export const houseService = {
  async create(house: House, userId: string): Promise<string> {
    return firebaseService.create('houses', house, userId);
  },
  async getAll(userId: string): Promise<House[]> {
    return firebaseService.readAll('houses', userId);
  },
  async update(userId: string, houseId: string, data: Partial<House>): Promise<void> {
    return firebaseService.update('houses', userId, houseId, data);
  },
  async delete(userId: string, houseId: string): Promise<void> {
    return firebaseService.delete('houses', userId, houseId);
  },
};

export const vehicleService = {
  async create(vehicle: Vehicle, userId: string): Promise<string> {
    return firebaseService.create('vehicles', vehicle, userId);
  },
  async getAll(userId: string): Promise<Vehicle[]> {
    return firebaseService.readAll('vehicles', userId);
  },
  async update(userId: string, vehicleId: string, data: Partial<Vehicle>): Promise<void> {
    return firebaseService.update('vehicles', userId, vehicleId, data);
  },
  async delete(userId: string, vehicleId: string): Promise<void> {
    return firebaseService.delete('vehicles', userId, vehicleId);
  },
};

export const noteService = {
  async create(note: Note, userId: string): Promise<string> {
    return firebaseService.create('notes', note, userId);
  },
  async getAll(userId: string): Promise<Note[]> {
    return firebaseService.readAll('notes', userId, [orderBy('date', 'desc')]);
  },
  async update(userId: string, noteId: string, data: Partial<Note>): Promise<void> {
    return firebaseService.update('notes', userId, noteId, data);
  },
  async delete(userId: string, noteId: string): Promise<void> {
    return firebaseService.delete('notes', userId, noteId);
  },
};

export const documentService = {
  async create(document: Document, userId: string): Promise<string> {
    return firebaseService.create('documents', document, userId);
  },
  async getAll(userId: string): Promise<Document[]> {
    return firebaseService.readAll('documents', userId, [orderBy('uploadedAt', 'desc')]);
  },
  async update(userId: string, documentId: string, data: Partial<Document>): Promise<void> {
    return firebaseService.update('documents', userId, documentId, data);
  },
  async delete(userId: string, documentId: string): Promise<void> {
    return firebaseService.delete('documents', userId, documentId);
  },
};

export const categoryService = {
  async create(category: Category, userId: string): Promise<string> {
    return firebaseService.create('categories', category, userId);
  },
  async getAll(userId: string): Promise<Category[]> {
    return firebaseService.readAll('categories', userId);
  },
  async update(userId: string, categoryId: string, data: Partial<Category>): Promise<void> {
    return firebaseService.update('categories', userId, categoryId, data);
  },
  async delete(userId: string, categoryId: string): Promise<void> {
    return firebaseService.delete('categories', userId, categoryId);
  },
};

export const recurringTransactionService = {
  async create(transaction: RecurringTransaction, userId: string): Promise<string> {
    return firebaseService.create('recurringTransactions', transaction, userId);
  },
  async getAll(userId: string): Promise<RecurringTransaction[]> {
    return firebaseService.readAll('recurringTransactions', userId);
  },
  async update(userId: string, transactionId: string, data: Partial<RecurringTransaction>): Promise<void> {
    return firebaseService.update('recurringTransactions', userId, transactionId, data);
  },
  async delete(userId: string, transactionId: string): Promise<void> {
    return firebaseService.delete('recurringTransactions', userId, transactionId);
  },
};

export const splitExpenseService = {
  async create(splitExpense: SplitExpense, userId: string): Promise<string> {
    return firebaseService.create('splitExpenses', splitExpense, userId);
  },
  async getAll(userId: string): Promise<SplitExpense[]> {
    return firebaseService.readAll('splitExpenses', userId, [orderBy('date', 'desc')]);
  },
  async update(userId: string, splitExpenseId: string, data: Partial<SplitExpense>): Promise<void> {
    return firebaseService.update('splitExpenses', userId, splitExpenseId, data);
  },
  async delete(userId: string, splitExpenseId: string): Promise<void> {
    return firebaseService.delete('splitExpenses', userId, splitExpenseId);
  },
};

export const settlementService = {
  async create(settlement: Settlement, userId: string): Promise<string> {
    return firebaseService.create('settlements', settlement, userId);
  },
  async getAll(userId: string): Promise<Settlement[]> {
    return firebaseService.readAll('settlements', userId, [orderBy('createdAt', 'desc')]);
  },
  async update(userId: string, settlementId: string, data: Partial<Settlement>): Promise<void> {
    return firebaseService.update('settlements', userId, settlementId, data);
  },
  async delete(userId: string, settlementId: string): Promise<void> {
    return firebaseService.delete('settlements', userId, settlementId);
  },
};

export const calendarEventService = {
  async create(event: CalendarEvent, userId: string): Promise<string> {
    return firebaseService.create('calendarEvents', event, userId);
  },
  async getAll(userId: string): Promise<CalendarEvent[]> {
    return firebaseService.readAll('calendarEvents', userId, [orderBy('date', 'desc')]);
  },
  async update(userId: string, eventId: string, data: Partial<CalendarEvent>): Promise<void> {
    return firebaseService.update('calendarEvents', userId, eventId, data);
  },
  async delete(userId: string, eventId: string): Promise<void> {
    return firebaseService.delete('calendarEvents', userId, eventId);
  },
};

export const billReminderService = {
  async create(reminder: BillReminder, userId: string): Promise<string> {
    return firebaseService.create('billReminders', reminder, userId);
  },
  async getAll(userId: string): Promise<BillReminder[]> {
    return firebaseService.readAll('billReminders', userId, [orderBy('dueDate', 'asc')]);
  },
  async update(userId: string, reminderId: string, data: Partial<BillReminder>): Promise<void> {
    return firebaseService.update('billReminders', userId, reminderId, data);
  },
  async delete(userId: string, reminderId: string): Promise<void> {
    return firebaseService.delete('billReminders', userId, reminderId);
  },
};

export const walletService = {
  async create(wallet: Wallet, userId: string): Promise<string> {
    return firebaseService.create('wallets', wallet, userId);
  },
  async getAll(userId: string): Promise<Wallet[]> {
    return firebaseService.readAll('wallets', userId);
  },
  async update(userId: string, walletId: string, data: Partial<Wallet>): Promise<void> {
    return firebaseService.update('wallets', userId, walletId, data);
  },
  async delete(userId: string, walletId: string): Promise<void> {
    return firebaseService.delete('wallets', userId, walletId);
  },
};

export const cardService = {
  async create(card: Card, userId: string): Promise<string> {
    return firebaseService.create('cards', card, userId);
  },
  async getAll(userId: string): Promise<Card[]> {
    return firebaseService.readAll('cards', userId);
  },
  async delete(userId: string, cardId: string): Promise<void> {
    return firebaseService.delete('cards', userId, cardId);
  },
};

export const upiService = {
  async create(upi: UPI, userId: string): Promise<string> {
    return firebaseService.create('upiAccounts', upi, userId);
  },
  async getAll(userId: string): Promise<UPI[]> {
    return firebaseService.readAll('upiAccounts', userId);
  },
  async delete(userId: string, upiId: string): Promise<void> {
    return firebaseService.delete('upiAccounts', userId, upiId);
  },
};

export const bankAccountService = {
  async create(account: BankAccount, userId: string): Promise<string> {
    return firebaseService.create('bankAccounts', account, userId);
  },
  async getAll(userId: string): Promise<BankAccount[]> {
    return firebaseService.readAll('bankAccounts', userId);
  },
  async delete(userId: string, accountId: string): Promise<void> {
    return firebaseService.delete('bankAccounts', userId, accountId);
  },
};
