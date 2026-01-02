'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import { storageService } from '@/lib/storageService';
import { getFirebaseAuth } from '@/lib/firebase';

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
      const auth = getFirebaseAuth();
      if (!auth || !auth.currentUser) {
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
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">🗂️ Document Vault</h1>
          <p className="text-secondary">Store and organize your important documents</p>
        </div>

        {/* KPI Cards */}
        <div className="grid-responsive-3 mb-6 md:mb-8">
          <div className="card">
            <p className="text-slate-400 text-xs mb-1">Total Documents</p>
            <p className="text-lg md:text-2xl font-bold text-blue-400">{kpiStats.totalDocuments}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-3 mb-6 md:mb-8">
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
            className="flex-1 btn btn-primary"
          >
            + Add Document
          </button>
        </div>

        {/* Add Document Modal - Inline */}
        {showModalInline && (
          <div className="card mb-6 md:mb-8">
            <h2 className="heading-section mb-4">Add Document</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="form-label">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Document name"
                    className="form-input"
                    required
                  />
                </div>

                <div>
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
                    <option value="">Select Type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleChange}
                    className="form-input file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer"
                    required
                  />
                  {formData.file && (
                    <p className="text-xs text-slate-400 mt-2">Selected: {formData.file.name}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-4 border-t border-slate-700">
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
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
          <input
            type="text"
            placeholder="Search documents..."
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
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid-responsive-3 mb-6 md:mb-8">
            {filteredDocuments.map((doc) => {
              const uploadDate = doc.uploadedAt instanceof Date
                ? doc.uploadedAt.toLocaleDateString()
                : new Date(doc.uploadedAt).toLocaleDateString();

              return (

                <div key={doc.id} className="card">
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-bold text-white truncate">{doc.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{doc.type}</p>
                    <p className="text-xs text-slate-500 mt-1">{uploadDate}</p>
                  </div>

                  {doc.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn btn-success btn-small text-center"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="flex-1 btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              );
            })}
          </div>
        ) : (
          <div className="card text-center py-8 md:py-12">
            <p className="text-slate-400 text-sm md:text-base">
              {documents.length === 0 ? 'No documents yet. Add one to get started!' : 'No documents match your search.'}
            </p>
          </div>
        )}

        {filteredDocuments.length > 0 && (
          <div className="card">
            <p className="text-slate-300 text-xs md:text-sm">
              Showing <span className="font-semibold text-white">{filteredDocuments.length}</span> of{' '}
              <span className="font-semibold text-white">{documents.length}</span> documents
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}


