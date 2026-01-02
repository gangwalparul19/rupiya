'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
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
    <PageWrapper>
      <div className="min-h-screen bg-gray-950 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="heading-page">🏠 House Management</h1>
            <p className="text-secondary">Manage your properties and track house-related expenses</p>
          </div>

          {/* KPI Cards */}
          <div className="grid-responsive-3 mb-6 md:mb-8">
            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Total Houses</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalHouses}</p>
            </div>

            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Owned</p>
              <p className="text-2xl md:text-3xl font-bold text-green-400">{kpiStats.ownedCount}</p>
            </div>

            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Rented</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-400">{kpiStats.rentedCount}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6">
            <button
              onClick={() => {
                setShowModalInline(true);
                setFormData({
                  name: '',
                  type: 'owned',
                  address: '',
                });
              }}
              className="btn btn-primary flex-1"
            >
              + Add House
            </button>
            <button
              onClick={handleExportCSV}
              className="btn btn-success flex-1"
            >
              ↓ Export CSV
            </button>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
            >
              <option value="">All Types</option>
              <option value="owned">Owned</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          {/* Add House Modal - Inline */}
          {showModalInline && (
            <div className="card mb-6 md:mb-8">
              <h2 className="heading-section mb-4">Add House</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      House Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Main House, Apartment"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="owned">Owned</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="form-input"
                    required
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 pt-4 border-t border-gray-700">
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
                    className="btn btn-secondary flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 disabled:opacity-50"
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
            <div className="grid-responsive-3 mb-6 md:mb-8">
              {filteredHouses.map((house) => (
                <div key={house.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{house.name}</h3>
                      <p className="text-xs md:text-sm text-secondary mt-1">{house.address}</p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${house.type === 'owned' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                      }`}>
                      {house.type.charAt(0).toUpperCase() + house.type.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleEdit(house)}
                      className="btn btn-primary btn-small flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedHouseForExpense(house.id);
                        setShowExpenseModal(true);
                      }}
                      className="btn btn-success btn-small flex-1"
                    >
                      + Expense
                    </button>
                    {house.type === 'owned' && (
                      <button
                        onClick={() => {
                          setSelectedHouseForIncome(house.id);
                          setShowIncomeModal(true);
                        }}
                        className="btn btn-secondary btn-small flex-1"
                      >
                        + Income
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(house.id)}
                      className="btn btn-danger btn-small flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-secondary">
                {houses.length === 0 ? 'No houses yet. Add one to get started!' : 'No houses match your search.'}
              </p>
            </div>
          )}

          {/* Summary */}
          {filteredHouses.length > 0 && (
            <div className="card">
              <p className="text-secondary">
                Showing <span className="font-semibold text-white">{filteredHouses.length}</span> of{' '}
                <span className="font-semibold text-white">{houses.length}</span> houses
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showExpenseModal && selectedHouseForExpense && (
        <div className="w-full animate-slide-up mb-8">
          <div className="card p-4 md:p-6 border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
            <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center text-white">
              <h2 className="text-xl md:text-2xl font-bold">Add Expense</h2>
              <button
                onClick={() => {
                  setShowExpenseModal(false);
                  setSelectedHouseForExpense(null);
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={expenseFormData.description}
                  onChange={handleExpenseChange}
                  placeholder="e.g., Repair, Maintenance, Utilities"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
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
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={expenseFormData.category}
                  onChange={handleExpenseChange}
                  className="form-select"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="utilities">Utilities</option>
                  <option value="repair">Repair</option>
                  <option value="rent">Rent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={expenseFormData.paymentMethod}
                  onChange={handleExpenseChange}
                  className="form-select"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4 border-t border-gray-700">
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
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showIncomeModal && selectedHouseForIncome && (
        <div className="w-full animate-slide-up mb-8">
          <div className="card p-4 md:p-6 border-2 border-green-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
            <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center text-white">
              <h2 className="text-xl md:text-2xl font-bold">Add Income</h2>
              <button
                onClick={() => {
                  setShowIncomeModal(false);
                  setSelectedHouseForIncome(null);
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={incomeFormData.description}
                  onChange={handleIncomeChange}
                  placeholder="e.g., Rental income, Lease payment"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
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
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Source</label>
                <select
                  name="source"
                  value={incomeFormData.source}
                  onChange={handleIncomeChange}
                  className="form-select"
                >
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="gift">Gift</option>
                  <option value="bonus">Bonus</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={incomeFormData.paymentMethod}
                  onChange={handleIncomeChange}
                  className="form-select"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4 border-t border-gray-700">
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
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
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
    </PageWrapper>
  );
}


