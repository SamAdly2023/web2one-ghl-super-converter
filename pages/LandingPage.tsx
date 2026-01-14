import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">
                    Web2One
                </h1>
                <p className="text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
                    The Ultimate GHL Super Converter. Transform any website into a GoHighLevel compatible format in seconds.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(user ? '/dashboard' : '/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                        Get Started Now
                    </button>

                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-blue-400">Deep Scraping</h3>
                        <p className="text-slate-400">Advanced algorithms to extract every asset, style, and content piece from any source URL.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-purple-400">AI Optimization</h3>
                        <p className="text-slate-400">Gemini AI powered restructuring to ensure perfect compatibility with GHL page builders.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-emerald-400">Instant Export</h3>
                        <p className="text-slate-400">Get production-ready HTML/CSS code that you can copy-paste directly into your funnel.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
