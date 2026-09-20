export type Language = 'en' | 'te' | 'hi';

export type MainTab = 'home' | 'coverage' | 'checklist' | 'more';

export type PushedScreen =
  | 'admission'
  | 'discharge'
  | 'appeal'
  | 'ask'
  | 'needs-calc'
  | 'compare'
  | 'emergency-card'
  | 'settings';

export type ActiveScreen = MainTab | PushedScreen;

export type FieldCategory = 'caps' | 'waiting' | 'logistics' | 'procedures';

export type StatusType = 'covered' | 'warning' | 'not_covered' | 'not_found';

export interface CoverageField {
  field: string;
  title: string;
  category: FieldCategory;
  value: string;
  status: StatusType;
  quote: string;
  page: number;
  clause: string;
  explanation: string;
  plainMeaning: string;
  iconName?: string;
  relatedFields?: Array<{
    title: string;
    clause: string;
    page: number;
  }>;
}

export interface PolicyData {
  id: string;
  insurerName: string;
  policyName: string;
  policyNumber: string;
  sumInsured: string;
  policyPeriod: string;
  familyMembers: string;
  userName?: string;
  insurerHelpline: string;
  tpaName: string;
  tpaHelpline: string;
  cashlessNumber: string;
  fields: CoverageField[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'claimready';
  text: string;
  citations?: Array<{
    clause: string;
    page: number;
    title: string;
    quote?: string;
  }>;
  timestamp: string;
}

export interface AppealDraft {
  rejectionReason: string;
  letter: string;
  citations: Array<{
    clause: string;
    page: number;
    title: string;
  }>;
}

export interface NeedsAssessment {
  familyType: 'individual' | 'nuclear' | 'joint' | 'senior';
  eldestAge: number;
  cityTier: 'tier1' | 'tier2' | 'tier3';
  hasPED: boolean;
  savingsComfort: 'low' | 'moderate' | 'high';
}
