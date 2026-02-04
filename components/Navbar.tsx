import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck, Home, BookOpen, Menu, X, Zap, Crown } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, isAdmin, logout, credits, plan } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    // Don't show navbar on dashboard pages (they have their own sidebar)
    const hiddenPaths = ['/dashboard', '/admin'];
    const isHidden = hiddenPaths.some(p => location.pathname.startsWith(p)) && user;

    if (isHidden) {
        return (
            <nav className="bg-slate-900 border-b border-slate-800 p-4 lg:hidden">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Web2One</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                {credits === -1 ? '∞' : credits}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Web2One</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/"
                        className={`flex items-center gap-2 transition-colors ${isActive('/') ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Home size={18} /> Home
                    </Link>

                    <Link
                        to="/guide"
                        className={`flex items-center gap-2 transition-colors ${isActive('/guide') ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <BookOpen size={18} /> Guide
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-2 transition-colors ${isActive('/dashboard') ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>

                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className={`flex items-center gap-2 transition-colors ${isActive('/admin') ? 'text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <ShieldCheck size={18} /> Admin
                                </Link>
                            )}

                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                                {/* Credits Display */}
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-white font-medium text-sm">
                                        {credits === -1 ? '∞' : credits}
                                    </span>
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                                        alt={user.name}
                                        className="w-9 h-9 rounded-full border-2 border-slate-700"
                                    />
                                    <div className="text-sm text-right hidden lg:block">
                                        <div className="text-white font-medium flex items-center gap-1">
                                            {user.name}
                                            {plan !== 'free' && (
                                                <Crown className="w-3 h-3 text-yellow-400" />
                                            )}
                                        </div>
                                        <div className="text-slate-400 text-xs capitalize">{plan} Plan</div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-slate-300 hover:text-white px-4 py-2 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-slate-800">
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Home size={18} /> Home
                        </Link>
                        <Link
                            to="/guide"
                            className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <BookOpen size={18} /> Guide
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <ShieldCheck size={18} /> Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
