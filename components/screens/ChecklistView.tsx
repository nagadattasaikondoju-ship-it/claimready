'use client';

import React, { useState } from 'react';
import { ChecklistItem } from '@/lib/types';
import { Check, CheckCircle2, Download, Share2, FileCheck, ShieldCheck } from 'lucide-react';
import { IconTile } from '../IconTile';

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'bills',
    title: 'Hospitalisation Bills (Itemised & Final)',
    description: 'Required by TPA to verify daily room rent, doctor visits, and surgery itemisation.',
    checked: false,
  },
  {
    id: 'discharge',
    title: 'Discharge Summary',
    description: 'Contains admission/discharge times, diagnosis, and surgical notes signed by doctor.',
    checked: false,
  },
  {
    id: 'prescriptions',
    title: 'Doctor Prescriptions & Medicine Bills',
    description: 'Needed to claim pre & post hospitalisation pharmacy expenses (up to 180 days).',
    checked: false,
  },
  {
    id: 'investigations',
    title: 'Diagnostic Scan & Lab Investigation Reports',
    description: 'Proves clinical necessity for tests, CT/MRI scans, and blood work.',
    checked: false,
  },
  {
    id: 'kyc',
    title: 'Patient Identity & KYC Proof (Aadhaar / PAN)',
    description: 'Mandatory for IRDAI cashless authorization and reimbursement transfers.',
    checked: false,
  },
  {
    id: 'form',
    title: 'Signed Claim Settlement Form (Part A & B)',
    description: 'Official declaration form signed by policyholder and hospital billing desk.',
    checked: false,
  },
];

interface ChecklistViewProps {
  onExportPDF?: () => void;
}

export function ChecklistView({ onExportPDF }: ChecklistViewProps) {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [completedConfirmed, setCompletedConfirmed] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
    setCompletedConfirmed(false);
  };

  const allChecked = items.every((i) => i.checked);
  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  const handleShare = () => {
    const text = `*ClaimReady Pre-Discharge Document Checklist (${checkedCount}/${items.length} Ready)*\n\n` +
      items.map((i) => `${i.checked ? '✅' : '⬜'} ${i.title}`).join('\n') +
      `\n\nKeep all original papers safe for TPA claim reimbursement.`;

    if (navigator.share) {
      navigator.share({ title: 'Hospital Checklist', text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              Hospital Discharge Checklist
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1F2B]">
              Documents for Claim
            </h2>
            <p className="text-[13px] text-[#595959]">
              Never leave the hospital counter without these 6 essential originals.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-[#EAF1FF] text-[#1958E8] hover:bg-[#D7E5FF] transition-colors"
              title="Share Checklist"
            >
              <Share2 className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={onExportPDF || (() => window.print())}
              className="p-2.5 rounded-full bg-[#EAF1FF] text-[#1958E8] hover:bg-[#D7E5FF] transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-[#595959]">{checkedCount} of {items.length} Collected</span>
            <span className="text-[#1958E8]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1FAA5C] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Checklist Items */}
      <div className="space-y-2.5">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              role="checkbox"
              aria-checked={item.checked}
              className={`p-4 rounded-[20px] border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                item.checked
                  ? 'bg-[#EAFBF1]/60 border-[#1FAA5C]/30'
                  : 'bg-white border-[#E2E8F0] hover:border-[#1958E8]/30'
              }`}
            >
              {/* Checkbox box */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  item.checked
                    ? 'bg-[#1FAA5C] text-white'
                    : 'border-2 border-[#E2E8F0] bg-white'
                }`}
              >
                {item.checked && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <div
                  className={`text-[14px] font-bold leading-snug ${
                    item.checked ? 'text-[#1A1F2B]' : 'text-[#1A1F2B]'
                  }`}
                >
                  {item.title}
                </div>
                <div className="text-[12px] text-[#595959] leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-width "I have all these documents" Action Button */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={!allChecked}
          onClick={() => setCompletedConfirmed(true)}
          className={`w-full py-3.5 px-6 text-[15px] font-bold rounded-full transition-all flex items-center justify-center gap-2 min-h-[48px] ${
            allChecked
              ? 'bg-[#1FAA5C] hover:bg-[#1A9651] text-white shadow-xs cursor-pointer'
              : 'bg-[#E2E8F0] text-[#595959] cursor-not-allowed opacity-75'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          <span>I have all these documents</span>
        </button>

        {completedConfirmed && (
          <div className="p-3.5 bg-[#EAFBF1] rounded-2xl border border-[#1FAA5C]/25 text-[13px] text-[#1FAA5C] font-semibold text-center animate-fadeIn">
            🎉 All 6 claim documents verified! Keep the original hospital receipts safely stored for TPA submission.
          </div>
        )}

        <p className="text-[11px] text-[#595959] text-center">
          Session-only checklist state (not stored permanently to protect your privacy).
        </p>
      </div>
    </div>
  );
}
