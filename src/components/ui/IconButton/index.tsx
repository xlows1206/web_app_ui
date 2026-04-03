import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  iconClassName?: string;
};

export default function IconButton({ 
  icon: Icon, 
  iconClassName = 'text-on-surface-variant', 
  className = '', 
  ...rest 
}: IconButtonProps) {
  return (
    <button 
      type="button"
      className={`p-2 hover:bg-black/5 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center ${className}`}
      {...rest}
    >
      <Icon className={iconClassName} strokeWidth={2.5} size={20} />
    </button>
  );
}
