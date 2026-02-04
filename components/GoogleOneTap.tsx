import React from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { createUser } from '../services/databaseService';

interface GoogleOneTapProps {
    onDismiss?: () => void;
}

export const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onDismiss }) => {
    const { user } = useAuth();
    
    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            if (credentialResponse.credential) {
                try {
                   const base64Url = credentialResponse.credential.split('.')[1];
                   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                   const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                   }).join(''));
                   
                   const userInfo = JSON.parse(jsonPayload);
                   
                   const dbUser = await createUser({
                        email: userInfo.email,
                        name: userInfo.name,
                        picture: userInfo.picture,
                   });
                   
                   localStorage.setItem('currentUser', JSON.stringify(dbUser));
                   window.location.href = '/dashboard';

                } catch (e) {
                    console.error('One Tap Login Error', e);
                }
            }
        },
        onError: () => {
            console.log('One Tap Login Failed');
        },
        disabled: !!user,
    });

    return null;
};
