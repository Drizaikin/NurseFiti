import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'amber' | 'green' | 'red' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'teal', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    teal: 'bg-teal-light text-teal',
    amber: 'bg-amber-light text-amber-dark',
    green: 'bg-[#DFFBF1] text-[#0F6E56]',
    red: 'bg-[#FFE8E8] text-[#C0392B]',
    purple: 'bg-[#F3E8FF] text-[#7C3AED]',
    gray: 'bg-[#F3F4F6] text-mid',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-xs px-3.5 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
