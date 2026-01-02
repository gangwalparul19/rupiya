'use client';

import type React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  error?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export default function FormSelect({
  icon,
  error,
  options,
  className = '',
  children,
  ...props
}: FormSelectProps) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
      <select
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-slate-700/50 border border-slate-600
          text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none cursor-pointer
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options ? (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {/* Dropdown arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
