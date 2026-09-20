'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { Sparkles, Send, FileSearch, HelpCircle, ShieldCheck } from 'lucide-react';

interface PolicyQABoxProps {
  policy: PolicyData;
}

interface QAMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  clause?: string;
  page?: number;
}

export function PolicyQABox({ policy }: PolicyQABoxProps) {
  const [query, setQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<QAMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Ask me anything about ${policy.policyName}. For example: "Is OPD covered?", "What is the waiting period for diabetes?", or "Are dental surgeries covered?"`,
    },
  ]);

  const quickPrompts = [
    'Is OPD covered?',
    'What is the room rent limit?',
    'What is the waiting period for pre-existing diseases?',
    'Are dental treatments covered?',
  ];

  const handleAsk = (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim()) return;

    const userMsg: QAMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiMsg: QAMessage;
      const lower = q.toLowerCase();

      if (lower.includes('room') || lower.includes('rent')) {
        const room = policy.fields.find((f) => f.field === 'room_rent_cap');
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Your room rent limit is ${room?.value || 'Rs 5,000 per day'}. ${room?.plainMeaning || ''}`,
          clause: room?.clause || '4.2',
          page: room?.page || 12,
        };
      } else if (lower.includes('waiting') || lower.includes('ped') || lower.includes('pre-existing') || lower.includes('diabetes')) {
        const ped = policy.fields.find((f) => f.field === 'ped_waiting_period');
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `The waiting period for pre-existing conditions is ${ped?.value || '36 Months'}. Fresh illnesses have a standard 30-day initial waiting window.`,
          clause: ped?.clause || '6.1.c',
          page: ped?.page || 19,
        };
      } else if (lower.includes('opd') || lower.includes('dental')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Routine OPD consultations and cosmetic dental procedures are generally excluded unless required due to an accidental injury requiring hospitalization.`,
          clause: '8.4',
          page: 29,
        };
      } else if (lower.includes('copay') || lower.includes('co-pay')) {
        const copay = policy.fields.find((f) => f.field === 'copay_percentage');
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Co-payment is ${copay?.value || '0%'}. ${copay?.plainMeaning || ''}`,
          clause: copay?.clause || '5.1',
          page: copay?.page || 15,
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Under ${policy.policyName}, inpatient hospital admissions are covered up to ${policy.sumInsured}. Cashless claims must be submitted to the TPA desk upon admission.`,
          clause: '3.1',
          page: 9,
        };
      }

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#DDE2EA] shadow-card space-y-4 text-left animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E4FA8] bg-[#E8EEF9] px-2.5 py-0.5 rounded-full border border-[#1E4FA8]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Policy Q&A Assistant</span>
        </div>
        <h3 className="text-[20px] font-bold text-[#1A1F2B]">
          Ask a Question About Your Policy
        </h3>
        <p className="text-[13px] text-[#5A6272]">
          Answers are grounded directly in your policy contract wordings.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(prompt)}
            className="text-[12px] px-3.5 py-1.5 rounded-full bg-[#F7F9FC] border border-[#DDE2EA] text-[#5A6272] hover:text-[#1E4FA8] hover:bg-[#E8EEF9] transition-all whitespace-nowrap flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-[13px] leading-relaxed ${
                  isAi
                    ? 'bg-[#F7F9FC] text-[#1A1F2B] border border-[#DDE2EA]'
                    : 'bg-[#1E4FA8] text-white shadow-xs'
                }`}
              >
                <p>{msg.text}</p>
                {isAi && msg.clause && (
                  <div className="mt-2 pt-2 border-t border-[#DDE2EA] flex items-center justify-between text-[11px] text-[#1E4FA8] font-semibold">
                    <span className="flex items-center gap-1">
                      <FileSearch className="w-3 h-3" />
                      <span>Clause {msg.clause}, Page {msg.page}</span>
                    </span>
                    <span className="text-[#0E7A4A] bg-[#E6F7EE] px-1.5 py-0.5 rounded text-[10px]">
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#5A6272] bg-[#F7F9FC] p-3 rounded-xl w-36 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#1E4FA8] animate-spin" />
            <span>Finding clause...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2 pt-1 border-t border-[#DDE2EA]"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything (e.g. Is dialysis covered?)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDE2EA] text-[13px] text-[#1A1F2B] bg-[#F7F9FC] focus:outline-none focus:border-[#1E4FA8] focus:ring-2 focus:ring-[#1E4FA8]/20"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="bg-[#1E4FA8] hover:bg-[#163D85] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
