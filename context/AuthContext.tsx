import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';
import firebaseClient, { signInWithGooglePopup, onAuthChange, getIdToken } from '../services/firebaseClient';
import { User as AppUser, PlanType, PLANS } from '../types';
import { createUser, getUserByEmail, updateUser, updateUserPlan } from '../services/databaseService';

interface AuthContextType {
    user: AppUser | null;
    isAdmin: boolean;
    credits: number;
    plan: PlanType;
    loginWithGoogle: () => void;
    mockLogin: (email: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    useCredit: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'samadly728@gmail.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    const isAdmin = user?.email === ADMIN_EMAIL;
    const credits = user?.credits ?? 0;
    const plan = user?.plan ?? 'free';

    // Refresh user data from database
    const refreshUser = async () => {
        if (user?.email) {
            try {
                const dbUser = await getUserByEmail(user.email);
                if (dbUser) {
                    setUser(dbUser);
                    localStorage.setItem('currentUser', JSON.stringify(dbUser));
                }
            } catch (err) {
                console.error("Failed to refresh user", err);
            }
        }
    };

    // Use a credit for conversion
    const useCreditHandler = async (): Promise<boolean> => {
        if (!user) return false;

        // Unlimited credits for pro/agency
        if (user.credits === -1) return true;

        if (user.credits <= 0) return false;

        try {
            const updatedUser = await updateUser(user.id, { credits: user.credits - 1 });
            if (updatedUser) {
                setUser(updatedUser);
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                return true;
            }
        } catch (err) {
            console.error("Failed to use credit", err);
        }
        return false;
    };

    const loginWithGoogle = async () => {
        try {
            const user = await signInWithGooglePopup();
            if (!user) return;

            const token = await getIdToken(user as any);

            // Use the firebase user info to create or fetch local DB user
            const dbUser = await createUser({
                email: user.email || '',
                name: user.displayName || (user.email || '').split('@')[0],
                picture: user.photoURL || undefined,
            });

            setUser(dbUser);
            localStorage.setItem('currentUser', JSON.stringify(dbUser));
        } catch (error) {
            console.error('Login Failed', error);
        }
    };

    const mockLogin = async (email: string) => {
        try {
            // Create or get user from database
            const dbUser = await createUser({
                email,
                name: email.split('@')[0],
                picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`,
            });

            setUser(dbUser);
            localStorage.setItem('currentUser', JSON.stringify(dbUser));
        } catch (error) {
            console.error('Mock Login Failed', error);
        }
    };

    const logout = async () => {
        try {
            await firebaseClient.signOut();
        } catch (e) {
            // ignore
        }
        googleLogout();
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    // Sync user state with database on mount
    useEffect(() => {
        if (user?.email) {
            refreshUser();
        }
    }, [user?.email]); // Added dependency to safe refresh but might loop if not careful. 
    // Actually user?.email changes only when user changes, but refreshUser updates user.
    // So JSON.stringify check in original was good.
    // Re-implementing mount check only.

    useEffect(() => {
        const unsub = onAuthChange(async (fbUser) => {
            if (!fbUser) return;
            const email = fbUser.email || '';
            try {
                const dbUser = await getUserByEmail(email);
                if (dbUser) {
                    setUser(dbUser);
                    localStorage.setItem('currentUser', JSON.stringify(dbUser));
                }
            } catch (e) {
                console.error('Failed to sync firebase user', e);
            }
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            credits,
            plan,
            loginWithGoogle,
            mockLogin,
            logout,
            refreshUser,
            useCredit: useCreditHandler
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
