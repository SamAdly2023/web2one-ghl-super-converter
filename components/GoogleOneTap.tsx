import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Zap } from 'lucide-react';

interface GoogleOneTapProps {
    onDismiss?: () => void;
}

export const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onDismiss }) => {
    const { user, loginWithGoogle, mockLogin } = useAuth();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Only show if user is not logged in and hasn't dismissed
        if (!user && !dismissed) {
            // Show popup after 2 seconds
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [user, dismissed]);

    const handleDismiss = () => {
        setShowPopup(false);
        setDismissed(true);
        // Remember dismissal for session
        sessionStorage.setItem('oneTapDismissed', 'true');
        onDismiss?.();
    };

    const handleQuickLogin = (email: string) => {
        mockLogin(email);
        setShowPopup(false);
        navigate('/dashboard');
    };

    const handleGoogleLogin = () => {
        loginWithGoogle();
        setShowPopup(false);
    };

    // Check session storage on mount
    useEffect(() => {
        if (sessionStorage.getItem('oneTapDismissed') === 'true') {
            setDismissed(true);
        }
    }, []);

    if (!showPopup || user) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Zap className="w-5 h-5" />
                        <span className="font-bold">Quick Sign In</span>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                        Sign in to save your work and access premium features
                    </p>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-400 text-xs">or try demo</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Quick Demo Accounts */}
                    <div className="space-y-2">
                        <button
                            onClick={() => handleQuickLogin('demo@web2one.com')}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                D
                            </div>
                            <div className="text-left">
                                <div className="text-gray-900 text-sm font-medium">Demo Account</div>
                                <div className="text-gray-500 text-xs">demo@web2one.com</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 text-center">
                    <p className="text-gray-500 text-xs">
                        Get 2 free conversions when you sign up
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
