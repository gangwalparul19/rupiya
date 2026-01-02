'use client';

import { useState } from 'react';
import { useAppStore, House } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

interface AddHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddHouseModal({ isOpen, onClose, onSuccess }: AddHouseModalProps) {
  const { addHouse } = useAppStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'owned' as const,
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!formData.name || !formData.type || !formData.address) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const newHouse: House = {
        id: `house_${Date.now()}`,
        name: formData.name,
        type: formData.type as any,
        address: formData.address,
      };

      addHouse(newHouse);
      success('House added successfully');

      setFormData({
        name: '',
        type: 'owned',
        address: '',
      });

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error adding house:', err);
      error('Failed to add house');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-up">
      <div className="card p-4 md:p-6 border-2 border-amber-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
        <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">Add House</h2>
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
              House Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main House, Apartment"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="owned">Owned</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
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
              {isLoading ? 'Adding...' : 'Add House'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
