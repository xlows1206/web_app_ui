import React from 'react';
import Avatar, { AvatarSize, SIZE_MAP } from '../Avatar';

export type AvatarMember = {
  name: string;
  image?: string;
};

export type AvatarGroupProps = {
  members: AvatarMember[];
  extraCount?: number;
  size?: AvatarSize;
  className?: string;
};

/**
 * A group of overlapping Avatar components.
 */
export default function AvatarGroup({
  members,
  extraCount = 0,
  size = 'md',
  className = '',
}: AvatarGroupProps) {
  const maxVisible = 3;
  const visibleMembers = members.slice(0, maxVisible);
  const hiddenCount = Math.max(0, members.length - maxVisible);
  const totalExtra = extraCount + hiddenCount;

  return (
    <div className={`flex items-center pl-3 ${className}`}>
      {visibleMembers.map((member, idx) => (
        <Avatar
          key={idx}
          name={member.name}
          image={member.image}
          size={size}
          className="-ml-3 relative"
          style={{ zIndex: 30 - idx }}
        />
      ))}
      {totalExtra > 0 && (
        <div 
          className={`${SIZE_MAP[size]} rounded-full border-2 border-white/80 bg-slate-100 flex items-center justify-center text-slate-600 font-extrabold -ml-3 relative`}
          style={{ zIndex: 10 }}
        >
          +{totalExtra}
        </div>
      )}
    </div>
  );
}
