'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AnalyticsPage() {
  const { expenses, income, budgets, investments, goals } = useAppStore();

  const analytics = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const netCashFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netCashFlow / totalIncome) * 100).toFixed(2) : '0';

    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((exp) => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    const incomeBySource: Record<string, number> = {};
    income.forEach((inc) => {
      incomeBySource[inc.source] = (incomeBySource[inc.source] || 0) + inc.amount;
    });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const investmentGain = totalCurrentValue - totalInvested;
    const investmentReturn = totalInvested > 0 ? ((investmentGain / totalInvested) * 100).toFixed(2) : '0';

    const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalGoalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const goalProgress = totalGoalTarget > 0 ? ((totalGoalSaved / totalGoalTarget) * 100).toFixed(2) : '0';

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalBudget, 0);
    const budgetUtilization = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(2) : '0';

    return {
      totalExpenses,
      totalIncome,
      netCashFlow,
      savingsRate,
      expensesByCategory,
      incomeBySource,
      totalInvested,
      totalCurrentValue,
      investmentGain,
      investmentReturn,
      totalGoalTarget,
      totalGoalSaved,
      goalProgress,
      totalBudget,
      budgetUtilization,
    };
  }, [expenses, income, budgets, investments, goals]);

  const handleExportReport = () => {
    const report = `
RUPIYA FINANCIAL REPORT
Generated: ${new Date().toLocaleString()}

=== INCOME & EXPENSE SUMMARY ===
Total Income: ₹${analytics.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Total Expenses: ₹${analytics.totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Net Cash Flow: ₹${analytics.netCashFlow.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Savings Rate: ${analytics.savingsRate}%

=== EXPENSES BY CATEGORY ===
${Object.entries(analytics.expensesByCategory)
  .sort(([, a], [, b]) => b - a)
  .map(([category, amount]) => `${category}: ₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`)
  .join('\n')}

=== INCOME BY SOURCE ===
${Object.entries(analytics.incomeBySource)
  .sort(([, a], [, b]) => b - a)
  .map(([source, amount]) => `${source}: ₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`)
  .join('\n')}

=== INVESTMENT SUMMARY ===
Total Invested: ₹${analytics.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Current Value: ₹${analytics.totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Investment Gain/Loss: ₹${analytics.investmentGain.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Return %: ${analytics.investmentReturn}%

=== GOALS SUMMARY ===
Total Goal Target: ₹${analytics.totalGoalTarget.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Total Saved: ₹${analytics.totalGoalSaved.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Progress: ${analytics.goalProgress}%

=== BUDGET SUMMARY ===
Total Budget: ₹${analytics.totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Budget Utilization: ${analytics.budgetUtilization}%

=== FINANCIAL HEALTH SCORE ===
${
  parseFloat(analytics.savingsRate) > 20
    ? '✅ Excellent: Savings rate above 20%'
    : parseFloat(analytics.savingsRate) > 10
      ? '🟢 Good: Savings rate above 10%'
      : parseFloat(analytics.savingsRate) > 0
        ? '🟡 Fair: Positive savings rate'
        : '🔴 Poor: Negative savings rate'
}

${
  parseFloat(analytics.investmentReturn) > 10
    ? '✅ Strong Investment Returns'
    : parseFloat(analytics.investmentReturn) > 0
      ? '🟢 Positive Investment Returns'
      : '🔴 Negative Investment Returns'
}

${
  parseFloat(analytics.goalProgress) > 75
    ? '✅ On Track with Goals'
    : parseFloat(analytics.goalProgress) > 50
      ? '🟡 Making Progress on Goals'
      : '🔴 Behind on Goals'
}

${
  parseFloat(analytics.budgetUtilization) < 80
    ? '✅ Good Budget Control'
    : parseFloat(analytics.budgetUtilization) < 100
      ? '🟡 Budget Nearly Full'
      : '🔴 Budget Exceeded'
}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">📊 Analytics & Reports</h1>
          <p className="text-secondary">Comprehensive financial analysis</p>
        </div>

        <div className="mb-6">
          <button
            onClick={handleExportReport}
            className="w-full md:w-auto btn btn-success"
          >
            📄 Export Report
          </button>
        </div>

        {/* Key Metrics - 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-3 md:p-4 text-white">
            <p className="text-xs text-green-100 mb-1">Total Income</p>
            <p className="text-lg md:text-2xl font-bold">{formatAmount(analytics.totalIncome)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-3 md:p-4 text-white">
            <p className="text-xs text-red-100 mb-1">Total Expenses</p>
            <p className="text-lg md:text-2xl font-bold">{formatAmount(analytics.totalExpenses)}</p>
          </div>

          <div className={`bg-gradient-to-br ${analytics.netCashFlow >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-600 to-orange-700'} rounded-lg p-3 md:p-4 text-white`}>
            <p className="text-xs mb-1">{analytics.netCashFlow >= 0 ? 'Net Savings' : 'Net Deficit'}</p>
            <p className="text-lg md:text-2xl font-bold">{formatAmount(analytics.netCashFlow)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-3 md:p-4 text-white">
            <p className="text-xs text-purple-100 mb-1">Savings Rate</p>
            <p className="text-lg md:text-2xl font-bold">{analytics.savingsRate}%</p>
          </div>
        </div>

        {/* Detailed Analytics - Stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
          {/* Expenses by Category */}
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold text-white mb-3">Expenses by Category</h3>
            <div className="space-y-2">
              {Object.entries(analytics.expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([category, amount]) => {
                  const percentage = (amount / analytics.totalExpenses) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-300 truncate">{category}</span>
                        <span className="text-xs font-semibold text-white ml-2">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Income by Source */}
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold text-white mb-3">Income by Source</h3>
            <div className="space-y-2">
              {Object.entries(analytics.incomeBySource)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([source, amount]) => {
                  const percentage = (amount / analytics.totalIncome) * 100;
                  return (
                    <div key={source}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-300 truncate">{source}</span>
                        <span className="text-xs font-semibold text-white ml-2">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Investment & Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold text-white mb-3">Investment Performance</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">Total Invested</p>
                <p className="text-sm md:text-base font-bold text-white">{formatAmount(analytics.totalInvested)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Current Value</p>
                <p className="text-sm md:text-base font-bold text-white">{formatAmount(analytics.totalCurrentValue)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Gain/Loss</p>
                <p className={`text-sm md:text-base font-bold ${analytics.investmentGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatAmount(analytics.investmentGain)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Return %</p>
                <p className={`text-sm md:text-base font-bold ${parseFloat(analytics.investmentReturn) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {analytics.investmentReturn}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xs md:text-sm font-bold text-white mb-3">Goals Progress</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">Total Target</p>
                <p className="text-sm md:text-base font-bold text-white">{formatAmount(analytics.totalGoalTarget)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Saved</p>
                <p className="text-sm md:text-base font-bold text-white">{formatAmount(analytics.totalGoalSaved)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Progress</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(parseFloat(analytics.goalProgress), 100)}%` }} />
                </div>
                <p className="text-sm font-bold text-white mt-1">{analytics.goalProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="card mb-6 md:mb-8">
          <h3 className="text-xs md:text-sm font-bold text-white mb-3">Budget Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-slate-400">Total Budget</p>
              <p className="text-sm md:text-base font-bold text-white">{formatAmount(analytics.totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Spent</p>
              <p className="text-sm md:text-base font-bold text-white">{formatAmount(analytics.totalExpenses)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Utilization</p>
              <p className={`text-sm md:text-base font-bold ${parseFloat(analytics.budgetUtilization) < 80 ? 'text-green-400' : parseFloat(analytics.budgetUtilization) < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                {analytics.budgetUtilization}%
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full ${parseFloat(analytics.budgetUtilization) < 80 ? 'bg-green-500' : parseFloat(analytics.budgetUtilization) < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(parseFloat(analytics.budgetUtilization), 100)}%` }}
            />
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="card">
          <h3 className="text-xs md:text-sm font-bold text-white mb-3">Financial Health Score</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div className="bg-slate-700 rounded p-2 md:p-3">
              <p className="text-xs text-slate-300 mb-1">Savings Rate</p>
              <p className="text-xs md:text-sm font-semibold text-white mb-1">{analytics.savingsRate}%</p>
              <p className="text-xs text-slate-400">
                {parseFloat(analytics.savingsRate) > 20
                  ? '✅ Excellent'
                  : parseFloat(analytics.savingsRate) > 10
                    ? '🟢 Good'
                    : parseFloat(analytics.savingsRate) > 0
                      ? '🟡 Fair'
                      : '🔴 Poor'}
              </p>
            </div>

            <div className="bg-slate-700 rounded p-2 md:p-3">
              <p className="text-xs text-slate-300 mb-1">Investment Returns</p>
              <p className="text-xs md:text-sm font-semibold text-white mb-1">{analytics.investmentReturn}%</p>
              <p className="text-xs text-slate-400">
                {parseFloat(analytics.investmentReturn) > 10
                  ? '✅ Strong'
                  : parseFloat(analytics.investmentReturn) > 0
                    ? '🟢 Positive'
                    : '🔴 Negative'}
              </p>
            </div>

            <div className="bg-slate-700 rounded p-2 md:p-3">
              <p className="text-xs text-slate-300 mb-1">Goal Progress</p>
              <p className="text-xs md:text-sm font-semibold text-white mb-1">{analytics.goalProgress}%</p>
              <p className="text-xs text-slate-400">
                {parseFloat(analytics.goalProgress) > 75
                  ? '✅ On Track'
                  : parseFloat(analytics.goalProgress) > 50
                    ? '🟡 Making Progress'
                    : '🔴 Behind'}
              </p>
            </div>

            <div className="bg-slate-700 rounded p-2 md:p-3">
              <p className="text-xs text-slate-300 mb-1">Budget Control</p>
              <p className="text-xs md:text-sm font-semibold text-white mb-1">{analytics.budgetUtilization}%</p>
              <p className="text-xs text-slate-400">
                {parseFloat(analytics.budgetUtilization) < 80
                  ? '✅ Good'
                  : parseFloat(analytics.budgetUtilization) < 100
                    ? '🟡 Nearly Full'
                    : '🔴 Exceeded'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

