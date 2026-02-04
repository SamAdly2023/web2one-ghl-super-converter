import React, { useState, useEffect } from 'react';
import { ConverterTool } from '../components/ConverterTool';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Project, PLANS } from '../types';
import { getProjectsByUserId, deleteProject } from '../services/databaseService';
import {
    Zap, Clock, FolderOpen, Settings, CreditCard, HelpCircle,
    Plus, Eye, Trash2, Download, Copy, ExternalLink, Check,
    Crown, Sparkles, LayoutDashboard, History, BookOpen
} from 'lucide-react';

type TabType = 'converter' | 'projects' | 'billing' | 'settings';

export const UserDashboard: React.FC = () => {
    const { user, credits, plan, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('converter');
    const [projects, setProjects] = useState<Project[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const currentPlan = PLANS.find(p => p.id === plan);

    useEffect(() => {
        if (user?.id) {
            getProjectsByUserId(user.id).then(setProjects);
        }
    }, [user]);

    const handleDeleteProject = async (projectId: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            await deleteProject(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
        }
    };

    const handleCopyCode = (projectId: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(projectId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const tabs = [
        { id: 'converter', label: 'New Conversion', icon: Plus },
        { id: 'projects', label: 'My Projects', icon: FolderOpen },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 pt-20 hidden lg:block">
                <div className="p-6">
                    {/* User Card */}
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                                alt={user?.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="text-white font-medium">{user?.name}</div>
                                <div className="text-slate-400 text-xs truncate max-w-[140px]">{user?.email}</div>
                            </div>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${plan === 'agency' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                plan === 'starter' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                            <Crown className="w-3 h-3" />
                            {currentPlan?.name || 'Free'} Plan
                        </div>
                    </div>

                    {/* Credits Display */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm">Credits Remaining</span>
                            <Zap className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {credits === -1 ? '∞' : credits}
                        </div>
                        {credits !== -1 && credits <= 2 && (
                            <button
                                onClick={() => setActiveTab('billing')}
                                className="mt-3 w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Get More Credits
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Links */}
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <button
                            onClick={() => navigate('/guide')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
                        >
                            <BookOpen size={18} />
                            User Guide
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
                            <HelpCircle size={18} />
                            Help & Support
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50">
                <div className="flex justify-around py-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span className="text-xs">{tab.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 p-6 lg:p-8 pb-24 lg:pb-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {activeTab === 'converter' && 'Create New Conversion'}
                        {activeTab === 'projects' && 'My Projects'}
                        {activeTab === 'billing' && 'Billing & Subscription'}
                        {activeTab === 'settings' && 'Account Settings'}
                    </h1>
                    <p className="text-slate-400">
                        {activeTab === 'converter' && 'Clone any website and convert it to GHL-ready code'}
                        {activeTab === 'projects' && 'View and manage your previous conversions'}
                        {activeTab === 'billing' && 'Manage your subscription and payment methods'}
                        {activeTab === 'settings' && 'Update your account preferences'}
                    </p>
                </div>

                {/* Converter Tab */}
                {activeTab === 'converter' && (
                    <div>
                        {credits === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No Credits Remaining</h3>
                                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                                    You've used all your conversion credits. Upgrade your plan to continue cloning websites.
                                </p>
                                <button
                                    onClick={() => setActiveTab('billing')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        ) : (
                            <ConverterTool />
                        )}
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        {projects.length === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FolderOpen className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">No Projects Yet</h3>
                                <p className="text-slate-400 mb-6">Create your first conversion to see it here</p>
                                <button
                                    onClick={() => setActiveTab('converter')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <Plus size={18} />
                                    New Conversion
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        project.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            project.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                                'bg-slate-500/10 text-slate-400'
                                                        }`}>
                                                        {project.status.toUpperCase()}
                                                    </span>
                                                    <span className="text-slate-500 text-sm">
                                                        {new Date(project.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-white font-medium truncate">{project.sourceUrl}</div>
                                                {project.rebrandInfo?.brandName && (
                                                    <div className="text-slate-400 text-sm mt-1">
                                                        Rebranded to: {project.rebrandInfo.brandName}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {project.outputHtml && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCopyCode(project.id, project.outputHtml!)}
                                                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                            title="Copy Code"
                                                        >
                                                            {copiedId === project.id ? <Check size={18} /> : <Copy size={18} />}
                                                        </button>
                                                        <button
                                                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                            title="Preview"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                    <div className="space-y-8">
                        {/* Current Plan */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Current Plan</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan === 'agency' ? 'bg-purple-500/10' :
                                        plan === 'pro' ? 'bg-blue-500/10' :
                                            plan === 'starter' ? 'bg-emerald-500/10' :
                                                'bg-slate-800'
                                        }`}>
                                        <Crown className={`w-6 h-6 ${plan === 'agency' ? 'text-purple-400' :
                                            plan === 'pro' ? 'text-blue-400' :
                                                plan === 'starter' ? 'text-emerald-400' :
                                                    'text-slate-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-xl">{currentPlan?.name}</div>
                                        <div className="text-slate-400">
                                            ${currentPlan?.price}/month • {credits === -1 ? 'Unlimited' : `${credits} credits remaining`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Options */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Upgrade Your Plan</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {PLANS.filter(p => p.id !== 'free' && p.id !== plan).map((upgradePlan) => (
                                    <div
                                        key={upgradePlan.id}
                                        className={`bg-slate-900 border rounded-xl p-6 ${upgradePlan.popular ? 'border-blue-500' : 'border-slate-800'
                                            }`}
                                    >
                                        {upgradePlan.popular && (
                                            <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded mb-3">
                                                POPULAR
                                            </span>
                                        )}
                                        <h4 className="text-white font-bold">{upgradePlan.name}</h4>
                                        <div className="text-2xl font-bold text-white mt-2">${upgradePlan.price}<span className="text-slate-400 text-sm">/mo</span></div>
                                        <ul className="mt-4 space-y-2">
                                            {upgradePlan.features.slice(0, 3).map((feature, i) => (
                                                <li key={i} className="text-slate-400 text-sm flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <div id={`paypal-button-${upgradePlan.id}`} className="mt-4"></div>
                                        <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Upgrade with PayPal
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment History */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h3 className="text-lg font-bold text-white">Payment History</h3>
                            </div>
                            <div className="p-12 text-center text-slate-500">
                                No payment history yet
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
                            <div className="flex items-center gap-6 mb-6">
                                <img
                                    src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                                    alt={user?.name}
                                    className="w-20 h-20 rounded-full"
                                />
                                <div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Change Avatar
                                    </button>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Account Actions</h3>
                            <div className="space-y-4">
                                <button className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors">
                                    Export My Data
                                </button>
                                <button className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
