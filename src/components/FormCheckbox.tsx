'use client';

import type React from 'react';

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function FormCheckbox({ label, className = '', ...props }: FormCheckboxProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        className={`
          w-5 h-5 rounded
          bg-slate-700/50 border border-slate-600
          text-blue-500 cursor-pointer
          focus:ring-2 focus:ring-blue-500/50
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      {label && <label className="text-sm font-medium text-slate-200 cursor-pointer">{label}</label>}
    </div>
  );
}
