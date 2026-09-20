'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { IconTile } from '../IconTile';
import {
  PhoneCall,
  Share2,
  Copy,
  Check,
  Shield,
  Download,
  Phone,
  User,
  Hash,
  Hospital,
  AlertCircle,
} from 'lucide-react';

interface EmergencyCardViewProps {
  policy: PolicyData;
}

export function EmergencyCardView({ policy }: EmergencyCardViewProps) {
  const [copied, setCopied] = useState(false);

  const cardText = `🚨 *HEALTH INSURANCE EMERGENCY INFO CARD* 🚨
━━━━━━━━━━━━━━━━━━━━
📋 *Policy:* ${policy.policyName}
🏢 *Insurer:* ${policy.insurerName}
🔢 *Policy No:* ${policy.policyNumber}
💰 *Sum Insured:* ${policy.sumInsured}
👥 *Members:* ${policy.familyMembers}

📞 *INSURER TOLL-FREE:* ${policy.insurerHelpline}
🏥 *TPA Desk:* ${policy.tpaName} (${policy.tpaHelpline})
⚡ *Cashless Auth No:* ${policy.cashlessNumber}
━━━━━━━━━━━━━━━━━━━━
Saved via ClaimReady (Free independent policy tool)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Emergency Health Card', text: cardText }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(cardText)}`, '_blank');
    }
  };

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={PhoneCall} variant="green" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#1FAA5C] uppercase tracking-wider">
              Emergency Snapshot
            </span>
            <h2 className="text-[19px] font-bold text-[#1A1F2B]">
              Emergency Health Insurance Card
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-[#595959] leading-relaxed">
          High-contrast emergency card. Screenshot or share with family members for instant hospital counter lookup.
        </p>
      </div>

      {/* Emergency High-Contrast Physical Card */}
      <div className="bg-[#1A1F2B] text-white rounded-[24px] p-6 border-2 border-[#1958E8] space-y-5 shadow-sm text-left">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-4">
          <div>
            <div className="text-[11px] font-bold text-[#1FAA5C] uppercase tracking-wider">
              {policy.insurerName}
            </div>
            <h3 className="text-[20px] sm:text-[22px] font-extrabold text-white leading-tight">
              {policy.policyName}
            </h3>
          </div>

          <div className="bg-white/10 px-3 py-1 rounded-full text-right border border-white/10">
            <span className="text-[10px] text-white/70 block uppercase">Sum Insured</span>
            <span className="text-[14px] font-extrabold text-[#1FAA5C]">{policy.sumInsured}</span>
          </div>
        </div>

        {/* 1. Giant Insurer Helpline (Largest text for rapid dialing) */}
        <div className="bg-white/5 rounded-2xl p-4.5 border border-white/10 space-y-1.5 text-center sm:text-left">
          <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#1FAA5C]" />
            <span>24/7 Insurer Toll-Free Helpline</span>
          </span>

          <a
            href={`tel:${policy.insurerHelpline.replace(/\s+/g, '')}`}
            className="text-[26px] sm:text-[30px] font-extrabold font-mono text-[#1FAA5C] hover:underline block tracking-tight"
          >
            {policy.insurerHelpline}
          </a>
          <span className="text-[11px] text-white/60 block">Tap number to call directly</span>
        </div>

        {/* 2. Key Identification Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5">
            <span className="text-[10px] font-bold text-white/60 uppercase block">Policy Number</span>
            <span className="font-mono font-bold text-white text-[15px]">{policy.policyNumber}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5">
            <span className="text-[10px] font-bold text-white/60 uppercase block">Cashless Pre-Auth Ref</span>
            <span className="font-mono font-bold text-[#1FAA5C] text-[14px]">{policy.cashlessNumber}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5">
            <span className="text-[10px] font-bold text-white/60 uppercase block">TPA Claims Desk</span>
            <span className="font-bold text-white">{policy.tpaName}</span>
            <span className="text-[11px] text-white/70 block">{policy.tpaHelpline}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5">
            <span className="text-[10px] font-bold text-white/60 uppercase block">Covered Members</span>
            <span className="font-bold text-white truncate block">{policy.familyMembers}</span>
          </div>
        </div>

        {/* Card Footer Tagline */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <span>ClaimReady Grounded Card</span>
          <span>Zero Document Storage</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 py-3 bg-white hover:bg-[#FAFBFC] text-[#1958E8] font-bold text-[14px] rounded-full border border-[#E2E8F0] flex items-center justify-center gap-1.5 min-h-[48px]"
        >
          {copied ? <Check className="w-4 h-4 text-[#1FAA5C]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 bg-[#1FAA5C] hover:bg-[#168E4D] text-white font-bold text-[14px] rounded-full flex items-center justify-center gap-1.5 min-h-[48px]"
        >
          <Share2 className="w-4 h-4" />
          <span>Share to WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
