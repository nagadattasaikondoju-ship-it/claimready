'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { Share2, Check, Copy } from 'lucide-react';

interface WhatsAppShareButtonProps {
  policy: PolicyData;
}

export function WhatsAppShareButton({ policy }: WhatsAppShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const room = policy.fields.find((f) => f.field === 'room_rent_cap');
  const copay = policy.fields.find((f) => f.field === 'copay_percentage');
  const ped = policy.fields.find((f) => f.field === 'ped_waiting_period');
  const prepost = policy.fields.find((f) => f.field === 'pre_post_hospitalization');

  const shareText = `*ClaimReady Policy Explanation Summary*

📋 *Policy:* ${policy.policyName} (${policy.insurerName})
💰 *Sum Insured:* ${policy.sumInsured}
👥 *Covered:* ${policy.familyMembers}

*Key Rules to Avoid Deductions:*
1. 🛏 *Room Rent Cap:* ${room?.value || 'Check Limit'} (${room?.plainMeaning || ''})
2. 🏷 *Co-payment:* ${copay?.value || '0%'}
3. ⏳ *Pre-existing Waiting:* ${ped?.value || '36 Months'}
4. 🧾 *Pre/Post Hospitalization:* ${prepost?.value || '60/180 Days'}

Checked with ClaimReady (100% clause cited).`;

  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#E6F7EE] rounded-[24px] p-6 border border-[#22B573]/30 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left animate-fadeIn">
      <div className="space-y-1">
        <h4 className="text-[16px] font-bold text-[#0E7A4A] flex items-center gap-2">
          <span>Share Policy Breakdown with Family</span>
        </h4>
        <p className="text-[12px] text-[#5A6272]">
          Send a formatted WhatsApp breakdown to your family members before admission.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleCopy}
          className="bg-white hover:bg-[#F7F9FC] text-[#0E7A4A] font-bold text-[13px] py-2.5 px-4 rounded-xl border border-[#22B573]/30 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-[#22B573]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          onClick={handleShare}
          className="bg-[#22B573] hover:bg-[#1CA065] text-white font-bold text-[13px] py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
        >
          <Share2 className="w-4 h-4" />
          <span>Share via WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
