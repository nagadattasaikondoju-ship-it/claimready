'use client';

import React, { useState } from 'react';
import {
  ActiveScreen,
  MainTab,
  PushedScreen,
  PolicyData,
  Language,
} from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';
import { TopAppBar } from '@/components/TopAppBar';
import { BottomTabBar } from '@/components/BottomTabBar';
import { CitationSheet } from '@/components/CitationSheet';
import { DigiLockerModal } from '@/components/DigiLockerModal';

// Screen Views
import { OnboardingView } from '@/components/screens/OnboardingView';
import { UploadView } from '@/components/screens/UploadView';
import { ProcessingView } from '@/components/screens/ProcessingView';
import { HomeView } from '@/components/screens/HomeView';
import { CoverageView } from '@/components/screens/CoverageView';
import { ChecklistView } from '@/components/screens/ChecklistView';
import { AdmissionView } from '@/components/screens/AdmissionView';
import { DischargeView } from '@/components/screens/DischargeView';
import { AppealView } from '@/components/screens/AppealView';
import { AskClaimReadyView } from '@/components/screens/AskClaimReadyView';
import { CoverageNeedsCalcView } from '@/components/screens/CoverageNeedsCalcView';
import { ComparePoliciesView } from '@/components/screens/ComparePoliciesView';
import { EmergencyCardView } from '@/components/screens/EmergencyCardView';
import { SettingsView } from '@/components/screens/SettingsView';
import { MoreHubView } from '@/components/screens/MoreHubView';

export default function Page() {
  const [language, setLanguage] = useState<Language>('en');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPresetPolicy, setSelectedPresetPolicy] = useState<PolicyData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingFileName, setProcessingFileName] = useState<string>('Policy_Schedule.pdf');
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [previousScreen, setPreviousScreen] = useState<ActiveScreen>('home');

  // Citation modal state
  const [citationState, setCitationState] = useState<{
    isOpen: boolean;
    clause: string;
    page: number;
    quote: string;
    title: string;
    policyName: string;
  }>({
    isOpen: false,
    clause: '',
    page: 1,
    quote: '',
    title: '',
    policyName: '',
  });

  // Navigation handlers
  const navigateTo = (screen: ActiveScreen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    // If on a sub-screen under More, return to More. Otherwise return to Home or previous screen
    if (['ask', 'needs-calc', 'compare', 'settings'].includes(currentScreen)) {
      setCurrentScreen('more');
    } else if (['admission', 'discharge', 'appeal', 'emergency-card'].includes(currentScreen)) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen(previousScreen || 'home');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Upload & selection handlers
  const handleSelectPresetPolicy = (policy: PolicyData) => {
    setSelectedPresetPolicy(policy);
    setUploadedFile(null);
    setProcessingFileName(`${policy.policyName}.pdf`);
    setIsProcessing(true);
  };

  const handleCustomUpload = (file: File) => {
    setUploadedFile(file);
    setSelectedPresetPolicy(null);
    setProcessingFileName(file.name);
    setIsProcessing(true);
  };

  const handleDigiLockerImport = (docName: string, policy: PolicyData) => {
    setSelectedPresetPolicy(policy);
    setUploadedFile(null);
    setProcessingFileName(docName);
    setIsProcessing(true);
  };

  const handleProcessingComplete = (policy: PolicyData) => {
    setActivePolicy(policy);
    setIsProcessing(false);
    setCurrentScreen('home');
  };

  const handleResetPolicy = () => {
    setActivePolicy(null);
    setIsProcessing(false);
    setCurrentScreen('home');
  };

  const handleOpenCitation = (
    clause: string,
    page: number,
    quote: string,
    title: string,
    policyName: string
  ) => {
    setCitationState({
      isOpen: true,
      clause,
      page,
      quote,
      title,
      policyName,
    });
  };

  // Title for pushed screens
  const getScreenTitle = (screen: ActiveScreen): string => {
    switch (screen) {
      case 'admission':
        return 'Hospital Admission';
      case 'discharge':
        return 'Discharge Timer';
      case 'appeal':
        return 'Appeal Dispute';
      case 'ask':
        return 'Ask ClaimReady';
      case 'needs-calc':
        return 'Coverage Needs Calculator';
      case 'compare':
        return 'Compare My Policies';
      case 'emergency-card':
        return 'Emergency Info Card';
      case 'settings':
        return 'Settings & Privacy';
      case 'coverage':
        return 'Policy Coverage';
      case 'checklist':
        return 'Documents for Claim';
      case 'more':
        return 'More Features';
      case 'home':
      default:
        return 'ClaimReady';
    }
  };

  const isMainTab = ['home', 'coverage', 'checklist', 'more'].includes(currentScreen);
  const isPushedScreen = !isMainTab;

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#1A1F2B] flex flex-col font-sans selection:bg-[#1958E8] selection:text-white">
      {/* Sticky Top App Bar */}
      <TopAppBar
        currentScreen={currentScreen}
        title={getScreenTitle(currentScreen)}
        language={language}
        onLanguageChange={setLanguage}
        onBack={handleBack}
        showBack={isPushedScreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-4 pb-24 sm:px-5">
        {showOnboarding ? (
          <OnboardingView onGetStarted={() => setShowOnboarding(false)} />
        ) : isProcessing ? (
          <ProcessingView
            file={uploadedFile}
            presetPolicy={selectedPresetPolicy}
            fileName={processingFileName}
            onComplete={handleProcessingComplete}
            onRetry={() => {
              setIsProcessing(false);
              setUploadedFile(null);
              setSelectedPresetPolicy(null);
            }}
          />
        ) : !activePolicy ? (
          /* State 1: Upload-First Entry (No Policy Loaded) */
          <UploadView
            onSelectPolicy={handleSelectPresetPolicy}
            onUploadFile={handleCustomUpload}
            onOpenDigiLocker={() => setIsDigiLockerOpen(true)}
          />
        ) : (
          /* State 2: Active Policy Navigation & Screens */
          <div>
            {/* 1. Main Tabs */}
            {currentScreen === 'home' && (
              <HomeView
                policy={activePolicy}
                onNavigateToCoverage={() => navigateTo('coverage')}
                onNavigateToAdmission={() => navigateTo('admission')}
                onNavigateToAppeal={() => navigateTo('appeal')}
                onNavigateToAsk={() => navigateTo('ask')}
                onNavigateToEmergencyCard={() => navigateTo('emergency-card')}
                onResetPolicy={handleResetPolicy}
              />
            )}

            {currentScreen === 'coverage' && (
              <CoverageView
                policy={activePolicy}
                onOpenCitation={handleOpenCitation}
              />
            )}

            {currentScreen === 'checklist' && (
              <ChecklistView />
            )}

            {currentScreen === 'more' && (
              <MoreHubView
                onNavigateToAsk={() => navigateTo('ask')}
                onNavigateToEmergencyCard={() => navigateTo('emergency-card')}
                onNavigateToNeedsCalc={() => navigateTo('needs-calc')}
                onNavigateToCompare={() => navigateTo('compare')}
                onNavigateToSettings={() => navigateTo('settings')}
              />
            )}

            {/* 2. Pushed Sub-screens */}
            {currentScreen === 'admission' && (
              <AdmissionView
                policy={activePolicy}
                onNavigateToChecklist={() => navigateTo('checklist')}
                onOpenCitation={handleOpenCitation}
              />
            )}

            {currentScreen === 'discharge' && (
              <DischargeView
                policy={activePolicy}
                onOpenCitation={handleOpenCitation}
              />
            )}

            {currentScreen === 'appeal' && (
              <AppealView
                policy={activePolicy}
                onOpenCitation={handleOpenCitation}
              />
            )}

            {currentScreen === 'ask' && (
              <AskClaimReadyView
                policy={activePolicy}
                onOpenCitation={handleOpenCitation}
              />
            )}

            {currentScreen === 'needs-calc' && (
              <CoverageNeedsCalcView />
            )}

            {currentScreen === 'compare' && (
              <ComparePoliciesView
                currentPolicy={activePolicy}
                onOpenCitation={handleOpenCitation}
              />
            )}

            {currentScreen === 'emergency-card' && (
              <EmergencyCardView policy={activePolicy} />
            )}

            {currentScreen === 'settings' && (
              <SettingsView
                language={language}
                onLanguageChange={setLanguage}
                onResetData={handleResetPolicy}
              />
            )}
          </div>
        )}
      </main>

      {/* Persistent Bottom Tab Bar (Visible when policy is loaded) */}
      {activePolicy && !isProcessing && (
        <BottomTabBar
          activeTab={
            ['home', 'coverage', 'checklist', 'more'].includes(currentScreen)
              ? (currentScreen as MainTab)
              : 'more'
          }
          onTabChange={(tab) => navigateTo(tab)}
          hasPolicy={!!activePolicy}
        />
      )}

      {/* Global Citation Sheet Drawer Modal */}
      <CitationSheet
        isOpen={citationState.isOpen}
        onClose={() => setCitationState((prev) => ({ ...prev, isOpen: false }))}
        clause={citationState.clause}
        page={citationState.page}
        quote={citationState.quote}
        title={citationState.title}
        policyName={citationState.policyName}
      />

      {/* DigiLocker Official Consent Modal */}
      <DigiLockerModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onPolicyImported={handleDigiLockerImport}
      />
    </div>
  );
}
