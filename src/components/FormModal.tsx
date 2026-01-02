'use client';

import type React from 'react';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  // Legacy props for backward compatibility
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function FormModal({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 'lg',
  onSubmit,
  submitText,
  cancelText,
  isLoading = false,
}: FormModalProps) {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`${maxWidthClass} w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 animate-slide-up`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors ml-4 flex-shrink-0"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Legacy form wrapper */}
          {onSubmit ? (
            <form onSubmit={onSubmit} className="space-y-4">
              {children}
              <div className="flex gap-3 pt-6 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText || 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    submitText || 'Submit'
                  )}
                </button>
              </div>
            </form>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
