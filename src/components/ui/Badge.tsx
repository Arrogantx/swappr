import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-200 text-gray-800',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
};