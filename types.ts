
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
    name: 'Free Trial',
    price: 0,
    credits: 2,
    features: [
      '2 Free Conversions',
      'Basic Support',
      'Standard Quality',
      'Watermarked Output'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    credits: 10,
    features: [
      '10 Conversions',
      'Priority Support',
      'High-Fidelity Output',
      'No Watermark',
      'Rebranding Tools'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 97,
    credits: -1, // unlimited
    popular: true,
    features: [
      'Unlimited Conversions',
      '24/7 Priority Support',
      'Ultra HD Quality',
      'Advanced Rebranding',
      'API Access',
      'White-Label Export'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 297,
    credits: -1,
    features: [
      'Everything in Pro',
      'Team Seats (5 Users)',
      'Dedicated Account Manager',
      'Custom Integrations',
      'SLA Guarantee',
      'Priority Queue'
    ]
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
