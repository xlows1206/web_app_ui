import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarMember = {
  name: string;
  image?: string;
};

export type AvatarProps = {
  name: string;
  image?: string;
  size?: AvatarSize;
  showName?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-rose-500',
  'from-blue-500 to-cyan-400',
  'from-fuchsia-500 to-pink-500',
  'from-amber-400 to-orange-500',
];

export const SIZE_MAP: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[12px]',
  md: 'w-10 h-10 text-[14px]',
  lg: 'w-12 h-12 text-[16px]',
  xl: 'w-14 h-14 text-[20px]',
};

/**
 * A premium Avatar component with deterministic gradients and high-contrast initials.
 */
export default function Avatar({
  name,
  image,
  size = 'md',
  showName = false,
  className = '',
  style = {},
}: AvatarProps) {
  const initials = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
  
  // Deterministic gradient selection based on name
  const getGradientIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % GRADIENTS.length;
  };

  const gradientClass = GRADIENTS[getGradientIndex(name || 'default')];
  const sizeClass = SIZE_MAP[size];

  return (
    <div 
      className={`flex items-center gap-3 shrink-0 ${className}`}
      style={style}
    >
      <div className={`${sizeClass} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden shrink-0 border-2 border-white/80 transition-transform active:scale-95`}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-black text-white antialiased">{initials}</span>
        )}
      </div>
      {showName && (
        <span className="text-[14px] font-black text-on-surface tracking-tight truncate max-w-[120px]">
          {name}
        </span>
      )}
    </div>
  );
}
