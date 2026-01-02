'use client';

import { useState } from 'react';
import { useAppStore, Vehicle } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddVehicleModal({ isOpen, onClose, onSuccess }: AddVehicleModalProps) {
  const { addVehicle } = useAppStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    registrationNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      const newVehicle: Vehicle = {
        id: `vehicle_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        registrationNumber: formData.registrationNumber,
      };

      addVehicle(newVehicle);
      success('Vehicle added successfully');

      setFormData({
        name: '',
        type: '',
        registrationNumber: '',
      });

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error adding vehicle:', err);
      error('Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-up">
      <div className="card p-4 md:p-6 border-2 border-indigo-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
        <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">Add Vehicle</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Vehicle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Honda City, Maruti Swift"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g., Car, Bike, Truck"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g., MH01AB1234"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
