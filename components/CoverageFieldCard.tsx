'use client';

import React, { useState } from 'react';
import { CoverageField } from '@/lib/types';
import { StatusPill } from './StatusPill';
import { CitationChip } from './CitationChip';
import { ExplainerCard } from './ExplainerCard';
import { IconTile } from './IconTile';
import {
  Bed,
  Activity,
  Percent,
  Clock,
  ShieldAlert,
  Calendar,
  AlertCircle,
  Receipt,
  BellRing,
  Award,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Bed,
  Activity,
  Percent,
  Clock,
  ShieldAlert,
  Calendar,
  AlertCircle,
  Receipt,
  BellRing,
  Award,
};

interface CoverageFieldCardProps {
  field: CoverageField;
  onOpenCitation?: (clause: string, page: number, quote: string, title: string) => void;
}

export function CoverageFieldCard({ field, onOpenCitation }: CoverageFieldCardProps) {
  const IconComp = field.iconName && ICON_MAP[field.iconName] ? ICON_MAP[field.iconName] : Bed;

  return (
    <div className="bg-white rounded-[20px] p-4.5 border border-[#E2E8F0] space-y-3 text-left hover:border-[#1958E8]/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={IconComp} variant="blue" size="md" />
          <div>
            <h3 className="text-[15px] font-bold text-[#1A1F2B] leading-snug">
              {field.title}
            </h3>
            <div className="mt-0.5">
              <CitationChip
                clause={field.clause}
                page={field.page}
                onClick={() =>
                  onOpenCitation && onOpenCitation(field.clause, field.page, field.quote, field.title)
                }
              />
            </div>
          </div>
        </div>

        <StatusPill status={field.status} />
      </div>

      <div>
        <div className="text-[17px] font-bold text-[#1958E8] tracking-tight">
          {field.value}
        </div>
        <p className="text-[13px] text-[#595959] mt-0.5 leading-relaxed">
          {field.explanation}
        </p>
      </div>

      {field.plainMeaning && (
        <ExplainerCard
          plainMeaning={field.plainMeaning}
          quote={field.quote}
          clause={field.clause}
          page={field.page}
          onOpenCitation={() =>
            onOpenCitation && onOpenCitation(field.clause, field.page, field.quote, field.title)
          }
        />
      )}

      {field.relatedFields && field.relatedFields.length > 0 && (
        <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5 text-[12px]">
          <span className="font-bold text-[#595959] uppercase tracking-wider text-[10px]">
            Related Coverages:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {field.relatedFields.map((rel: { title: string; clause: string; page: number }, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onOpenCitation && onOpenCitation(rel.clause, rel.page, field.quote, rel.title)
                }
                className="p-1.5 px-2.5 bg-[#FAFBFC] rounded-lg border border-[#E2E8F0] text-[11px] font-semibold text-[#1A1F2B] flex items-center gap-1.5 hover:bg-[#EAF1FF]"
              >
                <span>{rel.title}</span>
                <span className="text-[#1958E8]">p. {rel.page}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverageFieldCard;
