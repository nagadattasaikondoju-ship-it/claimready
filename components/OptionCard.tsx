'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IconTile } from './IconTile';

interface OptionCardProps {
  icon: React.ElementType;
  variant?: 'blue' | 'green' | 'amber' | 'red';
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: 'blue' | 'green' | 'amber' | 'red';
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  icon,
  variant = 'blue',
  title,
  description,
  badge,
  badgeVariant = 'blue',
  onClick,
  className = '',
}: OptionCardProps) {
  const badgeColorMap = {
    blue: 'bg-[#EAF1FF] text-[#1958E8] border-[#1958E8]/20',
    green: 'bg-[#EAFBF1] text-[#1FAA5C] border-[#1FAA5C]/20',
    amber: 'bg-[#FFF6E9] text-[#D97706] border-[#D97706]/20',
    red: 'bg-[#FDE8E8] text-[#C0392B] border-[#C0392B]/20',
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`w-full bg-white rounded-[20px] p-4.5 sm:p-5 border border-[#E2E8F0] hover:border-[#1958E8]/40 hover:bg-[#FAFBFC] transition-all flex items-center justify-between gap-3 text-left cursor-pointer group min-h-[48px] ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <IconTile icon={icon} variant={variant} size="md" />

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[15px] sm:text-[16px] font-bold text-[#1A1F2B] group-hover:text-[#1958E8] transition-colors leading-tight">
              {title}
            </h4>
            {badge && (
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeColorMap[badgeVariant]}`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#595959] leading-snug">
            {description}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 text-[#595959] group-hover:text-[#1958E8] group-hover:translate-x-0.5 transition-all">
        <ChevronRight className="w-5 h-5 stroke-[2.2]" />
      </div>
    </div>
  );
}
