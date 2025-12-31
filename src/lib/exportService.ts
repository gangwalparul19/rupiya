'use client';

import { Expense, Income, Budget } from './store';

// CSV Export for Expenses
export const exportExpensesToCSV = (expenses: Expense[], filename = 'expenses.csv') => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method'];
  const rows = expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    e.description,
    e.category,
    e.amount,
    e.paymentMethod,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadCSV(csvContent, filename);
};

// CSV Export for Income
export const exportIncomeToCSV = (income: Income[], filename = 'income.csv') => {
  const headers = ['Date', 'Description', 'Source', 'Amount', 'Category'];
  const rows = income.map((i) => [
    new Date(i.date).toLocaleDateString(),
    i.description,
    i.source,
    i.amount,
    i.category || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadCSV(csvContent, filename);
};

// CSV Export for Budgets
export const exportBudgetsToCSV = (budgets: Budget[], filename = 'budgets.csv') => {
  const headers = ['Month', 'Total Budget', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];
  const rows = budgets.map((b) => [
    b.month,
    b.totalBudget,
    b.categories.food || 0,
    b.categories.transport || 0,
    b.categories.utilities || 0,
    b.categories.entertainment || 0,
    b.categories.shopping || 0,
    b.categories.health || 0,
    b.categories.other || 0,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadCSV(csvContent, filename);
};

// Helper function to download CSV
const downloadCSV = (content: string, filename: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// PDF Export (requires jsPDF library)
export const generateFinancialReport = (
  expenses: Expense[],
  income: Income[],
  month: string
) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  // Income source breakdown
  const sourceBreakdown: Record<string, number> = {};
  income.forEach((i) => {
    sourceBreakdown[i.source] = (sourceBreakdown[i.source] || 0) + i.amount;
  });

  return {
    month,
    totalIncome,
    totalExpenses,
    netCashFlow,
    savingsRate: totalIncome > 0 ? ((netCashFlow / totalIncome) * 100).toFixed(2) : '0',
    categoryBreakdown,
    sourceBreakdown,
    transactionCount: expenses.length + income.length,
  };
};

// Export Summary Report
export const exportSummaryReport = (
  expenses: Expense[],
  income: Income[],
  filename = 'financial_report.csv'
) => {
  const report = generateFinancialReport(expenses, income, new Date().toISOString().split('T')[0]);

  const csvContent = `Financial Summary Report
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
Total Income,${report.totalIncome}
Total Expenses,${report.totalExpenses}
Net Cash Flow,${report.netCashFlow}
Savings Rate,${report.savingsRate}%

EXPENSE BREAKDOWN BY CATEGORY
${Object.entries(report.categoryBreakdown)
  .map(([category, amount]) => `${category},${amount}`)
  .join('\n')}

INCOME BREAKDOWN BY SOURCE
${Object.entries(report.sourceBreakdown)
  .map(([source, amount]) => `${source},${amount}`)
  .join('\n')}
`;

  downloadCSV(csvContent, filename);
};