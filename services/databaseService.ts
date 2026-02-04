/**
 * API Database Service
 * Connects to the backend SQLite database via API endpoints
 */

import { User, Project, Subscription, PaymentHistory, PlanType, PLANS } from '../types';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) {
        if (res.status === 404) return null as unknown as T;
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `API Error: ${res.statusText}`);
    }
    return res.json();
}

// ============ USER OPERATIONS ============

export async function getAllUsers(): Promise<User[]> {
    return fetchApi<User[]>('/users');
}

export async function getUserById(id: string): Promise<User | null> {
    return fetchApi<User | null>(`/users/${id}`);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return fetchApi<User | null>(`/users/email/${email}`);
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'plan' | 'credits'>): Promise<User> {
    return fetchApi<User>('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    return fetchApi<User | null>(`/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
}

export async function updateUserPlan(userId: string, planId: PlanType): Promise<User | null> {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return null;

    return updateUser(userId, {
        plan: planId,
        credits: plan.credits
    });
}

// ============ PROJECT OPERATIONS ============

export async function getAllProjects(): Promise<Project[]> {
    return fetchApi<Project[]>('/projects');
}

export async function getProjectsByUserId(userId: string): Promise<Project[]> {
    return fetchApi<Project[]>(`/projects/user/${userId}`);
}

export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'status'>): Promise<Project> {
    return fetchApi<Project>('/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
    });
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    return fetchApi<Project | null>(`/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
}

export async function deleteProject(projectId: string): Promise<boolean> {
    try {
        await fetchApi<{ success: boolean }>(`/projects/${projectId}`, {
            method: 'DELETE'
        });
        return true;
    } catch {
        return false;
    }
}

// ============ SUBSCRIPTION OPERATIONS ============

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
    return fetchApi<Subscription | null>(`/subscriptions/user/${userId}`);
}

export async function createSubscription(subData: Omit<Subscription, 'id' | 'startDate'>): Promise<Subscription> {
    return fetchApi<Subscription>('/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subData)
    });
}

// ============ PAYMENT HISTORY ============

export async function getPaymentsByUserId(userId: string): Promise<PaymentHistory[]> {
    return fetchApi<PaymentHistory[]>(`/payments/user/${userId}`);
}

export async function getAllPayments(): Promise<PaymentHistory[]> {
    return fetchApi<PaymentHistory[]>('/payments');
}

export async function createPayment(paymentData: Omit<PaymentHistory, 'id' | 'createdAt'>): Promise<PaymentHistory> {
    return fetchApi<PaymentHistory>('/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });
}

// ============ CREDITS ============

export async function useCredit(userId: string): Promise<boolean> {
    const user = await getUserById(userId);
    if (!user) return false;

    // Unlimited credits for pro/agency
    if (user.credits === -1) return true;
    if (user.credits <= 0) return false;

    await updateUser(userId, { credits: user.credits - 1 });
    return true;
}

export async function addCredits(userId: string, amount: number): Promise<User | null> {
    const user = await getUserById(userId);
    if (!user) return null;

    if (user.credits !== -1) {
        return updateUser(userId, { credits: user.credits + amount });
    }
    return user;
}

// ============ STATS FOR ADMIN ============

export async function getStats() {
    return fetchApi<any>('/stats');
}

export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserPlan,
    getAllProjects,
    getProjectsByUserId,
    createProject,
    updateProject,
    deleteProject,
    getSubscriptionByUserId,
    createSubscription,
    getPaymentsByUserId,
    getAllPayments,
    createPayment,
    useCredit,
    addCredits,
    getStats
};
