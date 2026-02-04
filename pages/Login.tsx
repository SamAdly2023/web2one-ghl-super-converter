import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Check, Star, ArrowRight } from 'lucide-react';

// Google Icon SVG Component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export const Login: React.FC = () => {
    const { mockLogin, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [showDevLogin, setShowDevLogin] = useState(false);

    const handleMockLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        mockLogin(email);
        navigate('/dashboard');
    };

    const handleGoogleLogin = () => {
        loginWithGoogle();
    };

    // Quick login options for demo
    const quickLogins = [
        { email: 'samadly728@gmail.com', label: 'Admin Account', isAdmin: true },
        { email: 'demo@web2one.com', label: 'Demo User', isAdmin: false },
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 p-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-5xl w-full">
                {/* Left Side - Login Form */}
                <div className="flex-1">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-slate-400">Sign in to access your dashboard</p>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-slate-900 font-medium py-4 px-4 rounded-xl mb-4 flex items-center justify-center gap-3 hover:bg-slate-100 transition-all transform hover:scale-[1.02] shadow-lg"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        {/* Quick Gmail Selection - Simulating One-Tap */}
                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                            <p className="text-slate-400 text-sm mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                Quick Sign In (Demo)
                            </p>
                            <div className="space-y-2">
                                {quickLogins.map((login, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            mockLogin(login.email);
                                            navigate('/dashboard');
                                        }}
                                        className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {login.email[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium flex items-center gap-2">
                                                {login.label}
                                                {login.isAdmin && (
                                                    <Shield className="w-4 h-4 text-blue-400" />
                                                )}
                                            </div>
                                            <div className="text-slate-400 text-sm">{login.email}</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-500" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dev Login Toggle */}
                        <button
                            onClick={() => setShowDevLogin(!showDevLogin)}
                            className="w-full text-center text-slate-500 text-sm hover:text-slate-300 transition-colors mb-4"
                        >
                            {showDevLogin ? 'Hide' : 'Show'} manual email login
                        </button>

                        {showDevLogin && (
                            <>
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-slate-900 text-slate-500">Or enter email</span>
                                    </div>
                                </div>

                                <form onSubmit={handleMockLogin}>
                                    <div className="mb-4">
                                        <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Access Dashboard
                                    </button>
                                </form>
                            </>
                        )}

                        <p className="mt-6 text-xs text-slate-500 text-center">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>

                {/* Right Side - Features */}
                <div className="flex-1 hidden lg:flex flex-col justify-center">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Start Cloning Websites Today</h3>
                            <p className="text-slate-400">
                                Join thousands of GHL agencies who save hours on every project with Web2One.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                'Clone any website in 30 seconds',
                                'AI-powered reconstruction for JS sites',
                                'Perfect GHL compatibility guaranteed',
                                'Instant rebranding with your logo',
                                '2 free conversions to get started'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mt-8">
                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-300 italic mb-4">
                                "Web2One transformed how our agency works. What used to take days now takes minutes. The ROI is incredible."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                <div>
                                    <div className="text-white font-medium">Sarah Johnson</div>
                                    <div className="text-slate-500 text-sm">Agency Owner, Digital Spark</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
