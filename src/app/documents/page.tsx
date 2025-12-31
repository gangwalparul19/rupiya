'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import { storageService } from '@/lib/storageService';
import { auth } from '@/lib/firebase';

export default function DocumentsPage() {
  const { documents, addDocument, removeDocument } = useAppStore();
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModalInline, setShowModalInline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    file: null as File | null,
    tags: '',
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || doc.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [documents, searchTerm, filterType]);

  const kpiStats = useMemo(() => {
    return {
      totalDocuments: documents.length,
    };
  }, [documents]);

  const documentTypes = ['Invoice', 'Receipt', 'Contract', 'Insurance', 'Tax', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    
    if (target.type === 'file') {
      const files = target.files;
      setFormData((prev) => ({
        ...prev,
        file: files ? files[0] : null,
      }));
    } else {
      const { name, value } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.type || !formData.file) {
        error('Please fill in all required fields and select a file');
        setIsLoading(false);
        return;
      }

      // Check if user is authenticated
      if (!auth.currentUser) {
        error('You must be logged in to upload documents');
        setIsLoading(false);
        return;
      }

      // Upload file to Firebase Storage
      const downloadURL = await storageService.uploadDocument(formData.file, auth.currentUser.uid);

      const newDoc = {
        id: `doc_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        url: downloadURL,
        uploadedAt: new Date(),
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
      };

      addDocument(newDoc);
      success('Document uploaded successfully');

      setFormData({
        name: '',
        type: '',
        file: null,
        tags: '',
      });
      setShowModalInline(false);
    } catch (err) {
      console.error('Error uploading document:', err);
      error('Failed to upload document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      removeDocument(id);
      success('Document deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Document Vault</h1>
          <p className="text-gray-400">Store and organize your important documents</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mb-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Documents</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalDocuments}</p>
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
                file: null,
                tags: '',
              });
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Document
          </button>
        </div>

        {/* Add Document Modal - Inline */}
        {showModalInline && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Add Document</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Document name"
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
                    <option value="">Select Type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                    required
                  />
                  {formData.file && (
                    <p className="text-sm text-gray-400 mt-2">Selected: {formData.file.name}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
                      file: null,
                      tags: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search documents..."
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
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => {
              const uploadDate = doc.uploadedAt instanceof Date 
                ? doc.uploadedAt.toLocaleDateString()
                : new Date(doc.uploadedAt).toLocaleDateString();

              return (
                <div key={doc.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white truncate">{doc.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{doc.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{uploadDate}</p>
                  </div>

                  {doc.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {documents.length === 0 ? 'No documents yet. Add one to get started!' : 'No documents match your search.'}
            </p>
          </div>
        )}

        {filteredDocuments.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Showing <span className="font-semibold text-white">{filteredDocuments.length}</span> of{' '}
              <span className="font-semibold text-white">{documents.length}</span> documents
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
