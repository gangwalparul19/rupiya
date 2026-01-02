'use client';

import { ReactNode } from 'react';

/**
 * Props for the FormModal component
 */
interface FormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Title displayed in the modal header */
  title: string;
  /** Callback function when modal is closed */
  onClose: () => void;
  /** Callback function when form is submitted */
  onSubmit: (e: React.FormEvent) => Promise<void>;
  /** Form content to display inside the modal */
  children: ReactNode;
  /** Text for the submit button (default: "Submit") */
  submitText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelText?: string;
  /** Whether the form is currently loading */
  isLoading?: boolean;
  /** CSS class for max height (default: "max-h-[90vh]") */
  maxHeight?: string;
}

/**
 * Reusable FormModal component for consistent form dialogs across the app
 * Handles modal layout, form submission, and loading states
 * 
 * @example
 * ```tsx
 * <FormModal
 *   isOpen={isOpen}
 *   title="Add Item"
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={handleSubmit}
 *   submitText="Create"
 * >
 *   <input type="text" placeholder="Name" />
 * </FormModal>
 * ```
 */
export default function FormModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false,
  maxHeight = 'max-h-[90vh]',
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-up">
      <div className={`card border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto ${maxHeight} overflow-y-auto`}>
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-700 flex justify-between items-center bg-transparent">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {children}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-6 mt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary text-sm"
              disabled={isLoading}
              aria-label={`${cancelText} ${title.toLowerCase()}`}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary text-sm shadow-lg shadow-blue-500/20"
              disabled={isLoading}
              aria-label={submitText}
            >
              {isLoading ? 'Processing...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
