import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { User as AppUser, PlanType, PLANS } from '../types';
import { createUser, getUserByEmail, updateUser, updateUserPlan } from '../services/databaseService';

interface AuthContextType {
    user: AppUser | null;
    isAdmin: boolean;
    credits: number;
    plan: PlanType;
    loginWithGoogle: () => void;
    mockLogin: (email: string) => void;
    logout: () => void;
    refreshUser: () => void;
    useCredit: () => boolean;
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
    const refreshUser = () => {
        if (user?.email) {
            const dbUser = getUserByEmail(user.email);
            if (dbUser) {
                setUser(dbUser);
                localStorage.setItem('currentUser', JSON.stringify(dbUser));
            }
        }
    };

    // Use a credit for conversion
    const useCreditHandler = (): boolean => {
        if (!user) return false;

        // Unlimited credits for pro/agency
        if (user.credits === -1) return true;

        if (user.credits <= 0) return false;

        const updatedUser = updateUser(user.id, { credits: user.credits - 1 });
        if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            return true;
        }
        return false;
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoResponse.json();

                // Create or get user from database
                const dbUser = createUser({
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                });

                setUser(dbUser);
                localStorage.setItem('currentUser', JSON.stringify(dbUser));
            } catch (error) {
                console.error('Login Failed', error);
            }
        },
        onError: (errorResponse) => console.log(errorResponse),
    });

    const mockLogin = (email: string) => {
        // Create or get user from database
        const dbUser = createUser({
            email,
            name: email.split('@')[0],
            picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`,
        });

        setUser(dbUser);
        localStorage.setItem('currentUser', JSON.stringify(dbUser));
    };

    const logout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    // Sync user state with database on mount
    useEffect(() => {
        if (user?.email) {
            const dbUser = getUserByEmail(user.email);
            if (dbUser && JSON.stringify(dbUser) !== JSON.stringify(user)) {
                setUser(dbUser);
                localStorage.setItem('currentUser', JSON.stringify(dbUser));
            }
        }
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
