import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface User {
    email: string;
    name: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loginWithGoogle: () => void;
    mockLogin: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'samadly728@gmail.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const isAdmin = user?.email === ADMIN_EMAIL;

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoResponse.json();
                const userData: User = {
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.error('Login Failed', error);
            }
        },
        onError: (errorResponse) => console.log(errorResponse),
    });

    const mockLogin = (email: string) => {
        const userData: User = {
            email,
            name: email.split('@')[0],
            picture: `https://ui-avatars.com/api/?name=${email}&background=random`,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loginWithGoogle, mockLogin, logout }}>
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
