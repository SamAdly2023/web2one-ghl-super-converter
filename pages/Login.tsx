import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Chrome } from 'lucide-react'; // Simulating Google icon

export const Login: React.FC = () => {
    const { mockLogin, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('samadly728@gmail.com');

    const handleMockLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        mockLogin(email);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Sign In</h2>

                {/* Real Google Button would go here */}
                <button
                    onClick={() => loginWithGoogle()}
                    className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-lg mb-6 flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                >
                    <Chrome className="text-blue-500" />
                    Continue with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-900 text-slate-500">Or use Dev Login</span>
                    </div>
                </div>

                <form onSubmit={handleMockLogin}>
                    <div className="mb-4">
                        <label className="block text-slate-400 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                            placeholder="name@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Access Dashboard
                    </button>
                    <p className="mt-4 text-xs text-slate-500 text-center">
                        Tip: Use <code>samadly728@gmail.com</code> for admin access.
                    </p>
                </form>
            </div>
        </div>
    );
};
