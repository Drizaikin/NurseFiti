import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  // Generate initials from name
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Generate consistent color from name
  const getColorFromName = (name?: string) => {
    if (!name) return 'bg-teal-light text-teal';
    const colors = [
      'bg-teal-light text-teal',
      'bg-amber-light text-amber-dark',
      'bg-[#DFFBF1] text-[#0F6E56]',
      'bg-[#FFE8E8] text-[#C0392B]',
      'bg-[#F3E8FF] text-[#7C3AED]',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-syne font-bold ${getColorFromName(name)} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
