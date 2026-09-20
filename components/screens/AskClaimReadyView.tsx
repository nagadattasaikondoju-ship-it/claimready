'use client';

import React, { useState } from 'react';
import { PolicyData, ChatMessage } from '@/lib/types';
import { IconTile } from '../IconTile';
import { CitationChip } from '../CitationChip';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface AskClaimReadyViewProps {
  policy: PolicyData;
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function AskClaimReadyView({ policy, onOpenCitation }: AskClaimReadyViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'claimready',
      text: `Hello! I can answer specific questions about your ${policy.policyName} policy (${policy.insurerName}). Every answer is grounded directly in your uploaded policy clauses.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    'What is my room rent limit?',
    'What is the waiting period for pre-existing diseases?',
    'Is ICU stay covered in full?',
    'Are post-discharge medicines reimbursable?',
    'Is OPD consultation covered?',
  ];

  const handleSendMessage = (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();

      let botReply = '';
      let citations: ChatMessage['citations'] = [];

      if (qLower.includes('room') || qLower.includes('rent')) {
        const field = policy.fields.find((f) => f.field === 'room_rent_cap');
        if (field) {
          botReply = `Your room rent entitlement is: ${field.value}. ${field.plainMeaning}`;
          citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
        }
      } else if (qLower.includes('icu') || qLower.includes('cardiac')) {
        const field = policy.fields.find((f) => f.field === 'icu_cap');
        if (field) {
          botReply = `Your ICU coverage: ${field.value}. ${field.plainMeaning}`;
          citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
        }
      } else if (qLower.includes('waiting') || qLower.includes('ped') || qLower.includes('pre-existing') || qLower.includes('diabetes')) {
        const field = policy.fields.find((f) => f.field === 'ped_waiting_period');
        if (field) {
          botReply = `Pre-existing disease waiting period is ${field.value}. ${field.plainMeaning}`;
          citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
        }
      } else if (qLower.includes('medicine') || qLower.includes('post') || qLower.includes('pre') || qLower.includes('pharmacy') || qLower.includes('bill')) {
        const field = policy.fields.find((f) => f.field === 'pre_post_hospitalization');
        if (field) {
          botReply = `Pre and post hospitalisation expenses are covered for ${field.value}. ${field.plainMeaning}`;
          citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
        }
      } else if (qLower.includes('copay') || qLower.includes('co-pay')) {
        const field = policy.fields.find((f) => f.field === 'copay_percentage');
        if (field) {
          botReply = `Co-payment requirement is ${field.value}. ${field.plainMeaning}`;
          citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
        }
      } else if (qLower.includes('opd') || qLower.includes('dental') || qLower.includes('cosmetic')) {
        botReply = `This isn't something I can find in your policy document. Out-patient consultations (OPD) and cosmetic procedures are standard general exclusions unless a specialized OPD rider is attached. You may need to ask your insurer directly at ${policy.insurerHelpline}.`;
      } else {
        botReply = `This isn't something I can find in your policy — you may need to ask your insurer directly. ClaimReady only provides answers backed by explicit clauses in your uploaded contract.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'claimready',
        text: botReply,
        citations,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-4 text-left max-w-lg mx-auto py-2 animate-fadeIn flex flex-col h-[calc(100vh-140px)]">
      {/* Header Info */}
      <div className="bg-white rounded-[20px] p-4 border border-[#E2E8F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconTile icon={MessageSquare} variant="blue" size="sm" />
          <div>
            <h2 className="text-[15px] font-bold text-[#1A1F2B]">
              Ask ClaimReady
            </h2>
            <div className="text-[11px] text-[#595959]">
              Grounded strictly in {policy.policyName}
            </div>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#1FAA5C] bg-[#EAFBF1] px-2.5 py-0.5 rounded-full border border-[#1FAA5C]/20">
          Grounded Mode
        </span>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed ${
                  isUser
                    ? 'bg-[#1958E8] text-white rounded-br-xs'
                    : 'bg-white text-[#1A1F2B] border border-[#E2E8F0] rounded-bl-xs'
                }`}
              >
                <p>{m.text}</p>

                {/* Citations pill */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex flex-wrap gap-1.5">
                    {m.citations.map((c, cIdx) => (
                      <CitationChip
                        key={cIdx}
                        clause={c.clause}
                        page={c.page}
                        onClick={() =>
                          onOpenCitation(c.clause, c.page, c.quote || '', c.title, policy.policyName)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#E2E8F0] w-28">
            <span className="text-[12px] text-[#595959] italic">Reading policy...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-[#595959] uppercase tracking-wider block px-1">
          Suggested Questions:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(sq)}
              className="text-[12px] px-3 py-1.5 rounded-full font-medium bg-white text-[#1958E8] border border-[#1958E8]/20 hover:bg-[#EAF1FF] whitespace-nowrap transition-colors flex-shrink-0"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Caption & Input Bar */}
      <div className="space-y-1 pt-1">
        <div className="text-[11px] text-[#595959] text-center font-medium">
          Answers are based only on your policy document.
        </div>

        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 border border-[#E2E8F0] shadow-xs">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputQuery);
            }}
            placeholder="Ask about your policy..."
            className="flex-1 pl-4 pr-2 py-2 text-[14px] text-[#1A1F2B] bg-transparent focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleSendMessage(inputQuery)}
            disabled={!inputQuery.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inputQuery.trim()
                ? 'bg-[#1958E8] text-white hover:bg-[#1447C0]'
                : 'bg-[#E2E8F0] text-[#595959] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
