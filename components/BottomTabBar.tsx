'use client';

import React from 'react';
import { MainTab } from '@/lib/types';
import { Home, Shield, CheckSquare, MoreHorizontal } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  hasPolicy: boolean;
}

export function BottomTabBar({ activeTab, onTabChange, hasPolicy }: BottomTabBarProps) {
  const tabs: Array<{ id: MainTab; label: string; icon: React.ElementType }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'coverage', label: 'Coverage', icon: Shield },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] safe-bottom"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all min-h-[48px] ${
                isActive
                  ? 'text-[#1958E8] font-bold'
                  : 'text-[#595959] hover:text-[#1A1F2B] font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${
                  isActive ? 'bg-[#EAF1FF]' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span className="text-[11px] leading-tight mt-0.5">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
