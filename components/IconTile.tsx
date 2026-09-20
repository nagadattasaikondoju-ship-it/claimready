'use client';

import React from 'react';

interface IconTileProps {
  icon: React.ElementType;
  variant?: 'blue' | 'green' | 'amber' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export function IconTile({ icon: Icon, variant = 'blue', size = 'md' }: IconTileProps) {
  const colorMap = {
    blue: 'bg-[#EAF1FF] text-[#1958E8] border border-[#1958E8]/15',
    green: 'bg-[#EAFBF1] text-[#1FAA5C] border border-[#1FAA5C]/20',
    amber: 'bg-[#FFF6E9] text-[#D97706] border border-[#D97706]/20',
    red: 'bg-[#FDE8E8] text-[#C0392B] border border-[#C0392B]/20',
  };

  const sizeMap = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`${sizeMap[size]} ${colorMap[variant]} flex items-center justify-center flex-shrink-0 transition-transform`}
    >
      <Icon className={`${iconSizeMap[size]} stroke-[2.2]`} />
    </div>
  );
}
