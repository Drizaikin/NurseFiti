import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'teal' | 'amber' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'teal',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    teal: 'bg-teal',
    amber: 'bg-amber',
    green: 'bg-green',
    red: 'bg-red',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-border rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs font-bold text-dark dark:text-white text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
