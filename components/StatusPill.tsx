'use client';

import React from 'react';
import { StatusType } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface StatusPillProps {
  status: StatusType;
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
  switch (status) {
    case 'covered':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold text-[#1FAA5C] bg-[#EAFBF1] px-2.5 py-0.5 rounded-full border border-[#1FAA5C]/25 whitespace-nowrap ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Covered</span>
        </span>
      );

    case 'warning':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-[#FFF6E9] px-2.5 py-0.5 rounded-full border border-[#D97706]/30 whitespace-nowrap ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Check this</span>
        </span>
      );

    case 'not_covered':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold text-[#C0392B] bg-[#FDE8E8] px-2.5 py-0.5 rounded-full border border-[#C0392B]/25 whitespace-nowrap ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Not covered</span>
        </span>
      );

    case 'not_found':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold text-[#595959] bg-[#FAFBFC] px-2.5 py-0.5 rounded-full border border-[#E2E8F0] whitespace-nowrap ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Not found</span>
        </span>
      );
  }
}
