'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import EditHouseModal from '@/components/EditHouseModal';

export default function HousesPage() {
  const { houses, removeHouse, addHouse, addExpense, addIncome } = useAppStore();
  const { success, error } = useToast();
  const [showModalInline, setShowModalInline] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [selectedHouseForExpense, setSelectedHouseForExpense] = useState<string | null>(null);
  const [selectedHouseForIncome, setSelectedHouseForIncome] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'owned' as const,
    address: '',
  });
  const [expenseFormData, setExpenseFormData] = useState({
    description: '',
    amount: '',
    category: 'maintenance',
    paymentMethod: 'cash' as const,
  });
  const [incomeFormData, setIncomeFormData] = useState({
    description: '',
    amount: '',
    source: 'other' as const,
    paymentMethod: 'cash' as const,
  });

  // Filter houses
  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      const matchesSearch = house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           house.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterType || house.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [houses, searchTerm, filterType]);

  const kpiStats = useMemo(() => {
    const ownedCount = houses.filter((h) => h.type === 'owned').length;
    const rentedCount = houses.filter((h) => h.type === 'rented').length;

    return {
      totalHouses: houses.length,
      ownedCount,
      rentedCount,
    };
  }, [houses]);

  const handleEdit = (house: typeof houses[0]) => {
    setSelectedHouse(house);
    setIsEditModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpenseFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIncomeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!expenseFormData.description || !expenseFormData.amount) {
        error('Please fill in all required fields');
        return;
      }

      const amount = parseFloat(expenseFormData.amount);
      if (isNaN(amount) || amount <= 0) {
        error('Amount must be a valid positive number');
        return;
      }

      const houseName = houses.find((h) => h.id === selectedHouseForExpense)?.name || 'House';

      addExpense({
        id: `expense_${Date.now()}`,
        description: `${houseName} - ${expenseFormData.description}`,
        amount,
        category: expenseFormData.category,
        date: new Date(),
        paymentMethod: expenseFormData.paymentMethod,
      });

      success('Expense added successfully');
      setExpenseFormData({
        description: '',
        amount: '',
        category: 'maintenance',
        paymentMethod: 'cash',
      });
      setShowExpenseModal(false);
      setSelectedHouseForExpense(null);
    } catch (err) {
      console.error('Error adding expense:', err);
      error('Failed to add expense');
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!incomeFormData.description || !incomeFormData.amount) {
        error('Please fill in all required fields');
        return;
      }

      const amount = parseFloat(incomeFormData.amount);
      if (isNaN(amount) || amount <= 0) {
        error('Amount must be a valid positive number');
        return;
      }

      const houseName = houses.find((h) => h.id === selectedHouseForIncome)?.name || 'House';

      addIncome({
        id: `income_${Date.now()}`,
        description: `${houseName} - ${incomeFormData.description}`,
        amount,
        source: incomeFormData.source as 'salary' | 'freelance' | 'investment' | 'gift' | 'bonus' | 'other',
        date: new Date(),
      });

      success('Income added successfully');
      setIncomeFormData({
        description: '',
        amount: '',
        source: 'other',
        paymentMethod: 'cash',
      });
      setShowIncomeModal(false);
      setSelectedHouseForIncome(null);
    } catch (err) {
      console.error('Error adding income:', err);
      error('Failed to add income');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.type || !formData.address) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const newHouse = {
        id: `house_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        address: formData.address,
      };

      addHouse(newHouse);
      success('House added successfully');

      setFormData({
        name: '',
        type: 'owned',
        address: '',
      });

      setShowModalInline(false);
    } catch (err) {
      console.error('Error adding house:', err);
      error('Failed to add house');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this house?')) {
      removeHouse(id);
      success('House deleted successfully');
    }
  };

  const handleExportCSV = () => {
    if (filteredHouses.length === 0) {
      error('No houses to export');
      return;
    }

    let csv = 'Name,Type,Address\n';

    filteredHouses.forEach((house) => {
      csv += `"${house.name}","${house.type}","${house.address}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `houses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Houses exported to CSV');
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">House Management</h1>
          <p className="text-gray-400">Manage your properties and track house-related expenses</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Houses</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalHouses}</p>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Owned</p>
            <p className="text-2xl md:text-3xl font-bold text-green-400">{kpiStats.ownedCount}</p>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Rented</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-400">{kpiStats.rentedCount}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setShowModalInline(true);
              setFormData({
                name: '',
                type: 'owned',
                address: '',
              });
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add House
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ↓ Export CSV
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="owned">Owned</option>
            <option value="rented">Rented</option>
          </select>
        </div>

        {/* Add House Modal - Inline */}
        {showModalInline && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Add House</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    House Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Main House, Apartment"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="owned">Owned</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalInline(false);
                    setFormData({
                      name: '',
                      type: 'owned',
                      address: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add House'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Houses Grid */}
        {filteredHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredHouses.map((house) => (
              <div key={house.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{house.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{house.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    house.type === 'owned' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                  }`}>
                    {house.type.charAt(0).toUpperCase() + house.type.slice(1)}
                  </span>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(house)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedHouseForExpense(house.id);
                      setShowExpenseModal(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    + Expense
                  </button>
                  {house.type === 'owned' && (
                    <button
                      onClick={() => {
                        setSelectedHouseForIncome(house.id);
                        setShowIncomeModal(true);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      + Income
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(house.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {houses.length === 0 ? 'No houses yet. Add one to get started!' : 'No houses match your search.'}
            </p>
          </div>
        )}

        {/* Summary */}
        {filteredHouses.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Showing <span className="font-semibold text-white">{filteredHouses.length}</span> of{' '}
              <span className="font-semibold text-white">{houses.length}</span> houses
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showExpenseModal && selectedHouseForExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Add Expense</h2>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={expenseFormData.description}
                  onChange={handleExpenseChange}
                  placeholder="e.g., Repair, Maintenance, Utilities"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={expenseFormData.amount}
                  onChange={handleExpenseChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={expenseFormData.category}
                  onChange={handleExpenseChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="utilities">Utilities</option>
                  <option value="repair">Repair</option>
                  <option value="rent">Rent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={expenseFormData.paymentMethod}
                  onChange={handleExpenseChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseModal(false);
                    setSelectedHouseForExpense(null);
                    setExpenseFormData({
                      description: '',
                      amount: '',
                      category: 'maintenance',
                      paymentMethod: 'cash',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showIncomeModal && selectedHouseForIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Add Income</h2>

            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={incomeFormData.description}
                  onChange={handleIncomeChange}
                  placeholder="e.g., Rental income, Lease payment"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={incomeFormData.amount}
                  onChange={handleIncomeChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                <select
                  name="source"
                  value={incomeFormData.source}
                  onChange={handleIncomeChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="gift">Gift</option>
                  <option value="bonus">Bonus</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={incomeFormData.paymentMethod}
                  onChange={handleIncomeChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowIncomeModal(false);
                    setSelectedHouseForIncome(null);
                    setIncomeFormData({
                      description: '',
                      amount: '',
                      source: 'other',
                      paymentMethod: 'cash',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedHouse && (
        <EditHouseModal
          house={selectedHouse}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedHouse(null);
          }}
        />
      )}
    </div>
  );
}
