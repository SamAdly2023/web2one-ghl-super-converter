/**
 * Local Storage Database Service
 * Simulates a database using localStorage for demo purposes
 * In production, replace with actual backend API calls
 */

import { User, Project, Subscription, PaymentHistory, PlanType, PLANS } from '../types';

const STORAGE_KEYS = {
    USERS: 'web2one_users',
    PROJECTS: 'web2one_projects',
    SUBSCRIPTIONS: 'web2one_subscriptions',
    PAYMENTS: 'web2one_payments',
    CURRENT_USER: 'user'
};

// ============ USER OPERATIONS ============

export function getAllUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
}

export function getUserById(id: string): User | null {
    const users = getAllUsers();
    return users.find(u => u.id === id) || null;
}

export function getUserByEmail(email: string): User | null {
    const users = getAllUsers();
    return users.find(u => u.email === email) || null;
}

export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'plan' | 'credits'>): User {
    const users = getAllUsers();
    const existingUser = users.find(u => u.email === userData.email);

    if (existingUser) {
        // Update last login
        existingUser.lastLoginAt = new Date().toISOString();
        saveUsers(users);
        return existingUser;
    }

    const newUser: User = {
        ...userData,
        id: generateId(),
        plan: 'free',
        credits: 2, // Free trial credits
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
}

export function updateUserPlan(userId: string, planId: PlanType): User | null {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return null;

    return updateUser(userId, {
        plan: planId,
        credits: plan.credits
    });
}

function saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// ============ PROJECT OPERATIONS ============

export function getAllProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
}

export function getProjectsByUserId(userId: string): Project[] {
    const projects = getAllProjects();
    return projects.filter(p => p.userId === userId);
}

export function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'status'>): Project {
    const projects = getAllProjects();

    const newProject: Project = {
        ...projectData,
        id: generateId(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    saveProjects(projects);
    return newProject;
}

export function updateProject(projectId: string, updates: Partial<Project>): Project | null {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);

    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    saveProjects(projects);
    return projects[index];
}

export function deleteProject(projectId: string): boolean {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);

    if (filtered.length === projects.length) return false;

    saveProjects(filtered);
    return true;
}

function saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// ============ SUBSCRIPTION OPERATIONS ============

export function getSubscriptionByUserId(userId: string): Subscription | null {
    const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    const subscriptions: Subscription[] = data ? JSON.parse(data) : [];
    return subscriptions.find(s => s.userId === userId && s.status === 'active') || null;
}

export function createSubscription(subData: Omit<Subscription, 'id' | 'startDate'>): Subscription {
    const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    const subscriptions: Subscription[] = data ? JSON.parse(data) : [];

    // Cancel any existing active subscription
    subscriptions.forEach(s => {
        if (s.userId === subData.userId && s.status === 'active') {
            s.status = 'cancelled';
        }
    });

    const newSub: Subscription = {
        ...subData,
        id: generateId(),
        startDate: new Date().toISOString()
    };

    subscriptions.push(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
    return newSub;
}

// ============ PAYMENT HISTORY ============

export function getPaymentsByUserId(userId: string): PaymentHistory[] {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    const payments: PaymentHistory[] = data ? JSON.parse(data) : [];
    return payments.filter(p => p.userId === userId);
}

export function getAllPayments(): PaymentHistory[] {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
}

export function createPayment(paymentData: Omit<PaymentHistory, 'id' | 'createdAt'>): PaymentHistory {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    const payments: PaymentHistory[] = data ? JSON.parse(data) : [];

    const newPayment: PaymentHistory = {
        ...paymentData,
        id: generateId(),
        createdAt: new Date().toISOString()
    };

    payments.push(newPayment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    return newPayment;
}

// ============ CREDITS ============

export function useCredit(userId: string): boolean {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return false;

    // Unlimited credits for pro/agency
    if (user.credits === -1) return true;

    if (user.credits <= 0) return false;

    user.credits -= 1;
    saveUsers(users);
    return true;
}

export function addCredits(userId: string, amount: number): User | null {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return null;

    // Don't modify unlimited credits
    if (user.credits !== -1) {
        user.credits += amount;
    }

    saveUsers(users);
    return user;
}

// ============ STATS FOR ADMIN ============

export function getStats() {
    const users = getAllUsers();
    const projects = getAllProjects();
    const payments = getAllPayments();

    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    const completedProjects = projects.filter(p => p.status === 'completed').length;

    const planBreakdown = {
        free: users.filter(u => u.plan === 'free').length,
        starter: users.filter(u => u.plan === 'starter').length,
        pro: users.filter(u => u.plan === 'pro').length,
        agency: users.filter(u => u.plan === 'agency').length
    };

    return {
        totalUsers: users.length,
        totalProjects: projects.length,
        completedProjects,
        totalRevenue,
        planBreakdown
    };
}

// ============ HELPERS ============

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
