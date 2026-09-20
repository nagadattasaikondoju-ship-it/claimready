'use client';

import React from 'react';
import { CoverageField } from '@/lib/types';
import { CitationSheet } from './CitationSheet';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  field?: CoverageField | null;
  clause?: string;
  page?: number;
  quote?: string;
  title?: string;
  policyName?: string;
}

export function CitationModal({
  isOpen,
  onClose,
  field,
  clause,
  page,
  quote,
  title,
  policyName = 'Policy Document',
}: CitationModalProps) {
  const activeClause = clause || field?.clause || '';
  const activePage = page || field?.page || 1;
  const activeQuote = quote || field?.quote || '';
  const activeTitle = title || field?.title || 'Policy Clause';

  return (
    <CitationSheet
      isOpen={isOpen}
      onClose={onClose}
      clause={activeClause}
      page={activePage}
      quote={activeQuote}
      title={activeTitle}
      policyName={policyName}
    />
  );
}

export default CitationModal;
