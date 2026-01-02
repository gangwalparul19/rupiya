'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';

export default function NotesPage() {
  const { notes, removeNote, updateNote, addNote } = useAppStore();
  const { success, error } = useToast();
  const [showModalInline, setShowModalInline] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const kpiStats = useMemo(() => {
    return {
      totalNotes: notes.length,
    };
  }, [notes]);

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (!formData.title || !formData.content) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      addNote({
        id: `note_${Date.now()}`,
        title: formData.title,
        content: formData.content,
        date: new Date(),
      });

      success('Note added successfully');
      setFormData({
        title: '',
        content: '',
      });
      setShowModalInline(false);
    } catch (err) {
      console.error('Error adding note:', err);
      error('Failed to add note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) {
      error('Content cannot be empty');
      return;
    }
    updateNote(id, { content: editContent });
    success('Note updated successfully');
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      removeNote(id);
      success('Note deleted successfully');
    }
  };

  const handleExportCSV = () => {
    if (filteredNotes.length === 0) {
      error('No notes to export');
      return;
    }

    let csv = 'Title,Date,Content\n';
    filteredNotes.forEach((note) => {
      const date = note.date instanceof Date ? note.date.toLocaleDateString() : new Date(note.date).toLocaleDateString();
      csv += `"${note.title}","${date}","${note.content.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Notes exported to CSV');
  };

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">📝 Notes & Daily Logs</h1>
          <p className="text-secondary">Keep track of your daily notes and logs</p>
        </div>

        {/* KPI Cards */}
        <div className="grid-responsive-3 mb-10 md:mb-16">
          <div className="kpi-card">
            <p className="kpi-label text-blue-400">Total Notes</p>
            <p className="kpi-value text-white">{kpiStats.totalNotes}</p>
            <p className="kpi-subtitle text-slate-400">Captured thoughts</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-10 md:mb-12 flex-wrap">
          <button
            onClick={() => {
              setShowModalInline(true);
              setFormData({
                title: '',
                content: '',
              });
            }}
            className="btn btn-primary px-8 shadow-lg shadow-blue-500/20"
          >
            + Add Note
          </button>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary border-green-500/20 hover:border-green-500/40 text-green-400"
          >
            📥 CSV
          </button>
        </div>

        {/* Add Note Modal - Inline */}
        {showModalInline && (
          <div className="card mb-6 md:mb-8">
            <h2 className="heading-section mb-4">Add Note</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="md:col-span-2">
                  <label className="form-label">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Note title"
                    className="form-input"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your note here..."
                    className="form-textarea resize-none"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalInline(false);
                    setFormData({
                      title: '',
                      content: '',
                    });
                  }}
                  className="flex-1 btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6 md:mb-8">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid-responsive-3 mb-6 md:mb-8">
            {filteredNotes.map((note) => {
              const date = note.date instanceof Date ? note.date.toLocaleDateString() : new Date(note.date).toLocaleDateString();
              const isEditing = editingId === note.id;

              return (

                <div key={note.id} className="card">
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-bold text-white">{note.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{date}</p>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="form-textarea resize-none"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="flex-1 btn btn-success btn-small"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 btn btn-secondary btn-small"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-300 text-xs md:text-sm mb-4 line-clamp-3">{note.content}</p>
                      <div className="flex gap-2 pt-4 border-t border-slate-700">
                        <button
                          onClick={() => handleEdit(note.id, note.content)}
                          className="flex-1 btn btn-primary btn-small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex-1 btn btn-danger btn-small"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>

              );
            })}
          </div>
        ) : (
          <div className="card text-center py-8 md:py-12">
            <p className="text-slate-400 text-sm md:text-base">
              {notes.length === 0 ? 'No notes yet. Create one to get started!' : 'No notes match your search.'}
            </p>
          </div>
        )}

        {filteredNotes.length > 0 && (
          <div className="card">
            <p className="text-slate-300 text-xs md:text-sm">
              Showing <span className="font-semibold text-white">{filteredNotes.length}</span> of{' '}
              <span className="font-semibold text-white">{notes.length}</span> notes
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}


