'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { IconTile } from '../IconTile';
import { AssumptionCard } from '../AssumptionCard';
import { CitationChip } from '../CitationChip';
import {
  Hospital,
  Bed,
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Calculator,
} from 'lucide-react';

interface AdmissionViewProps {
  policy: PolicyData;
  onNavigateToChecklist: () => void;
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function AdmissionView({ policy, onNavigateToChecklist, onOpenCitation }: AdmissionViewProps) {
  const [roomPriceInput, setRoomPriceInput] = useState<string>('7500');

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

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#FFF6E9] rounded-[20px] p-5 border border-[#D97706]/25 space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={Hospital} variant="amber" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
              Admission Guide
            </span>
            <h2 className="text-[19px] font-bold text-[#1A1F2B]">
              At the Hospital Desk Now
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-[#595959] leading-relaxed">
          Critical steps to prevent deductions before signing your admission form.
        </p>
      </div>

      {/* 1. Room Choice & Proportionate Deduction Calculator */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A1F2B]">
            <Bed className="w-4 h-4 text-[#1958E8]" />
            <span>Check Your Room Category</span>
          </div>

          <span className="text-[11px] font-bold text-[#1958E8] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full border border-[#1958E8]/20">
            {isNoCap ? 'No Room Cap' : `Cap: ₹${numericCap.toLocaleString('en-IN')}/day`}
          </span>
        </div>

        <div className="space-y-2">
          <label className="block text-[12px] text-[#595959]">
            Offered Room Rate per Day (₹):
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#595959]">
              ₹
            </span>
            <input
              type="number"
              value={roomPriceInput}
              onChange={(e) => setRoomPriceInput(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[16px] font-bold text-[#1A1F2B] bg-[#FAFBFC] focus:outline-none focus:border-[#1958E8]"
            />
          </div>

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

        {/* Calculation Result */}
        {roomPriceNum > 0 && (
          <div>
            {isNoCap ? (
              <div className="p-3.5 bg-[#EAFBF1] rounded-2xl border border-[#1FAA5C]/25 text-[13px] text-[#1FAA5C] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>No room cap — Any single private room is fully payable.</span>
              </div>
            ) : isOverCap ? (
              <AssumptionCard
                resultText={`~₹ ${totalEstimatedOutOfPocket.toLocaleString('en-IN')} penalty on total bill`}
                basisSentence={`We have calculated ~${penaltyPercentage}% proportionate deduction on doctor and surgery charges because ₹${roomPriceNum.toLocaleString('en-IN')}/day exceeds the ₹${numericCap.toLocaleString('en-IN')} room cap.`}
                clause={roomField?.clause || '4.2'}
                page={roomField?.page || 12}
                onOpenCitation={() =>
                  onOpenCitation(
                    roomField?.clause || '4.2',
                    roomField?.page || 12,
                    roomField?.quote || '',
                    'Room Rent Limit',
                    policy.policyName
                  )
                }
              />
            ) : (
              <div className="p-3.5 bg-[#EAFBF1] rounded-2xl border border-[#1FAA5C]/25 text-[13px] text-[#1FAA5C] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Within cap limit. No proportionate deductions will be levied.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Immediate Admission Checklist & Intimation */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3.5">
        <h3 className="text-[15px] font-bold text-[#1A1F2B]">
          3 Mandatory Hospital Entry Rules
        </h3>

        <div className="space-y-2.5 text-[13px]">
          <div className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-1">
            <div className="font-bold text-[#1A1F2B] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1958E8]" />
              <span>1. Inform TPA within 24 Hours</span>
            </div>
            <p className="text-[#595959]">
              Emergency admissions must be intimated within 24 hours to initiate pre-authorization.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-1">
            <div className="font-bold text-[#1A1F2B] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1958E8]" />
              <span>2. Handover Health Card & Policy Number</span>
            </div>
            <p className="text-[#595959]">
              Give your e-card or Policy No: <strong className="text-[#1A1F2B]">{policy.policyNumber}</strong> at the TPA desk.
            </p>
          </div>

          <div className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-1">
            <div className="font-bold text-[#1A1F2B] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#1958E8]" />
              <span>3. Insurer Toll-Free Helpline</span>
            </div>
            <p className="text-[#595959]">
              Call <strong className="text-[#1958E8]">{policy.insurerHelpline}</strong> in case of any cashless desk delays.
            </p>
          </div>
        </div>
      </div>

      {/* Shortcut to Discharge Checklist */}
      <div
        onClick={onNavigateToChecklist}
        role="button"
        tabIndex={0}
        className="bg-[#EAF1FF] rounded-[20px] p-4.5 border border-[#1958E8]/20 hover:border-[#1958E8] cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <IconTile icon={CheckSquare} variant="blue" size="md" />
          <div>
            <div className="text-[14px] font-bold text-[#1958E8]">
              Open Pre-Discharge Checklist
            </div>
            <p className="text-[12px] text-[#595959]">
              Track the 6 mandatory documents needed before discharge.
            </p>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-[#1958E8] group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </div>
    </div>
  );
}
