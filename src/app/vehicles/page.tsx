'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import EditVehicleModal from '@/components/EditVehicleModal';

export default function VehiclesPage() {
  const { vehicles, removeVehicle, addVehicle, addExpense } = useAppStore();
  const { success, error } = useToast();
  const [showModalInline, setShowModalInline] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedVehicleForExpense, setSelectedVehicleForExpense] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    registrationNumber: '',
    currentMileage: '',
  });
  const [expenseFormData, setExpenseFormData] = useState({
    description: '',
    amount: '',
    category: 'maintenance',
    paymentMethod: 'cash' as const,
  });
  const [fuelFormData, setFuelFormData] = useState({
    currentKm: '',
    fuelAmount: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [selectedVehicleForFuel, setSelectedVehicleForFuel] = useState<string | null>(null);
  const [vehicleFuelHistory, setVehicleFuelHistory] = useState<Record<string, Array<{
    currentKm: number;
    fuelAmount: number;
    cost: number;
    date: string;
    notes: string;
    mileageEfficiency?: number;
  }>>>({});

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [vehicles, searchTerm]);

  const kpiStats = useMemo(() => {
    return {
      totalVehicles: vehicles.length,
    };
  }, [vehicles]);

  const handleEdit = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFuelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFuelFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!fuelFormData.currentKm || !fuelFormData.fuelAmount) {
        error('Please fill in current km and fuel amount');
        return;
      }

      const currentKm = parseFloat(fuelFormData.currentKm);
      const fuelAmount = parseFloat(fuelFormData.fuelAmount);
      const cost = fuelFormData.cost ? parseFloat(fuelFormData.cost) : 0;

      if (isNaN(currentKm) || currentKm < 0 || isNaN(fuelAmount) || fuelAmount <= 0) {
        error('Please enter valid km and fuel amount');
        return;
      }

      if (!selectedVehicleForFuel) return;

      const history = vehicleFuelHistory[selectedVehicleForFuel] || [];
      let mileageEfficiency: number | undefined;

      if (history.length > 0) {
        const lastEntry = history[0];
        const kmDriven = currentKm - lastEntry.currentKm;
        if (kmDriven > 0) {
          mileageEfficiency = kmDriven / fuelAmount;
        }
      }

      setVehicleFuelHistory((prev) => ({
        ...prev,
        [selectedVehicleForFuel]: [
          {
            currentKm,
            fuelAmount,
            cost,
            date: fuelFormData.date,
            notes: fuelFormData.notes,
            mileageEfficiency,
          },
          ...history,
        ],
      }));

      if (cost > 0) {
        const vehicleName = vehicles.find((v) => v.id === selectedVehicleForFuel)?.name || 'Vehicle';
        addExpense({
          id: `expense_${Date.now()}`,
          description: `${vehicleName} - Fuel (${fuelAmount.toFixed(2)}L)`,
          amount: cost,
          category: 'fuel',
          date: new Date(fuelFormData.date),
          paymentMethod: 'cash',
        });
      }

      success('Fuel entry recorded successfully');
      setFuelFormData({
        currentKm: '',
        fuelAmount: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowFuelModal(false);
      setSelectedVehicleForFuel(null);
    } catch (err) {
      console.error('Error adding fuel:', err);
      error('Failed to add fuel entry');
    }
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpenseFormData((prev) => ({
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

      const vehicleName = vehicles.find((v) => v.id === selectedVehicleForExpense)?.name || 'Vehicle';

      addExpense({
        id: `expense_${Date.now()}`,
        description: `${vehicleName} - ${expenseFormData.description}`,
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
      setSelectedVehicleForExpense(null);
    } catch (err) {
      console.error('Error adding expense:', err);
      error('Failed to add expense');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.type || !formData.registrationNumber) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const newVehicle = {
        id: `vehicle_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        registrationNumber: formData.registrationNumber,
      };

      addVehicle(newVehicle);
      success('Vehicle added successfully');

      if (formData.currentMileage) {
        setVehicleFuelHistory((prev) => ({
          ...prev,
          [newVehicle.id]: [
            {
              currentKm: parseFloat(formData.currentMileage),
              fuelAmount: 0,
              cost: 0,
              date: new Date().toISOString().split('T')[0],
              notes: 'Initial odometer reading',
            },
          ],
        }));
      }

      setFormData({
        name: '',
        type: '',
        registrationNumber: '',
        currentMileage: '',
      });

      setShowModalInline(false);
    } catch (err) {
      console.error('Error adding vehicle:', err);
      error('Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      removeVehicle(id);
      success('Vehicle deleted successfully');
    }
  };

  const handleExportCSV = () => {
    if (filteredVehicles.length === 0) {
      error('No vehicles to export');
      return;
    }

    let csv = 'Name,Type,Registration Number\n';

    filteredVehicles.forEach((vehicle) => {
      csv += `"${vehicle.name}","${vehicle.type}","${vehicle.registrationNumber}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicles_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Vehicles exported to CSV');
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-950 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="heading-page">🚗 Vehicle Management</h1>
            <p className="text-secondary">Manage your vehicles and track maintenance</p>
          </div>

          {/* KPI Cards */}
          <div className="grid-responsive-2 mb-6 md:mb-8">
            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Total Vehicles</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalVehicles}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6">
            <button
              onClick={() => {
                setShowModalInline(true);
                setFormData({
                  name: '',
                  type: '',
                  registrationNumber: '',
                  currentMileage: '',
                });
              }}
              className="btn btn-primary flex-1"
            >
              + Add Vehicle
            </button>
            <button
              onClick={handleExportCSV}
              className="btn btn-success flex-1"
            >
              ↓ Export CSV
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, type, or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full"
            />
          </div>

          {/* Add Vehicle Modal - Inline */}
          {showModalInline && (
            <div className="card mb-6 md:mb-8">
              <h2 className="heading-section mb-4">Add Vehicle</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      Vehicle Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Honda City, Maruti Swift"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      placeholder="e.g., Car, Bike, Truck"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="e.g., MH01AB1234"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Current Mileage (Optional)
                    </label>
                    <input
                      type="number"
                      name="currentMileage"
                      value={formData.currentMileage}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      className="form-input"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModalInline(false);
                      setFormData({
                        name: '',
                        type: '',
                        registrationNumber: '',
                        currentMileage: '',
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
                    {isLoading ? 'Adding...' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vehicles Grid */}
          {filteredVehicles.length > 0 ? (
            <div className="grid-responsive-3 mb-6 md:mb-8">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="card">
                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white">{vehicle.name}</h3>
                    <p className="text-xs md:text-sm text-secondary mt-1">{vehicle.type}</p>
                    <p className="text-xs md:text-sm text-tertiary mt-2">Reg: {vehicle.registrationNumber}</p>
                    {vehicleFuelHistory[vehicle.id] && vehicleFuelHistory[vehicle.id].length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs md:text-sm text-blue-400">
                          Current KM: {vehicleFuelHistory[vehicle.id][0]?.currentKm.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                        {vehicleFuelHistory[vehicle.id]?.[0]?.mileageEfficiency && (
                          <p className="text-xs md:text-sm text-green-400">
                            Efficiency: {vehicleFuelHistory[vehicle.id]?.[0]?.mileageEfficiency?.toFixed(2)} km/L
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="btn btn-primary btn-small flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVehicleForFuel(vehicle.id);
                        setShowFuelModal(true);
                      }}
                      className="btn btn-secondary btn-small flex-1"
                    >
                      ⛽ Fuel
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVehicleForExpense(vehicle.id);
                        setShowExpenseModal(true);
                      }}
                      className="btn btn-success btn-small flex-1"
                    >
                      + Expense
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
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
                {vehicles.length === 0 ? 'No vehicles yet. Add one to get started!' : 'No vehicles match your search.'}
              </p>
            </div>
          )}

          {/* Summary */}
          {filteredVehicles.length > 0 && (
            <div className="card">
              <p className="text-secondary">
                Showing <span className="font-semibold text-white">{filteredVehicles.length}</span> of{' '}
                <span className="font-semibold text-white">{vehicles.length}</span> vehicles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFuelModal && selectedVehicleForFuel && (
        <div className="w-full animate-slide-up mb-8">
          <div className="card p-4 md:p-6 border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center text-white">
              <h2 className="text-xl md:text-2xl font-bold">⛽ Fuel Entry</h2>
              <button
                onClick={() => {
                  setShowFuelModal(false);
                  setSelectedVehicleForFuel(null);
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {vehicleFuelHistory[selectedVehicleForFuel] && vehicleFuelHistory[selectedVehicleForFuel].length > 0 && (
              <div className="mb-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-xs md:text-sm font-semibold text-gray-300 mb-3">Recent Fuel Entries</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {vehicleFuelHistory[selectedVehicleForFuel].slice(0, 5).map((entry, idx) => (
                    <div key={idx} className="bg-gray-600 rounded p-2">
                      <div className="flex justify-between text-xs md:text-sm">
                        <div>
                          <p className="text-white font-medium">{entry.currentKm.toLocaleString('en-IN', { maximumFractionDigits: 0 })} km</p>
                          <p className="text-gray-300 text-xs">{entry.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-400 font-medium">{entry.fuelAmount.toFixed(2)} L</p>
                          {entry.mileageEfficiency && (
                            <p className="text-green-400 text-xs font-semibold">{entry.mileageEfficiency.toFixed(2)} km/L</p>
                          )}
                        </div>
                      </div>
                      {entry.notes && <p className="text-gray-400 text-xs mt-1">{entry.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleAddFuel} className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  Current Odometer (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="currentKm"
                  value={fuelFormData.currentKm}
                  onChange={handleFuelChange}
                  placeholder="e.g., 50000"
                  className="form-input"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Fuel Amount (Liters) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="fuelAmount"
                  value={fuelFormData.fuelAmount}
                  onChange={handleFuelChange}
                  placeholder="e.g., 40"
                  className="form-input"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cost (Optional)</label>
                <input
                  type="number"
                  name="cost"
                  value={fuelFormData.cost}
                  onChange={handleFuelChange}
                  placeholder="e.g., 2000"
                  className="form-input"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={fuelFormData.date}
                  onChange={handleFuelChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={fuelFormData.notes}
                  onChange={handleFuelChange}
                  placeholder="e.g., Full tank, Premium fuel"
                  className="form-textarea"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowFuelModal(false);
                    setSelectedVehicleForFuel(null);
                    setFuelFormData({
                      currentKm: '',
                      fuelAmount: '',
                      cost: '',
                      date: new Date().toISOString().split('T')[0],
                      notes: '',
                    });
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Record Fuel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showExpenseModal && selectedVehicleForExpense && (
        <div className="w-full animate-slide-up mb-8">
          <div className="card p-4 md:p-6 border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
            <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center text-white">
              <h2 className="text-xl md:text-2xl font-bold">Add Expense</h2>
              <button
                onClick={() => {
                  setShowExpenseModal(false);
                  setSelectedVehicleForExpense(null);
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
                  placeholder="e.g., Oil change, Tire replacement"
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
                  <option value="fuel">Fuel</option>
                  <option value="insurance">Insurance</option>
                  <option value="repair">Repair</option>
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
                    setSelectedVehicleForExpense(null);
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
      {selectedVehicle && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
          }}
        />
      )}
    </PageWrapper>
  );
}


