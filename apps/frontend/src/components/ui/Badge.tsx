import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const baseClasses = `
    inline-flex items-center gap-1.5 font-semibold rounded-full
    transition-all duration-200
  `.trim();

  const variantClasses = {
    success: 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30',
    error: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30',
    default: 'bg-gray-700/50 text-gray-300 ring-1 ring-gray-600/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    default: 'bg-gray-500',
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};


