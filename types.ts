
export interface ConversionStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

export interface RebrandingInfo {
  logoUrl?: string;
  brandName?: string;
  websiteLink?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  CONVERTING = 'CONVERTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// ============ SUBSCRIPTION & USER TYPES ============

export type PlanType = 'free' | 'starter' | 'pro' | 'agency';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  credits: number; // -1 for unlimited
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Standard',
    price: 0,
    credits: 0, // Pay as you go
    features: [
      'Pay per conversion ($8)',
      'Basic Support',
      'Standard Quality',
    ]
  },
  {
    id: 'agency', // Keeping ID as agency for now, but UI will show Unlimited
    name: 'Unlimited',
    price: 97,
    credits: -1, // Unlimited
    features: [
      'Unlimited Conversions',
      'Priority Support',
      'High Fidelity Results',
      'No Watermark',
      'Commercial License'
    ],
    popular: true
  }
];


export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  plan: PlanType;
  credits: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface Project {
  id: string;
  userId: string;
  sourceUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  outputHtml?: string;
  rebrandInfo?: RebrandingInfo;
  previewImage?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanType;
  status: 'active' | 'cancelled' | 'expired';
  paypalSubscriptionId?: string;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  planId: PlanType;
  paypalTransactionId: string;
  status: 'completed' | 'pending' | 'refunded';
  createdAt: string;
}
