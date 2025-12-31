'use client';

import { useToast } from '@/lib/toastContext';
import { ToastContainer } from './Toast';

export default function ToastWrapper() {
  const { toasts, removeToast } = useToast();

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
}
