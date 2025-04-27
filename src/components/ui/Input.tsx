import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  leftIcon,
  rightIcon,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="flex flex-col space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            flex h-10 w-full rounded-md border border-gray-700 bg-slate-900 px-3 py-2 text-sm 
            ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed 
            disabled:opacity-50 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500' : ''} ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;