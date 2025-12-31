'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import ConfirmDialog from '@/components/ConfirmDialog';
import SkeletonLoader from '@/components/SkeletonLoader';
import { validateName } from '@/lib/validation';

const EMOJI_OPTIONS = ['🍔', '🚗', '💡', '🎬', '🛍️', '⚕️', '📚', '✈️', '🏠', '💰', '🎮', '🍕', '🏋️', '🎵', '🌍'];
const COLOR_OPTIONS = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-cyan-600'];

export default function CategoriesPage() {
  const { categories, addCategory, removeCategory, updateCategory } = useAppStore();
  const { success, error } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPageLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    categoryId: '',
    categoryName: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🍔',
    color: 'bg-blue-600',
    type: 'expense' as 'expense' | 'income' | 'both',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation for name field
    if (name === 'name') {
      const error = validateName(value);
      setErrors((prev) => ({
        ...prev,
        name: error || '',
      }));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const nameError = validateName(formData.name);
    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    if (categories.some((cat) => cat.name.toLowerCase() === formData.name.toLowerCase())) {
      setErrors({ name: 'Category already exists' });
      return;
    }

    addCategory({
      id: `cat_${Date.now()}`,
      name: formData.name,
      emoji: formData.emoji,
      color: formData.color,
      type: formData.type,
      createdAt: new Date(),
    });

    success('Category added successfully');
    setFormData({
      name: '',
      emoji: '🍔',
      color: 'bg-blue-600',
      type: 'expense',
    });
    setErrors({});
    setIsAddModalOpen(false);
  };

  const handleEditCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setFormData({
        name: category.name,
        emoji: category.emoji,
        color: category.color,
        type: category.type,
      });
      setEditingId(id);
      setIsAddModalOpen(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const nameError = validateName(formData.name);
    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    if (editingId) {
      updateCategory(editingId, {
        name: formData.name,
        emoji: formData.emoji,
        color: formData.color,
        type: formData.type,
      });
      success('Category updated successfully');
      setEditingId(null);
      setFormData({
        name: '',
        emoji: '🍔',
        color: 'bg-blue-600',
        type: 'expense',
      });
      setErrors({});
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      categoryId: id,
      categoryName: name,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.categoryId) {
      removeCategory(confirmDialog.categoryId);
      success('Category deleted successfully');
      setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
    }
  };

  const handleExportCSV = () => {
    if (filteredCategories.length === 0) {
      error('No categories to export');
      return;
    }

    let csv = 'Name,Emoji,Color,Type\n';
    filteredCategories.forEach((cat) => {
      csv += `"${cat.name}","${cat.emoji}","${cat.color}","${cat.type}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `categories_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Categories exported to CSV');
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">Categories Management</h1>
          <p className="text-secondary">Create and manage your expense and income categories</p>
        </div>

        {/* Action Buttons - Always visible */}
        <div className="flex gap-2 md:gap-3 mb-6 sticky bottom-0 md:static bg-slate-900 p-3 md:p-0 -mx-3 md:mx-0 z-40">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setEditingId(null);
              setFormData({
                name: '',
                emoji: '🍔',
                color: 'bg-blue-600',
                type: 'expense',
              });
            }}
            className="flex-1 btn btn-primary"
            aria-label="Add new category"
          >
            + Add
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 btn btn-success"
            aria-label="Export categories to CSV file"
          >
            CSV
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full"
          />
        </div>

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 md:p-4 z-50">
            <div className="card max-h-[90vh] overflow-y-auto w-full max-w-md">
              <div className="p-4 md:p-6 sticky top-0 bg-slate-800 border-b border-slate-700">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {editingId ? 'Edit Category' : 'Add New Category'}
                </h2>
              </div>

              <form onSubmit={editingId ? handleSaveEdit : handleAddCategory} className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Groceries"
                    className={`form-input ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label">Emoji</label>
                  <div className="grid grid-cols-5 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, emoji }))}
                        className={`p-2 text-2xl md:text-3xl rounded-lg transition-colors ${
                          formData.emoji === emoji
                            ? 'bg-blue-600'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        className={`p-3 rounded-lg transition-all ${color} ${
                          formData.color === color ? 'ring-2 ring-white' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  <button
                    type="submit"
                    disabled={!!errors.name || !formData.name}
                    className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={editingId ? `Update ${formData.name} category` : 'Add new category'}
                  >
                    {editingId ? 'Update' : 'Add'} Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingId(null);
                      setFormData({
                        name: '',
                        emoji: '🍔',
                        color: 'bg-blue-600',
                        type: 'expense',
                      });
                      setErrors({});
                    }}
                    className="flex-1 btn btn-secondary"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories Grid - Mobile optimized */}
        {isPageLoading ? (
          <SkeletonLoader type="card" count={4} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4" />
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="card border-2 border-slate-700 p-3 md:p-4 text-white hover:border-slate-600 transition-colors">
                {/* Icon and Name Section */}
                <div className="flex flex-col items-center text-center mb-3">
                  <div className={`${category.color} rounded-lg p-2 mb-2`}>
                    <div className="text-3xl md:text-4xl">{category.emoji}</div>
                  </div>
                  <h3 className="text-xs md:text-sm font-bold break-words line-clamp-2">{category.name}</h3>
                  <span className="text-xs text-slate-400 capitalize mt-1">{category.type}</span>
                </div>

                {/* Buttons Section */}
                <div className="flex gap-1 pt-2 md:pt-3 border-t border-slate-700">
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="flex-1 btn btn-primary text-xs"
                    aria-label={`Edit ${category.name} category`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id, category.name)}
                    className="flex-1 btn btn-danger text-xs"
                    aria-label={`Delete ${category.name} category`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-slate-400 text-xs md:text-base">
              {categories.length === 0
                ? 'No categories yet. Create one to get started!'
                : 'No categories match your search.'}
            </p>
          </div>
        )}

        {/* Summary */}
        {filteredCategories.length > 0 && (
          <div className="mt-6 card">
            <p className="text-xs md:text-sm text-slate-300">
              Showing <span className="font-semibold text-white">{filteredCategories.length}</span> of{' '}
              <span className="font-semibold text-white">{categories.length}</span> categories
            </p>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Category?"
          message={`Are you sure you want to delete "${confirmDialog.categoryName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' })}
        />
      </div>
    </div>
    </PageWrapper>
  );
}


