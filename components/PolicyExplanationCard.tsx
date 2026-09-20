'use client';

import React, { useState } from 'react';
import { PolicyData, CoverageField } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { CitationSheet } from './CitationSheet';
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
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSearch,
  BookOpen,
  Share2,
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

interface PolicyExplanationCardProps {
  policy: PolicyData;
}

export function PolicyExplanationCard({ policy }: PolicyExplanationCardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCitationField, setActiveCitationField] = useState<CoverageField | null>(null);
  const [expandedVerbatim, setExpandedVerbatim] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Terms (10)' },
    { id: 'caps', label: 'Caps & Limits' },
    { id: 'waiting', label: 'Waiting Periods' },
    { id: 'logistics', label: 'Days & Deadlines' },
    { id: 'procedures', label: 'Sub-limits' },
  ];

  const filteredFields =
    selectedCategory === 'all'
      ? policy.fields
      : policy.fields.filter((f) => f.category === selectedCategory);

  const toggleVerbatim = (key: string) => {
    setExpandedVerbatim((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#DDE2EA] shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#DDE2EA]/60 pb-5">
          <div className="space-y-1">
            <div className="text-[12px] font-bold text-[#1E4FA8] uppercase tracking-wider">
              {policy.insurerName}
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#1A1F2B] leading-tight">
              {policy.policyName}
            </h2>
            <div className="text-[12px] text-[#5A6272] font-mono">
              Policy No: <span className="font-semibold text-[#1A1F2B]">{policy.policyNumber}</span>
            </div>
          </div>

          <div className="bg-[#E8EEF9] rounded-2xl p-3.5 border border-[#1E4FA8]/20 text-right self-start sm:self-auto min-w-[150px]">
            <span className="text-[11px] font-semibold text-[#5A6272] block">Total Sum Insured</span>
            <div className="text-[18px] sm:text-[20px] font-extrabold text-[#1E4FA8] mt-0.5">
              {policy.sumInsured}
            </div>
          </div>
        </div>

        {/* 3 Summary Metadata Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#DDE2EA]">
            <span className="text-[11px] text-[#5A6272] block">Policy Period</span>
            <span className="text-[13px] font-bold text-[#1A1F2B] mt-0.5 block">{policy.policyPeriod}</span>
          </div>

          <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#DDE2EA]">
            <span className="text-[11px] text-[#5A6272] block">Family Members</span>
            <span className="text-[13px] font-bold text-[#1A1F2B] mt-0.5 block">{policy.familyMembers}</span>
          </div>

          <div className="p-3 bg-[#E6F7EE] rounded-xl border border-[#22B573]/25">
            <span className="text-[11px] text-[#0E7A4A] block">Evidence Guarantee</span>
            <span className="text-[13px] font-bold text-[#0E7A4A] mt-0.5 block">100% Clause Cited</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-[12px] px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#1E4FA8] text-white shadow-xs'
                : 'bg-white border border-[#DDE2EA] text-[#5A6272] hover:text-[#1A1F2B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 10 Detailed Coverage Terms */}
      <div className="space-y-4">
        {filteredFields.map((field, idx) => {
          const IconComp = field.iconName && ICON_MAP[field.iconName] ? ICON_MAP[field.iconName] : Bed;
          const isExpanded = !!expandedVerbatim[field.field];

          return (
            <div
              key={field.field || idx}
              className="bg-white rounded-[22px] p-5 sm:p-6 border border-[#DDE2EA] shadow-card space-y-4 hover:border-[#1E4FA8]/40 transition-colors"
            >
              {/* Field Header: Icon + Title + Citation + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8EEF9] text-[#1E4FA8] flex items-center justify-center flex-shrink-0">
                    <IconComp className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-[#1A1F2B] leading-snug">
                      {field.title}
                    </h3>
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => setActiveCitationField(field)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E8EEF9] text-[#1E4FA8] border border-[#1E4FA8]/20 hover:bg-blue-100 transition-colors shadow-xs"
                      >
                        <FileSearch className="w-3 h-3" />
                        <span>Clause {field.clause}, p. {field.page}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <StatusBadge status={field.status} />
              </div>

              {/* Bold Value & Legal Explanation */}
              <div>
                <div className="text-[19px] sm:text-[21px] font-bold text-[#1E4FA8] tracking-tight">
                  {field.value}
                </div>
                <p className="text-[13px] text-[#5A6272] mt-1 leading-relaxed">
                  {field.explanation}
                </p>
              </div>

              {/* In Simple Language Explainer Card */}
              {field.plainMeaning && (
                <div className="bg-[#E8EEF9]/60 rounded-2xl p-4 border border-[#1E4FA8]/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1E4FA8] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#1E4FA8]" />
                    <span>In simple language</span>
                  </div>
                  <p className="text-[13px] text-[#1A1F2B] leading-relaxed">
                    {field.plainMeaning}
                  </p>
                </div>
              )}

              {/* Expandable Verbatim Policy Text */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleVerbatim(field.field)}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#1E4FA8] hover:underline"
                >
                  <span>{isExpanded ? 'Hide exact policy clause' : 'Show exact policy clause'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-2.5 p-3.5 bg-[#F7F9FC] rounded-xl border border-[#DDE2EA] text-[12px] font-mono text-[#1A1F2B] leading-relaxed animate-fadeIn">
                    <div className="text-[10px] font-bold text-[#5A6272] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#1E4FA8]" />
                      <span>Clause {field.clause} (Page {field.page})</span>
                    </div>
                    <blockquote className="border-l-3 border-[#1E4FA8] pl-2.5 text-[#1A1F2B] italic">
                      "{field.quote}"
                    </blockquote>
                  </div>
                )}
              </div>

              {/* Related Benefits */}
              {field.relatedFields && field.relatedFields.length > 0 && (
                <div className="pt-2 border-t border-[#DDE2EA]/60 space-y-2">
                  <span className="text-[11px] font-bold text-[#5A6272] uppercase tracking-wider block">
                    Related Coverage Rules
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {field.relatedFields.map((rel, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#DDE2EA] text-[12px]"
                      >
                        <span className="font-semibold text-[#1A1F2B]">{rel.title}</span>
                        <span className="text-[11px] text-[#1E4FA8] font-semibold bg-[#E8EEF9] px-2 py-0.5 rounded-full border border-[#1E4FA8]/20">
                          Clause {rel.clause}, p. {rel.page}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Citation Sheet Drawer Modal */}
      {activeCitationField && (
        <CitationSheet
          isOpen={!!activeCitationField}
          onClose={() => setActiveCitationField(null)}
          clause={activeCitationField.clause}
          page={activeCitationField.page}
          quote={activeCitationField.quote}
          title={activeCitationField.title}
          policyName={policy.policyName}
        />
      )}
    </div>
  );
}
