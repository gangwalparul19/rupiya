'use client';

import type React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

export default function FormInput({ icon, error, className = '', ...props }: FormInputProps) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-slate-700/50 border border-slate-600
          text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
