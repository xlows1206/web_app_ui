import React from 'react';

export type BadgeProps = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'pill';
  colorClassName?: string;
  className?: string;
};

export default function Badge({ 
  children, 
  variant = 'pill', 
  colorClassName = 'text-primary',
  className = '' 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium uppercase tracking-widest";
  
  let variantStyles = "";
  if (variant === 'pill') {
    variantStyles = `bg-white px-3 py-1 rounded-full text-[10px] sm:text-xs shadow-sm ${colorClassName}`;
  } else if (variant === 'solid') {
    variantStyles = `bg-white/20 px-3 py-1 rounded-full text-[10px] sm:text-xs ${colorClassName}`;
  } else if (variant === 'outline') {
    variantStyles = `bg-transparent border border-outline-variant px-3 py-1 rounded-full text-xs ${colorClassName}`;
  }

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
}
