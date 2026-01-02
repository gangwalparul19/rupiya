'use client';

import { useEffect } from 'react';
import { onAuthChange } from '@/lib/authService';
import { useAppStore } from '@/lib/store';
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
  cardService,
  upiService,
  bankAccountService,
  walletService,
  houseHelpService,
  houseHelpPaymentService,
} from '@/lib/firebaseService';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((state) => state.setUser);
  const setIsAuthenticated = useAppStore((state) => state.setIsAuthenticated);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setCategories = useAppStore((state) => state.setCategories);
  const setExpenses = useAppStore((state) => state.setExpenses);
  const setIncome = useAppStore((state) => state.setIncome);
  const setBudgets = useAppStore((state) => state.setBudgets);
  const setInvestments = useAppStore((state) => state.setInvestments);
  const setGoals = useAppStore((state) => state.setGoals);
  const setRecurringTransactions = useAppStore((state) => state.setRecurringTransactions);
  const setHouses = useAppStore((state) => state.setHouses);
  const setVehicles = useAppStore((state) => state.setVehicles);
  const setNotes = useAppStore((state) => state.setNotes);
  const setDocuments = useAppStore((state) => state.setDocuments);
  const setCards = useAppStore((state) => state.setCards);
  const setUPIs = useAppStore((state) => state.setUPIs);
  const setBankAccounts = useAppStore((state) => state.setBankAccounts);
  const setWallets = useAppStore((state) => state.setWallets);
  const setHouseHelps = useAppStore((state) => state.setHouseHelps);
  const setHouseHelpPayments = useAppStore((state) => state.setHouseHelpPayments);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      setIsAuthenticated(!!user);

      if (user) {
        try {
          // Load all user data from Firebase
          const [
            categories,
            expenses,
            income,
            budgets,
            investments,
            goals,
            houses,
            vehicles,
            notes,
            documents,
            cards,
            upis,
            banks,
            wallets,
            recurringTransactions,
            houseHelps,
            houseHelpPayments,
          ] = await Promise.all([
            categoryService.getAll(user.uid),
            expenseService.getAll(user.uid),
            incomeService.getAll(user.uid),
            budgetService.getAll(user.uid),
            investmentService.getAll(user.uid),
            goalService.getAll(user.uid),
            houseService.getAll(user.uid),
            vehicleService.getAll(user.uid),
            noteService.getAll(user.uid),
            documentService.getAll(user.uid),
            cardService.getAll(user.uid),
            upiService.getAll(user.uid),
            bankAccountService.getAll(user.uid),
            walletService.getAll(user.uid),
            recurringTransactionService.getAll(user.uid),
            houseHelpService.getAll(user.uid),
            houseHelpPaymentService.getAll(user.uid),
          ]);

          setCategories(categories);
          setExpenses(expenses);
          setIncome(income);
          setBudgets(budgets);
          setInvestments(investments);
          setGoals(goals);
          setHouses(houses);
          setVehicles(vehicles);
          setNotes(notes);
          setDocuments(documents);
          setCards(cards);
          setUPIs(upis);
          setBankAccounts(banks);
          setWallets(wallets);
          setRecurringTransactions(recurringTransactions);
          setHouseHelps(houseHelps);
          setHouseHelpPayments(houseHelpPayments);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Clear all data on logout
        setCategories([]);
        setExpenses([]);
        setIncome([]);
        setBudgets([]);
        setInvestments([]);
        setGoals([]);
        setHouses([]);
        setVehicles([]);
        setNotes([]);
        setDocuments([]);
        setCards([]);
        setUPIs([]);
        setBankAccounts([]);
        setWallets([]);
        setRecurringTransactions([]);
        setHouseHelps([]);
        setHouseHelpPayments([]);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [
    setUser,
    setIsAuthenticated,
    setIsLoading,
    setCategories,
    setExpenses,
    setIncome,
    setBudgets,
    setInvestments,
    setGoals,
    setHouses,
    setVehicles,
    setNotes,
    setDocuments,
    setCards,
    setUPIs,
    setBankAccounts,
    setWallets,
    setRecurringTransactions,
    setHouseHelps,
    setHouseHelpPayments,
  ]);

  return <>{children}</>;
}
