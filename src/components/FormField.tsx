'use client';

import type React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  helperText?: string;
}

export default function FormField({
  label,
  required = false,
  error,
  children,
  helperText,
}: FormFieldProps) {
  return (
    <div className="form-group">
      <label className="block text-sm font-semibold text-slate-200 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {children}
      </div>
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400 mt-1.5">{helperText}</p>}
    </div>
  );
}
