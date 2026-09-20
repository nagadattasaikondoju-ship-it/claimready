'use client';

import React, { useState, useEffect } from 'react';
import { PolicyData } from '@/lib/types';
import { IconTile } from '../IconTile';
import { CitationChip } from '../CitationChip';
import {
  Clock,
  Play,
  RotateCcw,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Info,
  MessageSquare,
} from 'lucide-react';

interface DischargeViewProps {
  policy: PolicyData;
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

const TOTAL_SECONDS = 3 * 3600; // 3 hours = 10,800 seconds

export function DischargeView({ policy, onOpenCitation }: DischargeViewProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);

  // Restore or manage countdown timer with sessionStorage persistence
  useEffect(() => {
    const storedStartTime = sessionStorage.getItem('claimready_discharge_start');
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(TOTAL_SECONDS - elapsed, 0);
      setSecondsRemaining(remaining);
      if (remaining > 0) {
        setIsRunning(true);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleStartTimer = () => {
    sessionStorage.setItem('claimready_discharge_start', Date.now().toString());
    setSecondsRemaining(TOTAL_SECONDS);
    setIsRunning(true);
  };

  const handleResetTimer = () => {
    sessionStorage.removeItem('claimready_discharge_start');
    setSecondsRemaining(TOTAL_SECONDS);
    setIsRunning(false);
  };

  // Time format
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((TOTAL_SECONDS - secondsRemaining) / TOTAL_SECONDS) * 100;

  // Escalation Draft Message
  const escalationMessage = `*URGENT: Escalation for Final Cashless Discharge Authorization*

To: ${policy.insurerName} / ${policy.tpaName}
Policy No: ${policy.policyNumber}
Cashless Auth No: ${policy.cashlessNumber}
Patient: ${policy.userName || 'Insured Patient'}

Dear Claims Team,
The hospital submitted the final discharge summary and bills over 3 hours ago. As per IRDAI Master Circular on Health Insurance Claims (Ref: IRDAI/HLT/REG/CIR/2024), the insurer/TPA is mandated to grant final cashless discharge approval within a maximum of 3 hours.

Kindly expedite immediate clearance so the patient can be discharged without undue delays.

Helpline contacted: ${policy.insurerHelpline}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(escalationMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareMessage = () => {
    if (navigator.share) {
      navigator.share({ title: 'Discharge Escalation', text: escalationMessage }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(escalationMessage)}`, '_blank');
    }
  };

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={Clock} variant="blue" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              Discharge Tracker
            </span>
            <h2 className="text-[20px] font-bold text-[#1A1F2B]">
              IRDAI 3-Hour Discharge Timer
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-[#595959] leading-relaxed">
          IRDAI mandates that insurers/TPAs must approve cashless discharge within 3 hours of receiving the final hospital bill.
        </p>
      </div>

      {/* Circular Timer Ring Display */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E2E8F0] text-center space-y-5">
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          {/* SVG Countdown Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke={secondsRemaining === 0 ? '#C0392B' : '#1958E8'}
              strokeWidth="6"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-mono font-extrabold text-[#1A1F2B]">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold text-[#595959] uppercase tracking-wider mt-0.5">
              {secondsRemaining === 0
                ? 'Time Exceeded'
                : isRunning
                ? 'Remaining Time'
                : '3h Timer Ready'}
            </span>
          </div>
        </div>

        {/* Timer Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          {!isRunning && secondsRemaining === TOTAL_SECONDS ? (
            <button
              type="button"
              onClick={handleStartTimer}
              className="py-3 px-6 bg-[#1958E8] hover:bg-[#1447C0] text-white font-bold text-[14px] rounded-full flex items-center gap-2 transition-all min-h-[48px]"
            >
              <Play className="w-4 h-4 fill-current stroke-[2]" />
              <span>Start Discharge Timer</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetTimer}
                className="py-2.5 px-4 bg-[#FAFBFC] hover:bg-[#EAF1FF] text-[#1A1F2B] font-bold text-[13px] rounded-full border border-[#E2E8F0] flex items-center gap-1.5 min-h-[48px]"
              >
                <RotateCcw className="w-4 h-4 text-[#595959]" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDraftModal(true)}
                className="py-2.5 px-5 bg-[#1958E8] hover:bg-[#1447C0] text-white font-bold text-[13px] rounded-full flex items-center gap-1.5 min-h-[48px]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Generate Escalation Message</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Card citing IRDAI rule */}
      <div className="p-4 bg-[#EAFBF1] rounded-[20px] border border-[#1FAA5C]/25 space-y-2 text-[13px]">
        <div className="flex items-center gap-2 font-bold text-[#1FAA5C]">
          <ShieldCheck className="w-4 h-4" />
          <span>IRDAI Mandatory 3-Hour Discharge Directive</span>
        </div>
        <p className="text-[#1A1F2B] leading-relaxed">
          Under IRDAI circular guidelines, insurers and TPAs cannot keep patients waiting beyond 3 hours once final bills are uploaded by the hospital.
        </p>
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[11px] text-[#595959]">Ref: IRDAI/HLT/REG/CIR/2024</span>
          <CitationChip
            clause="7.2"
            page={27}
            onClick={() =>
              onOpenCitation('7.2', 27, 'Intimation must be given within 24 hours of admission and final claim settlement processed within IRDAI guidelines.', 'Claim Settlement Deadlines', policy.policyName)
            }
          />
        </div>
      </div>

      {/* Escalation Draft Modal / Card */}
      {showDraftModal && (
        <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <h4 className="text-[15px] font-bold text-[#1A1F2B]">
              Drafted Escalation Message
            </h4>
            <span className="text-[11px] font-semibold text-[#1958E8] bg-[#EAF1FF] px-2 py-0.5 rounded-full">
              Ready to Send
            </span>
          </div>

          <div className="bg-[#FAFBFC] p-3.5 rounded-xl border border-[#E2E8F0] text-[12px] font-mono text-[#1A1F2B] whitespace-pre-line leading-relaxed">
            {escalationMessage}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="flex-1 py-2.5 bg-white hover:bg-[#FAFBFC] text-[#1958E8] font-bold text-[13px] rounded-full border border-[#1958E8]/30 flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-[#1FAA5C]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Message'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareMessage}
              className="flex-1 py-2.5 bg-[#1FAA5C] hover:bg-[#168E4D] text-white font-bold text-[13px] rounded-full flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
