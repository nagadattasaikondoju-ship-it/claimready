'use client';

import React from 'react';
import { StatusType } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  if (status === 'covered') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F7EE] text-[#0E7A4A] border border-[#22B573]/25 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 text-[#22B573]" />
        <span>{label || 'Covered'}</span>
      </span>
    );
  }

  if (status === 'warning') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF6E7] text-[#B7791F] border border-[#B7791F]/25 ${className}`}
      >
        <AlertTriangle className="w-3 h-3 text-[#B7791F]" />
        <span>{label || 'Check this'}</span>
      </span>
    );
  }

  if (status === 'not_covered') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/25 ${className}`}
      >
        <XCircle className="w-3 h-3 text-[#C0392B]" />
        <span>{label || 'Not covered'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F7F9FC] text-[#5A6272] border border-[#DDE2EA] ${className}`}
    >
      <HelpCircle className="w-3 h-3 text-[#5A6272]" />
      <span>{label || 'Not found'}</span>
    </span>
  );
}
