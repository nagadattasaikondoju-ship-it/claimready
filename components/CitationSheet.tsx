'use client';

import React, { useEffect } from 'react';
import { X, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { IconTile } from './IconTile';

interface CitationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  clause: string;
  page: number;
  quote: string;
  title: string;
  policyName: string;
}

export function CitationSheet({
  isOpen,
  onClose,
  clause,
  page,
  quote,
  title,
  policyName,
}: CitationSheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-fadeIn p-0 sm:p-4">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Drawer Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-[20px] p-6 text-left border border-[#E2E8F0] space-y-4 max-h-[85vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-3.5">
          <div className="flex items-center gap-3">
            <IconTile icon={BookOpen} variant="blue" size="md" />
            <div>
              <div className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
                100% Grounded Policy Citation
              </div>
              <h3 className="text-[17px] font-bold text-[#1A1F2B] leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAFBFC] hover:bg-[#EAF1FF] text-[#595959] hover:text-[#1958E8] flex items-center justify-center transition-colors border border-[#E2E8F0]"
            aria-label="Close sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location badge */}
        <div className="flex items-center justify-between bg-[#EAF1FF] p-3 rounded-xl border border-[#1958E8]/15 text-[12px]">
          <span className="font-semibold text-[#1958E8]">
            {policyName}
          </span>
          <span className="font-bold text-[#1958E8] bg-white px-2.5 py-0.5 rounded-full border border-[#1958E8]/20">
            Clause {clause} • Page {page}
          </span>
        </div>

        {/* Exact contract quote highlighted */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-[#595959] uppercase tracking-wider flex items-center gap-1">
            <span>Exact Policy Wording:</span>
          </div>

          <div className="bg-[#FAFBFC] border-l-4 border-[#1958E8] p-4 rounded-r-xl border-y border-r border-[#E2E8F0]">
            <p className="text-[14px] leading-relaxed text-[#1A1F2B] font-mono italic">
              "{quote}"
            </p>
          </div>
        </div>

        {/* Verification Guarantee */}
        <div className="p-3 bg-[#EAFBF1] rounded-xl border border-[#1FAA5C]/25 flex items-center gap-2 text-[12px] text-[#1FAA5C] font-semibold">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Zero AI hallucination or guesswork • Exact excerpt from your contract</span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#1958E8] hover:bg-[#1447C0] text-white text-[14px] font-bold rounded-full transition-colors min-h-[48px]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
