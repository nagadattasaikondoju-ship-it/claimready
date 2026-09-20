'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { Bed, AlertTriangle, CheckCircle2, ShieldAlert, Calculator, Sparkles } from 'lucide-react';

interface RoomCalculatorWidgetProps {
  policy: PolicyData;
}

export function RoomCalculatorWidget({ policy }: RoomCalculatorWidgetProps) {
  const [roomPriceInput, setRoomPriceInput] = useState<string>('7500');

  const roomField = policy.fields.find((f) => f.field === 'room_rent_cap');
  const isNoCap =
    roomField?.value.toLowerCase().includes('no cap') ||
    roomField?.value.toLowerCase().includes('any single');

  // Parse numeric cap
  let numericCap = 5000;
  if (roomField?.value) {
    const match = roomField.value.replace(/,/g, '').match(/\d+/);
    if (match) {
      numericCap = parseInt(match[0], 10);
    }
  }

  const roomPriceNum = Number(roomPriceInput) || 0;
  const isOverCap = !isNoCap && roomPriceNum > numericCap;
  const excessPerDay = isOverCap ? roomPriceNum - numericCap : 0;

  // Proportionate deduction ratio
  const allowedRatio = isOverCap && roomPriceNum > 0 ? numericCap / roomPriceNum : 1.0;
  const penaltyPercentage = isOverCap ? Math.round((1 - allowedRatio) * 100) : 0;

  // Estimated proportionate deduction on a typical ₹3L bill (4-day stay)
  const estimatedBill = 300000;
  const associatedCharges = estimatedBill * 0.7; // Doctor, surgeon, OT fees
  const estimatedDeductionCut = isOverCap ? Math.round(associatedCharges * (1 - allowedRatio)) : 0;
  const totalOutOfPocket = excessPerDay * 4 + estimatedDeductionCut;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#DDE2EA] shadow-card space-y-5 text-left animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#B7791F] bg-[#FEF6E7] px-2.5 py-0.5 rounded-full border border-[#B7791F]/20">
          <Calculator className="w-3.5 h-3.5" />
          <span>Room Choice & Proportionate Deduction Calculator</span>
        </div>

        <h3 className="text-[20px] font-bold text-[#1A1F2B]">
          Check Your Hospital Room Choice
        </h3>

        <p className="text-[13px] text-[#5A6272]">
          Enter your hospital room rate per day to see if it will trigger proportionate claim deductions.
        </p>
      </div>

      {/* Policy Limit Banner */}
      <div className="p-3.5 bg-[#E8EEF9]/70 rounded-xl border border-[#1E4FA8]/20 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#5A6272] block">Your Policy Limit</span>
          <span className="text-[14px] font-bold text-[#1E4FA8]">
            {isNoCap ? 'No Room Rent Cap (Any Single Private Room)' : `₹ ${numericCap.toLocaleString('en-IN')} per day`}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#1E4FA8] bg-white px-2.5 py-1 rounded-full border border-[#1E4FA8]/20 shadow-xs">
          Clause {roomField?.clause || '4.2'}, p. {roomField?.page || 12}
        </span>
      </div>

      {/* Input Field & Presets */}
      <div className="space-y-2">
        <label className="block text-[12px] font-bold text-[#5A6272] uppercase tracking-wider">
          Expected Room Price per Day (₹)
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#5A6272]">
            ₹
          </span>
          <input
            type="number"
            value={roomPriceInput}
            onChange={(e) => setRoomPriceInput(e.target.value)}
            placeholder="e.g. 7500"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#DDE2EA] text-[18px] font-bold text-[#1A1F2B] bg-[#F7F9FC] focus:outline-none focus:border-[#1E4FA8] focus:ring-2 focus:ring-[#1E4FA8]/20"
          />
        </div>

        {/* Presets */}
        <div className="flex gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {['4000', '5000', '7500', '10000', '15000'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setRoomPriceInput(preset)}
              className={`text-[12px] px-3 py-1 rounded-full font-bold transition-all ${
                roomPriceInput === preset
                  ? 'bg-[#1E4FA8] text-white shadow-xs'
                  : 'bg-[#F7F9FC] text-[#5A6272] border border-[#DDE2EA] hover:bg-[#E8EEF9]'
              }`}
            >
              ₹{Number(preset).toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      </div>

      {/* Calculation Outcome */}
      {roomPriceNum > 0 && (
        <div>
          {isNoCap ? (
            <div className="bg-[#E6F7EE] rounded-2xl p-4.5 border border-[#22B573]/30 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0E7A4A] font-bold text-[14px]">
                <CheckCircle2 className="w-5 h-5 text-[#22B573]" />
                <span>Fully Covered — No Room Rent Cap</span>
              </div>
              <p className="text-[12px] text-[#1A1F2B] leading-relaxed">
                Your policy allows any standard single private room without capping. No proportionate cuts will be applied to your hospital bills.
              </p>
            </div>
          ) : isOverCap ? (
            <div className="bg-[#FEF6E7] rounded-2xl p-5 border border-[#B7791F]/30 space-y-3.5 animate-fadeIn">
              {/* Alert Header */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B7791F]/15 flex items-center justify-center text-[#B7791F] flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#B7791F]">
                    Room is above your policy limit
                  </h4>
                  <div className="text-[13px] font-extrabold text-[#C0392B] mt-0.5">
                    Extra room charge: ₹ {excessPerDay.toLocaleString('en-IN')} / day
                  </div>
                </div>
              </div>

              {/* Proportionate Deduction Trap Callout */}
              <div className="bg-white/90 rounded-xl p-3.5 border border-[#B7791F]/25 space-y-2 text-[12px]">
                <div className="flex items-center gap-1.5 font-bold text-[#C0392B] uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-[#C0392B]" />
                  <span>The Proportionate Deduction Penalty</span>
                </div>
                <p className="text-[#1A1F2B] leading-relaxed">
                  Because the chosen room (₹{roomPriceNum.toLocaleString('en-IN')}) exceeds the policy cap (₹{numericCap.toLocaleString('en-IN')}), the insurer will deduct <strong className="text-[#C0392B]">~{penaltyPercentage}%</strong> across your doctor visit charges, surgeon fees, and operation theater costs.
                </p>

                <div className="pt-2 border-t border-[#DDE2EA] flex items-center justify-between font-medium">
                  <span className="text-[#5A6272]">Estimated out-of-pocket on 4-day stay:</span>
                  <span className="font-extrabold text-[#C0392B] text-[13px]">
                    ₹ {totalOutOfPocket.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#E6F7EE] rounded-2xl p-4.5 border border-[#22B573]/30 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0E7A4A] font-bold text-[14px]">
                <CheckCircle2 className="w-5 h-5 text-[#22B573]" />
                <span>Within Your Policy Limit</span>
              </div>
              <p className="text-[12px] text-[#1A1F2B] leading-relaxed">
                ₹{roomPriceNum.toLocaleString('en-IN')}/day is fully within your ₹{numericCap.toLocaleString('en-IN')}/day policy limit. No proportionate deductions will be levied.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
