'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

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
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Notes & Daily Logs</h1>
          <p className="text-gray-400">Keep track of your daily notes and logs</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mb-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Notes</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalNotes}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setShowModalInline(true);
              setFormData({
                title: '',
                content: '',
              });
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Note
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ↓ Export CSV
          </button>
        </div>

        {/* Add Note Modal - Inline */}
        {showModalInline && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Add Note</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Note title"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your note here..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalInline(false);
                    setFormData({
                      title: '',
                      content: '',
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
                  {isLoading ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const date = note.date instanceof Date ? note.date.toLocaleDateString() : new Date(note.date).toLocaleDateString();
              const isEditing = editingId === note.id;

              return (
                <div key={note.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{note.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{note.content}</p>
                      <div className="flex gap-2 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => handleEdit(note.id, note.content)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {notes.length === 0 ? 'No notes yet. Create one to get started!' : 'No notes match your search.'}
            </p>
          </div>
        )}

        {filteredNotes.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Showing <span className="font-semibold text-white">{filteredNotes.length}</span> of{' '}
              <span className="font-semibold text-white">{notes.length}</span> notes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
