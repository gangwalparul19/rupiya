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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-3 md:p-4 z-50">
      <div className={`bg-gray-800 rounded-lg ${maxHeight} overflow-y-auto w-full max-w-sm`}>
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-6 sticky top-0 bg-gray-800 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{title}</h2>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {children}

          {/* Footer Buttons */}
          <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-2 sm:px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium text-xs sm:text-sm"
              disabled={isLoading}
              aria-label={`${cancelText} ${title.toLowerCase()}`}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="flex-1 px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-label={submitText}
            >
              {isLoading ? 'Loading...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
