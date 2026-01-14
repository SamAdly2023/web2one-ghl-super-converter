import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-blue-500">Web2One</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-slate-300 hover:text-white flex items-center gap-2">
                        <Home size={18} /> Home
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-slate-300 hover:text-white flex items-center gap-2">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>

                            {isAdmin && (
                                <Link to="/admin" className="text-slate-300 hover:text-white flex items-center gap-2">
                                    <ShieldCheck size={18} /> Admin
                                </Link>
                            )}

                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                                <div className="text-sm text-right hidden md:block">
                                    <div className="text-white font-medium">{user.name}</div>
                                    <div className="text-slate-400 text-xs">{user.email}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
