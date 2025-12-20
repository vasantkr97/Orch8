import React from 'react';
import { colors, transitions } from '../../styles/design-system';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `.trim();

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700 border border-blue-500 hover:border-blue-400
      text-white shadow-md hover:shadow-lg shadow-blue-500/25
      focus:ring-blue-500
    `,
    secondary: `
      bg-orange-600 hover:bg-orange-700 border border-orange-500 hover:border-orange-400
      text-white shadow-md hover:shadow-lg shadow-orange-500/25
      focus:ring-orange-500
    `,
    success: `
      bg-green-600 hover:bg-green-700 border border-green-500 hover:border-green-400
      text-white shadow-md hover:shadow-lg shadow-green-500/25
      focus:ring-green-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700 border border-red-500 hover:border-red-400
      text-white shadow-md hover:shadow-lg shadow-red-500/25
      focus:ring-red-500
    `,
    ghost: `
      bg-transparent hover:bg-slate-800
      text-slate-300 hover:text-white
      focus:ring-slate-500
    `,
    outline: `
      bg-transparent border-2 border-slate-700 hover:border-slate-600
      text-slate-300 hover:text-white hover:bg-slate-800/50
      focus:ring-slate-500
    `,
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};


