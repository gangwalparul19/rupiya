'use client';

import type React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export default function FormTextarea({ error, className = '', ...props }: FormTextareaProps) {
  return (
    <textarea
      className={`
        w-full px-4 py-2.5 rounded-lg
        bg-slate-700/50 border border-slate-600
        text-white placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        resize-none
        ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  );
}
