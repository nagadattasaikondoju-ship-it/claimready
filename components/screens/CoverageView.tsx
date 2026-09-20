'use client';

import React, { useState } from 'react';
import { PolicyData, CoverageField } from '@/lib/types';
import { StatusPill } from '../StatusPill';
import { CitationChip } from '../CitationChip';
import { ExplainerCard } from '../ExplainerCard';
import { AssumptionCard } from '../AssumptionCard';
import { IconTile } from '../IconTile';
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
  Calculator,
  Download,
  Share2,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
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

interface CoverageViewProps {
  policy: PolicyData;
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
  onExportPDF?: () => void;
}

export function CoverageView({ policy, onOpenCitation, onExportPDF }: CoverageViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<CoverageField | null>(null);

  // Room Choice Calculator State
  const [roomPriceInput, setRoomPriceInput] = useState<string>('7500');

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

  // Calculator logic
  const roomField = policy.fields.find((f) => f.field === 'room_rent_cap');
  const isNoCap =
    roomField?.value.toLowerCase().includes('no cap') ||
    roomField?.value.toLowerCase().includes('any single');

  let numericCap = 5000;
  if (roomField?.value) {
    const match = roomField.value.replace(/,/g, '').match(/\d+/);
    if (match) {
      numericCap = parseInt(match[0], 10);
    }
  }

  const roomPriceNum = Number(roomPriceInput) || 0;
  const isOverCap = !isNoCap && roomPriceNum > numericCap;
  const allowedRatio = isOverCap && roomPriceNum > 0 ? numericCap / roomPriceNum : 1.0;
  const penaltyPercentage = isOverCap ? Math.round((1 - allowedRatio) * 100) : 0;
  const estimatedBill = 300000;
  const estimatedDeductionCut = isOverCap ? Math.round(estimatedBill * 0.7 * (1 - allowedRatio)) : 0;
  const totalEstimatedOutOfPocket = isOverCap ? (roomPriceNum - numericCap) * 4 + estimatedDeductionCut : 0;

  const handleShare = () => {
    const summary = `*ClaimReady Policy Coverage: ${policy.policyName}*\nInsurer: ${policy.insurerName}\nSum Insured: ${policy.sumInsured}\nRoom Rent: ${roomField?.value}\n\n100% clause cited with ClaimReady.`;
    if (navigator.share) {
      navigator.share({ title: 'Policy Coverage', text: summary }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
    }
  };

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Policy Summary Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              {policy.insurerName}
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1F2B] leading-tight">
              {policy.policyName}
            </h2>
            <div className="text-[12px] text-[#595959]">
              Sum Insured: <strong className="text-[#1958E8]">{policy.sumInsured}</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-[#EAF1FF] text-[#1958E8] hover:bg-[#D7E5FF] transition-colors"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={onExportPDF || (() => window.print())}
              className="p-2.5 rounded-full bg-[#EAF1FF] text-[#1958E8] hover:bg-[#D7E5FF] transition-colors"
              title="Download as PDF"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* 100% Clause Cited Pill */}
        <div className="flex items-center gap-2 p-2.5 bg-[#EAFBF1] rounded-xl border border-[#1FAA5C]/20 text-[12px] text-[#1FAA5C] font-semibold">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>100% Grounded — Every value backed by exact contract citations</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-[12px] px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap min-h-[36px] ${
              selectedCategory === cat.id
                ? 'bg-[#1958E8] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#595959] hover:text-[#1A1F2B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 10 Coverage Field Rows */}
      <div className="space-y-3">
        {filteredFields.map((field) => {
          const IconComp = field.iconName && ICON_MAP[field.iconName] ? ICON_MAP[field.iconName] : Bed;
          const isSelected = selectedField?.field === field.field;

          return (
            <div
              key={field.field}
              className="bg-white rounded-[20px] p-4.5 border border-[#E2E8F0] hover:border-[#1958E8]/40 transition-all space-y-3"
            >
              {/* Row Header */}
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
                          onOpenCitation(field.clause, field.page, field.quote, field.title, policy.policyName)
                        }
                      />
                    </div>
                  </div>
                </div>

                <StatusPill status={field.status} />
              </div>

              {/* Raw Value */}
              <div>
                <div className="text-[17px] font-bold text-[#1958E8] tracking-tight">
                  {field.value}
                </div>
                <p className="text-[13px] text-[#595959] mt-0.5 leading-relaxed">
                  {field.explanation}
                </p>
              </div>

              {/* Explainer Card (Blue Tint) */}
              {field.plainMeaning && (
                <ExplainerCard
                  plainMeaning={field.plainMeaning}
                  quote={field.quote}
                  clause={field.clause}
                  page={field.page}
                  onOpenCitation={() =>
                    onOpenCitation(field.clause, field.page, field.quote, field.title, policy.policyName)
                  }
                />
              )}

              {/* Related Coverages Section */}
              {field.relatedFields && field.relatedFields.length > 0 && (
                <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5 text-[12px]">
                  <span className="font-bold text-[#595959] uppercase tracking-wider text-[10px]">
                    Related Coverages:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {field.relatedFields.map((rel, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() =>
                          onOpenCitation(rel.clause, rel.page, field.quote, rel.title, policy.policyName)
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

              {/* Special Room Choice Calculator Action for room_rent_cap */}
              {field.field === 'room_rent_cap' && (
                <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#D97706] uppercase tracking-wider">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Room Choice & Proportionate Deduction Calculator</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[12px] text-[#595959] font-medium">
                      Enter daily hospital room rate (₹):
                    </label>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#595959]">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={roomPriceInput}
                        onChange={(e) => setRoomPriceInput(e.target.value)}
                        placeholder="e.g. 7500"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[16px] font-bold text-[#1A1F2B] bg-[#FAFBFC] focus:outline-none focus:border-[#1958E8]"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                      {['4000', '5000', '7500', '10000', '15000'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRoomPriceInput(preset)}
                          className={`text-[11px] px-2.5 py-1 rounded-full font-bold transition-all ${
                            roomPriceInput === preset
                              ? 'bg-[#1958E8] text-white'
                              : 'bg-[#FAFBFC] text-[#595959] border border-[#E2E8F0] hover:bg-[#EAF1FF]'
                          }`}
                        >
                          ₹{Number(preset).toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Recomputed Assumption Card or Success */}
                  {roomPriceNum > 0 && (
                    <div>
                      {isNoCap ? (
                        <div className="p-3.5 bg-[#EAFBF1] rounded-2xl border border-[#1FAA5C]/25 text-[13px] text-[#1FAA5C] font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
                          <span>No room capping — Any single private room is 100% covered.</span>
                        </div>
                      ) : isOverCap ? (
                        <AssumptionCard
                          resultText={`~₹ ${totalEstimatedOutOfPocket.toLocaleString('en-IN')} out-of-pocket penalty`}
                          basisSentence={`We have calculated ~${penaltyPercentage}% proportionate deduction on a standard ₹3L hospital bill because ₹${roomPriceNum.toLocaleString('en-IN')} exceeds the ₹${numericCap.toLocaleString('en-IN')} policy cap.`}
                          clause={field.clause}
                          page={field.page}
                          onOpenCitation={() =>
                            onOpenCitation(field.clause, field.page, field.quote, field.title, policy.policyName)
                          }
                        />
                      ) : (
                        <div className="p-3.5 bg-[#EAFBF1] rounded-2xl border border-[#1FAA5C]/25 text-[13px] text-[#1FAA5C] font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
                          <span>Within limit — ₹{roomPriceNum.toLocaleString('en-IN')}/day is within your ₹{numericCap.toLocaleString('en-IN')}/day cap.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
