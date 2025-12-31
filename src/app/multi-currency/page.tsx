'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export default function MultiCurrencyPage() {
  const { currencySettings, setCurrencySettings, expenses, income } = useAppStore();
  const { success } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    baseCurrency: currencySettings?.baseCurrency || 'INR',
    displayCurrency: currencySettings?.displayCurrency || 'INR',
    autoConvert: currencySettings?.autoConvert || false,
  });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    'USD': 83.5,
    'EUR': 91.2,
    'GBP': 105.8,
    'JPY': 0.56,
    'AUD': 54.2,
    'CAD': 61.5,
    'SGD': 62.3,
  });

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, inc) => sum + inc.amount, 0);
  }, [income]);

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'INR') {
      return amount / (exchangeRates[toCurrency] || 1);
    }
    const inINR = amount * (exchangeRates[fromCurrency] || 1);
    if (toCurrency === 'INR') return inINR;
    return inINR / (exchangeRates[toCurrency] || 1);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrencySettings({
      baseCurrency: formData.baseCurrency,
      displayCurrency: formData.displayCurrency,
      autoConvert: formData.autoConvert,
      conversionRates: Object.entries(exchangeRates).map(([code, rate]) => ({
        from: 'INR',
        to: code,
        rate,
        timestamp: new Date(),
      })),
    });
    success('Currency settings updated successfully');
    setIsEditModalOpen(false);
  };

  const handleUpdateRate = (currency: string, rate: string) => {
    setExchangeRates((prev) => ({
      ...prev,
      [currency]: parseFloat(rate) || 0,
    }));
  };

  const convertedExpenses = formData.autoConvert
    ? convertAmount(totalExpenses, formData.baseCurrency, formData.displayCurrency)
    : totalExpenses;

  const convertedIncome = formData.autoConvert
    ? convertAmount(totalIncome, formData.baseCurrency, formData.displayCurrency)
    : totalIncome;

  const displayCurrencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === formData.displayCurrency);

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Multi-Currency Support</h1>
          <p className="text-gray-400">Manage multiple currencies and exchange rates</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Settings Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Currency Settings</h2>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Base Currency</label>
                    <select
                      value={formData.baseCurrency}
                      onChange={(e) => setFormData((prev) => ({ ...prev, baseCurrency: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Currency</label>
                    <select
                      value={formData.displayCurrency}
                      onChange={(e) => setFormData((prev) => ({ ...prev, displayCurrency: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoConvert}
                    onChange={(e) => setFormData((prev) => ({ ...prev, autoConvert: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-300">Auto-convert amounts</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Exchange Rates (to INR)</label>
                  <div className="space-y-3">
                    {SUPPORTED_CURRENCIES.filter((c) => c.code !== 'INR').map((curr) => (
                      <div key={curr.code} className="flex items-center gap-3">
                        <span className="w-12 font-semibold text-white">{curr.code}</span>
                        <input
                          type="number"
                          value={exchangeRates[curr.code] || 0}
                          onChange={(e) => handleUpdateRate(curr.code, e.target.value)}
                          step="0.01"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-gray-400 text-sm">1 {curr.code} = ? INR</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Currency Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <p className="text-sm text-blue-100 mb-2">Base Currency</p>
            <p className="text-3xl font-bold">
              {SUPPORTED_CURRENCIES.find((c) => c.code === formData.baseCurrency)?.symbol}
            </p>
            <p className="text-sm text-blue-100 mt-2">{formData.baseCurrency}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
            <p className="text-sm text-green-100 mb-2">Display Currency</p>
            <p className="text-3xl font-bold">{displayCurrencyObj?.symbol}</p>
            <p className="text-sm text-green-100 mt-2">{formData.displayCurrency}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
            <p className="text-sm text-purple-100 mb-2">Auto-Convert</p>
            <p className="text-3xl font-bold">{formData.autoConvert ? 'ON' : 'OFF'}</p>
            <p className="text-sm text-purple-100 mt-2">Conversion Status</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Total Expenses</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">In {formData.baseCurrency}</p>
                <p className="text-2xl font-bold text-red-400">
                  {SUPPORTED_CURRENCIES.find((c) => c.code === formData.baseCurrency)?.symbol}
                  {totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
              </div>
              {formData.autoConvert && formData.displayCurrency !== formData.baseCurrency && (
                <div>
                  <p className="text-sm text-gray-400">In {formData.displayCurrency}</p>
                  <p className="text-2xl font-bold text-red-300">
                    {displayCurrencyObj?.symbol}
                    {convertedExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Total Income</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">In {formData.baseCurrency}</p>
                <p className="text-2xl font-bold text-green-400">
                  {SUPPORTED_CURRENCIES.find((c) => c.code === formData.baseCurrency)?.symbol}
                  {totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
              </div>
              {formData.autoConvert && formData.displayCurrency !== formData.baseCurrency && (
                <div>
                  <p className="text-sm text-gray-400">In {formData.displayCurrency}</p>
                  <p className="text-2xl font-bold text-green-300">
                    {displayCurrencyObj?.symbol}
                    {convertedIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exchange Rates Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Current Exchange Rates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Currency</th>
                  <th className="text-left py-3 px-4 text-gray-300">Code</th>
                  <th className="text-left py-3 px-4 text-gray-300">Rate (to INR)</th>
                  <th className="text-left py-3 px-4 text-gray-300">Reverse Rate</th>
                </tr>
              </thead>
              <tbody>
                {SUPPORTED_CURRENCIES.filter((c) => c.code !== 'INR').map((curr) => (
                  <tr key={curr.code} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-white">{curr.name}</td>
                    <td className="py-3 px-4 text-gray-300">{curr.code}</td>
                    <td className="py-3 px-4 text-gray-300">
                      1 {curr.code} = ₹{(exchangeRates[curr.code] || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      ₹1 = {((1 / (exchangeRates[curr.code] || 1)) * 100).toFixed(4)} {curr.code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Enable auto-convert to automatically display all amounts in your preferred currency. Exchange rates are updated manually - update them regularly for accurate conversions.
          </p>
        </div>
      </div>
    </div>
  );
}
