import React from 'react';

interface NurseFitiLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NurseFitiLogo({ variant = 'full', className = '', size = 'md' }: NurseFitiLogoProps) {
  const sizes = {
    sm: { container: 28, wordmark: 14 },
    md: { container: 36, wordmark: 18 },
    lg: { container: 48, wordmark: 24 },
  };

  const currentSize = sizes[size];

  // Icon only - ECG + checkmark in rounded rectangle
  if (variant === 'icon') {
    return (
      <svg
        width={currentSize.container}
        height={currentSize.container}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="72" height="72" rx="18" fill="#08514F" />
        <path
          d="M 9,41 L 17,41 L 20,35 L 23,41 L 27,41 L 29,19 L 31,57 L 33,41 L 40,41"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 40,41 L 46,50 L 62,27"
          stroke="#F5A623"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  // Wordmark only - "NurseFiti" text
  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span
          className="font-syne text-dark dark:text-white"
          style={{ fontSize: currentSize.wordmark, fontWeight: 400 }}
        >
          Nurse
        </span>
        <span
          className="font-syne text-teal"
          style={{ fontSize: currentSize.wordmark, fontWeight: 800 }}
        >
          Fiti
        </span>
      </div>
    );
  }

  // Full logo - icon + wordmark
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={currentSize.container}
        height={currentSize.container}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="72" height="72" rx="18" fill="#08514F" />
        <path
          d="M 9,41 L 17,41 L 20,35 L 23,41 L 27,41 L 29,19 L 31,57 L 33,41 L 40,41"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 40,41 L 46,50 L 62,27"
          stroke="#F5A623"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div className="flex items-center gap-1">
        <span
          className="font-syne text-dark dark:text-white"
          style={{ fontSize: currentSize.wordmark, fontWeight: 400 }}
        >
          Nurse
        </span>
        <span
          className="font-syne text-teal"
          style={{ fontSize: currentSize.wordmark, fontWeight: 800 }}
        >
          Fiti
        </span>
      </div>
    </div>
  );
}
