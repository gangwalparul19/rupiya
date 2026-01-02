'use client';

import { ReactNode } from 'react';

/**
 * Props for the ConfirmDialog component
 */
interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Title displayed in the dialog header */
  title: string;
  /** Message displayed in the dialog body */
  message: string;
  /** Text for the confirm button (default: "Confirm") */
  confirmText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelText?: string;
  /** Whether this is a dangerous action (shows red button) */
  isDangerous?: boolean;
  /** Callback function when user confirms */
  onConfirm: () => void;
  /** Callback function when user cancels */
  onCancel: () => void;
  /** Optional additional content to display */
  children?: ReactNode;
}

/**
 * Confirmation dialog component for destructive actions
 * Prevents accidental data loss by requiring user confirmation
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   title="Delete Item?"
 *   message="Are you sure you want to delete this item?"
 *   isDangerous={true}
 *   onConfirm={handleDelete}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-up">
      <div className={`card p-4 md:p-6 border-2 ${isDangerous ? 'border-red-500/50' : 'border-blue-500/50'} bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-md mx-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-300 text-sm md:text-base mb-4">{message}</p>

        {children && <div className="mb-4 text-sm text-gray-400">{children}</div>}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 btn btn-secondary text-sm"
            aria-label={`${cancelText} action`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 btn btn-small text-sm ${isDangerous ? 'btn-danger' : 'btn-primary shadow-lg shadow-blue-500/20'}`}
            aria-label={`${confirmText} action`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
