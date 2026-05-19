import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-full border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-amber text-dark hover:bg-amber-dark hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,166,35,.35)]',
    secondary: 'bg-teal text-white hover:bg-teal-mid hover:-translate-y-0.5 hover:shadow',
    outline: 'bg-transparent text-teal border-2 border-teal hover:bg-teal hover:text-white',
    ghost: 'bg-transparent text-mid hover:bg-teal-xlight hover:text-teal',
    danger: 'bg-red text-white hover:bg-[#C0392B] hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-[15px] px-7 py-3.5',
    lg: 'text-base px-8 py-4',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
