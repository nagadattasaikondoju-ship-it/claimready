'use client';

import React, { createContext, useContext, useState } from 'react';
import { PolicyData, Language, CoverageField } from '../types';
import { SAMPLE_POLICIES } from '../extract/mock-samples';

interface PolicyContextType {
  activePolicy: PolicyData | null;
  setActivePolicy: (policy: PolicyData | null) => void;
  policies: PolicyData[];
  setPolicies: (policies: PolicyData[]) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedField: CoverageField | null;
  setSelectedField: (field: CoverageField | null) => void;
  activeCitation: any;
  setActiveCitation: (citation: any) => void;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: React.ReactNode }) {
  const [activePolicy, setActivePolicy] = useState<PolicyData | null>(SAMPLE_POLICIES[0]);
  const [policies, setPolicies] = useState<PolicyData[]>(SAMPLE_POLICIES);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedField, setSelectedField] = useState<CoverageField | null>(null);
  const [activeCitation, setActiveCitation] = useState<any>(null);

  return (
    <PolicyContext.Provider
      value={{
        activePolicy,
        setActivePolicy,
        policies,
        setPolicies,
        language,
        setLanguage,
        selectedField,
        setSelectedField,
        activeCitation,
        setActiveCitation,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicyContext() {
  const context = useContext(PolicyContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      activePolicy: SAMPLE_POLICIES[0],
      setActivePolicy: () => {},
      policies: SAMPLE_POLICIES,
      setPolicies: () => {},
      language: 'en' as Language,
      setLanguage: () => {},
      selectedField: null,
      setSelectedField: () => {},
      activeCitation: null,
      setActiveCitation: () => {},
    };
  }
  return context;
}

export const usePolicy = usePolicyContext;
