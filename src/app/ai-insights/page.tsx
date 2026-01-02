'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';

export default function AIInsightsPage() {
  const { expenses, income, budgets, investments, goals } = useAppStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedInsightType, setSelectedInsightType] = useState<'spending' | 'savings' | 'investment' | 'budget' | 'goals'>('spending');

  const analytics = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const netCashFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netCashFlow / totalIncome) * 100).toFixed(2) : '0';

    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((exp) => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    const topExpenseCategory = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0];
    const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const investmentGain = totalCurrentValue - totalInvested;

    return {
      totalExpenses,
      totalIncome,
      netCashFlow,
      savingsRate,
      expensesByCategory,
      topExpenseCategory,
      totalInvested,
      totalCurrentValue,
      investmentGain,
    };
  }, [expenses, income, investments]);

  const generateSpendingInsights = () => {
    const insights: string[] = [];

    if (analytics.topExpenseCategory) {
      const [category, amount] = analytics.topExpenseCategory;
      const percentage = ((amount / analytics.totalExpenses) * 100).toFixed(1);
      insights.push(
        `Your highest spending category is ${category} at ₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${percentage}% of total expenses). Consider reviewing this category for potential savings.`
      );
    }

    if (analytics.totalExpenses > analytics.totalIncome * 0.8) {
      insights.push(
        `⚠️ Your expenses are consuming ${((analytics.totalExpenses / analytics.totalIncome) * 100).toFixed(1)}% of your income. Try to keep expenses below 80% of income.`
      );
    }

    if (parseFloat(analytics.savingsRate) < 10) {
      insights.push(
        `Your savings rate is ${analytics.savingsRate}%. Financial experts recommend saving at least 10-20% of your income. Look for areas to cut expenses.`
      );
    }

    if (analytics.totalExpenses < analytics.totalIncome * 0.6) {
      insights.push(
        `✅ Great job! Your expenses are only ${((analytics.totalExpenses / analytics.totalIncome) * 100).toFixed(1)}% of your income. You have good spending discipline.`
      );
    }

    return insights;
  };

  const generateSavingsInsights = () => {
    const insights: string[] = [];

    if (parseFloat(analytics.savingsRate) > 20) {
      insights.push(
        `🎉 Excellent savings rate of ${analytics.savingsRate}%! You're saving more than the recommended 10-20%. Keep up this great habit!`
      );
    } else if (parseFloat(analytics.savingsRate) > 10) {
      insights.push(
        `Good savings rate of ${analytics.savingsRate}%. You're on track with financial recommendations. Try to maintain or increase this rate.`
      );
    } else if (parseFloat(analytics.savingsRate) > 0) {
      insights.push(
        `Your savings rate is ${analytics.savingsRate}%. While positive, consider increasing it to ${(parseFloat(analytics.savingsRate) + 5).toFixed(1)}% by reducing discretionary spending.`
      );
    } else {
      insights.push(
        `⚠️ You're currently spending more than you earn. Focus on reducing expenses or increasing income to achieve positive savings.`
      );
    }

    const monthlyIncome = analytics.totalIncome;
    const recommendedEmergencyFund = monthlyIncome * 6;
    insights.push(
      `Consider building an emergency fund of ₹${recommendedEmergencyFund.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (6 months of income).`
    );

    return insights;
  };

  const generateInvestmentInsights = () => {
    const insights: string[] = [];

    if (analytics.totalInvested === 0) {
      insights.push(
        `You haven't started investing yet. Consider allocating 10-15% of your income to investments for long-term wealth building.`
      );
    } else {
      const returnPercentage = ((analytics.investmentGain / analytics.totalInvested) * 100).toFixed(2);
      if (parseFloat(returnPercentage) > 10) {
        insights.push(
          `✅ Strong investment performance! Your portfolio has returned ${returnPercentage}%. Keep your investment strategy consistent.`
        );
      } else if (parseFloat(returnPercentage) > 0) {
        insights.push(
          `Your investments have returned ${returnPercentage}%. This is positive but consider diversifying to improve returns.`
        );
      } else {
        insights.push(
          `Your portfolio is currently down ${Math.abs(parseFloat(returnPercentage)).toFixed(2)}%. Review your investment strategy and consider rebalancing.`
        );
      }
    }

    const investmentToIncomeRatio = (analytics.totalInvested / analytics.totalIncome) * 100;
    if (investmentToIncomeRatio < 10) {
      insights.push(
        `Consider increasing your investment allocation. Aim for at least 10-15% of your annual income invested.`
      );
    }

    return insights;
  };

  const generateBudgetInsights = () => {
    const insights: string[] = [];

    const totalBudget = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const budgetUtilization = (analytics.totalExpenses / totalBudget) * 100;

    if (budgetUtilization > 100) {
      insights.push(
        `⚠️ You've exceeded your budget by ${(budgetUtilization - 100).toFixed(1)}%. Review your spending and adjust your budget for next month.`
      );
    } else if (budgetUtilization > 80) {
      insights.push(
        `You're using ${budgetUtilization.toFixed(1)}% of your budget. Be careful with remaining spending to avoid exceeding your limit.`
      );
    } else if (budgetUtilization > 50) {
      insights.push(
        `You're on track with your budget at ${budgetUtilization.toFixed(1)}% utilization. Continue monitoring your spending.`
      );
    } else {
      insights.push(
        `Great budget management! You're only using ${budgetUtilization.toFixed(1)}% of your budget. You have good spending control.`
      );
    }

    return insights;
  };

  const generateGoalInsights = () => {
    const insights: string[] = [];

    if (goals.length === 0) {
      insights.push(
        `You haven't set any financial goals yet. Consider setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) to guide your financial planning.`
      );
    } else {
      const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalGoalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
      const goalProgress = (totalGoalSaved / totalGoalTarget) * 100;

      if (goalProgress > 75) {
        insights.push(
          `✅ Excellent progress on your goals! You're ${goalProgress.toFixed(1)}% towards your targets. Keep up the momentum!`
        );
      } else if (goalProgress > 50) {
        insights.push(
          `Good progress on your goals at ${goalProgress.toFixed(1)}%. Continue saving consistently to reach your targets.`
        );
      } else if (goalProgress > 0) {
        insights.push(
          `You're ${goalProgress.toFixed(1)}% towards your goals. Increase your monthly savings to accelerate progress.`
        );
      } else {
        insights.push(
          `You haven't started saving towards your goals yet. Begin with small, consistent contributions.`
        );
      }

      const highPriorityGoals = goals.filter((g) => g.priority === 'high');
      if (highPriorityGoals.length > 0) {
        insights.push(
          `Focus on your ${highPriorityGoals.length} high-priority goal(s). Allocate more resources to achieve them faster.`
        );
      }
    }

    return insights;
  };

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    try {
      let generatedInsights: string[] = [];

      switch (selectedInsightType) {
        case 'spending':
          generatedInsights = generateSpendingInsights();
          break;
        case 'savings':
          generatedInsights = generateSavingsInsights();
          break;
        case 'investment':
          generatedInsights = generateInvestmentInsights();
          break;
        case 'budget':
          generatedInsights = generateBudgetInsights();
          break;
        case 'goals':
          generatedInsights = generateGoalInsights();
          break;
      }

      setRecommendations(generatedInsights);
      setInsights(generatedInsights.join('\n\n'));
      success('Insights generated successfully');
    } catch (err) {
      error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportInsights = () => {
    if (!insights) {
      error('No insights to export');
      return;
    }

    const report = `
AI FINANCIAL INSIGHTS REPORT
Generated: ${new Date().toLocaleString()}
Insight Type: ${selectedInsightType.toUpperCase()}

${insights}

---
Generated by Rupiya AI Assistant
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_insights_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Insights exported successfully');
  };

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">🤖 AI Financial Insights</h1>
          <p className="text-secondary">Get personalized financial recommendations powered by AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="card">
            <h3 className="heading-section mb-4">Select Insight Type</h3>
            <div className="space-y-2">
              {[
                { value: 'spending', label: '💰 Spending Analysis', icon: '💰' },
                { value: 'savings', label: '🏦 Savings Strategy', icon: '🏦' },
                { value: 'investment', label: '📈 Investment Advice', icon: '📈' },
                { value: 'budget', label: '📊 Budget Optimization', icon: '📊' },
                { value: 'goals', label: '🎯 Goal Planning', icon: '🎯' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedInsightType(option.value as any)}
                  className={`w-full p-2 md:p-3 rounded-lg text-left transition-colors text-xs md:text-sm ${selectedInsightType === option.value
                      ? 'btn btn-primary'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateInsights}
              disabled={isLoading}
              className="w-full mt-4 btn btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : '✨ Generate Insights'}
            </button>
          </div>

          {/* Key Metrics */}
          <div className="card">
            <h3 className="heading-section mb-4">Financial Overview</h3>
            <div className="space-y-2">
              <div className="bg-slate-700 rounded p-2 md:p-3">
                <p className="text-xs text-slate-400">Total Income</p>
                <p className="text-base md:text-lg font-bold text-green-400">
                  ₹{analytics.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-slate-700 rounded p-2 md:p-3">
                <p className="text-xs text-slate-400">Total Expenses</p>
                <p className="text-base md:text-lg font-bold text-red-400">
                  ₹{analytics.totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-slate-700 rounded p-2 md:p-3">
                <p className="text-xs text-slate-400">Savings Rate</p>
                <p className="text-base md:text-lg font-bold text-blue-400">{analytics.savingsRate}%</p>
              </div>
              <div className="bg-slate-700 rounded p-2 md:p-3">
                <p className="text-xs text-slate-400">Net Cash Flow</p>
                <p className={`text-base md:text-lg font-bold ${analytics.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{analytics.netCashFlow.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Display */}
        {recommendations.length > 0 && (
          <div className="card mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="heading-section">Generated Insights</h3>
              <button
                onClick={handleExportInsights}
                className="btn btn-success btn-small"
              >
                📄 Export
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-3 md:p-4 border-l-4 border-blue-500">
                  <p className="text-xs md:text-sm text-slate-200">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Tips */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 md:p-6">
          <h3 className="heading-section mb-4 text-white">💡 AI Tips for Better Financial Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="bg-blue-800 bg-opacity-50 rounded p-3 md:p-4">
              <p className="text-xs md:text-sm text-blue-100">
                <strong>Emergency Fund:</strong> Build 6 months of expenses as an emergency fund to handle unexpected situations.
              </p>
            </div>
            <div className="bg-purple-800 bg-opacity-50 rounded p-3 md:p-4">
              <p className="text-xs md:text-sm text-purple-100">
                <strong>50/30/20 Rule:</strong> Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.
              </p>
            </div>
            <div className="bg-blue-800 bg-opacity-50 rounded p-3 md:p-4">
              <p className="text-xs md:text-sm text-blue-100">
                <strong>Automate Savings:</strong> Set up automatic transfers to savings account to ensure consistent saving.
              </p>
            </div>
            <div className="bg-purple-800 bg-opacity-50 rounded p-3 md:p-4">
              <p className="text-xs md:text-sm text-purple-100">
                <strong>Diversify Investments:</strong> Spread investments across different asset classes to reduce risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}



