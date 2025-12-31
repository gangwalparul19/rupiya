'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
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

  // Filter vehicles
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

      // Calculate mileage efficiency if there's a previous entry
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

      // Add fuel cost as expense if cost is provided
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
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vehicle Management</h1>
          <p className="text-gray-400">Manage your vehicles and track maintenance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mb-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Vehicles</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalVehicles}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
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
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Vehicle
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Add Vehicle Modal - Inline */}
        {showModalInline && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Add Vehicle</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Honda City, Maruti Swift"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="e.g., Car, Bike, Truck"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g., MH01AB1234"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Mileage (Optional)
                  </label>
                  <input
                    type="number"
                    name="currentMileage"
                    value={formData.currentMileage}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
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
                  {isLoading ? 'Adding...' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{vehicle.type}</p>
                  <p className="text-sm text-gray-500 mt-2">Reg: {vehicle.registrationNumber}</p>
                  {vehicleFuelHistory[vehicle.id] && vehicleFuelHistory[vehicle.id].length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-blue-400">
                        Current KM: {vehicleFuelHistory[vehicle.id][0]?.currentKm.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      {vehicleFuelHistory[vehicle.id]?.[0]?.mileageEfficiency && (
                        <p className="text-sm text-green-400">
                          Efficiency: {vehicleFuelHistory[vehicle.id]?.[0]?.mileageEfficiency?.toFixed(2)} km/L
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicleForFuel(vehicle.id);
                      setShowFuelModal(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    ⛽ Fuel
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicleForExpense(vehicle.id);
                      setShowExpenseModal(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    + Expense
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
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
              {vehicles.length === 0 ? 'No vehicles yet. Add one to get started!' : 'No vehicles match your search.'}
            </p>
          </div>
        )}

        {/* Summary */}
        {filteredVehicles.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Showing <span className="font-semibold text-white">{filteredVehicles.length}</span> of{' '}
              <span className="font-semibold text-white">{vehicles.length}</span> vehicles
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFuelModal && selectedVehicleForFuel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">⛽ Fuel Entry</h2>

            {/* Fuel History */}
            {vehicleFuelHistory[selectedVehicleForFuel] && vehicleFuelHistory[selectedVehicleForFuel].length > 0 && (
              <div className="mb-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Recent Fuel Entries</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {vehicleFuelHistory[selectedVehicleForFuel].slice(0, 5).map((entry, idx) => (
                    <div key={idx} className="bg-gray-600 rounded p-2">
                      <div className="flex justify-between text-sm">
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

            {/* Add Fuel Form */}
            <form onSubmit={handleAddFuel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Odometer (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="currentKm"
                  value={fuelFormData.currentKm}
                  onChange={handleFuelChange}
                  placeholder="e.g., 50000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fuel Amount (Liters) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="fuelAmount"
                  value={fuelFormData.fuelAmount}
                  onChange={handleFuelChange}
                  placeholder="e.g., 40"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cost (Optional)</label>
                <input
                  type="number"
                  name="cost"
                  value={fuelFormData.cost}
                  onChange={handleFuelChange}
                  placeholder="e.g., 2000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={fuelFormData.date}
                  onChange={handleFuelChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={fuelFormData.notes}
                  onChange={handleFuelChange}
                  placeholder="e.g., Full tank, Premium fuel"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
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
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Record Fuel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showExpenseModal && selectedVehicleForExpense && (
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
                  placeholder="e.g., Oil change, Tire replacement"
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
                  <option value="fuel">Fuel</option>
                  <option value="insurance">Insurance</option>
                  <option value="repair">Repair</option>
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
                    setSelectedVehicleForExpense(null);
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
    </div>
  );
}
