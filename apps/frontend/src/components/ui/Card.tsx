import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const baseClasses = `
    bg-gradient-to-br from-gray-800 to-gray-850
    border border-gray-700/50
    rounded-xl
    shadow-lg
    transition-all duration-200
  `.trim();

  const hoverClasses = hover
    ? 'hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 hover:-translate-y-0.5 cursor-pointer'
    : '';

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${hoverClasses}
        ${paddingClasses[padding]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
};


