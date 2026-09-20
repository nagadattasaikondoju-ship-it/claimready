'use client';

import React from 'react';
import { FileSearch } from 'lucide-react';

interface CitationChipProps {
  clause: string;
  page: number;
  onClick?: () => void;
  className?: string;
}

export function CitationChip({ clause, page, onClick, className = '' }: CitationChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF1FF] text-[#1958E8] border border-[#1958E8]/20 hover:bg-[#D7E5FF] transition-colors ${className}`}
      title={`Open Clause ${clause} on page ${page}`}
    >
      <FileSearch className="w-3 h-3 text-[#1958E8] flex-shrink-0" />
      <span className="whitespace-nowrap">Clause {clause}, p. {page}</span>
    </button>
  );
}
