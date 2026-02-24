import React, { useState, useEffect } from 'react';
import { ConverterTool } from '../components/ConverterTool';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Project, PLANS, Plan } from '../types';
import { getProjectsByUserId, deleteProject } from '../services/databaseService';
import { PayPalModal } from '../components/PayPalModal';
import { createApiKey, getApiKeysByUserId, revokeApiKey } from '../services/apiKeysService';
import {
    Zap, Clock, FolderOpen, Settings, CreditCard, HelpCircle,
    Plus, Eye, Trash2, Download, Copy, ExternalLink, Check,
    Crown, Sparkles, LayoutDashboard, History, BookOpen, ShieldCheck,
} from 'lucide-react';

type TabType = 'converter' | 'projects' | 'billing' | 'settings';

export const UserDashboard: React.FC = () => {
    const { user, credits, plan, refreshUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('converter');
    const [projects, setProjects] = useState<Project[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [createdKeyValue, setCreatedKeyValue] = useState<string | null>(null);

    // Billing State
    const [isPayPalOpen, setIsPayPalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0]);
    const [payPalMode, setPayPalMode] = useState<'subscription' | 'credits'>('subscription');
    const [customCredits, setCustomCredits] = useState(1);

    const currentPlan = PLANS.find(p => p.id === plan);

    const handleBuyCredits = () => {
        setSelectedPlan({
            id: 'free', // Dummy ID for credits
            name: `${customCredits} Credits`,
            price: customCredits * 8,
            credits: customCredits,
            features: []
        });
        setPayPalMode('credits');
        setIsPayPalOpen(true);
    };

    const handleUpgrade = (targetPlan: Plan) => {
        setSelectedPlan(targetPlan);
        setPayPalMode('subscription');
        setIsPayPalOpen(true);
    };

    useEffect(() => {
        if (user?.id) {
            getProjectsByUserId(user.id).then(setProjects);
            getApiKeysByUserId(user.id).then(setApiKeys).catch(() => setApiKeys([]));
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
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === tab.id
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
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all mb-1"
                            >
                                <ShieldCheck size={18} />
                                Admin Dashboard
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/guide')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
                        >
                            <BookOpen size={18} />
                            User Guide
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

                        {/* 1. Add Credits (Pay As You Go) */}
                        {plan !== 'agency' && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Zap className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Add Credits</h3>
                                        </div>
                                        <p className="text-slate-400 max-w-md">
                                            Pay as you go. Credits never expire. Best for occasional use.
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">{credits === -1 ? '∞' : credits}</div>
                                        <div className="text-slate-500 text-sm">Current Balance</div>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-slate-800/50 rounded-xl flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 w-full">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Select Quantity</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setCustomCredits(Math.max(1, customCredits - 1))}
                                                className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={customCredits}
                                                onChange={(e) => setCustomCredits(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="flex-1 bg-slate-900 border border-slate-700 text-white text-center h-10 rounded-lg focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                onClick={() => setCustomCredits(customCredits + 1)}
                                                className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px h-16 bg-slate-700"></div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="text-3xl font-bold text-white">${(customCredits * 8).toFixed(2)}</div>
                                        <div className="text-slate-400 text-sm">$8.00 per clone</div>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <button
                                            onClick={handleBuyCredits}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                        >
                                            <CreditCard size={20} />
                                            Buy Credits
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* 2. Upgrade to Unlimited */}
                        {plan !== 'agency' && (
                            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                                <div className="absolute top-0 right-0 p-3 bg-purple-500 text-white text-xs font-bold rounded-bl-xl">
                                    BEST VALUE
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <Crown className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">Unlimited Plan</h3>
                                        </div>
                                        <p className="text-slate-300 mb-4">
                                            Remove all limits. Clone as many websites as you want for a fixed monthly price.
                                        </p>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                                <Check className="w-4 h-4 text-emerald-400" /> Unlimited Conversions
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                                <Check className="w-4 h-4 text-emerald-400" /> Priority Support
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="text-center md:text-right">
                                        <div className="text-5xl font-bold text-white mb-2">$97<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                                        <button
                                            onClick={() => handleUpgrade(PLANS.find(p => p.id === 'agency')!)}
                                            className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-xl"
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

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
<<<<<<< HEAD
=======

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">API Keys</h3>
                                <button
                                    onClick={async () => {
                                        if (!user?.id) return alert('Please sign in');
                                        try {
                                            const row = await createApiKey(user.id, 'Key created via dashboard');
                                            // show the raw key once
                                            setCreatedKeyValue(row.apiKey);
                                            setApiKeys(prev => [row, ...prev]);
                                        } catch (e: any) {
                                            alert(e.message || 'Failed to create key');
                                        }
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Create Key
                                </button>
                            </div>

                            {createdKeyValue && (
                                <div className="mb-4 p-3 bg-slate-800 rounded">
                                    <div className="text-xs text-slate-400 mb-1">New API Key (save this now, it will be hidden later)</div>
                                    <div className="font-mono text-sm text-white truncate">{createdKeyValue}</div>
                                </div>
                            )}

                            <div className="space-y-2">
                                {apiKeys.length === 0 ? (
                                    <div className="text-slate-400">No API keys yet. Create one to get started.</div>
                                ) : (
                                    apiKeys.map(k => (
                                        <div key={k.id} className="flex items-center justify-between bg-slate-800/40 p-3 rounded">
                                            <div>
                                                <div className="text-sm text-white">{k.name || 'Unnamed key'}</div>
                                                <div className="text-xs text-slate-400">Created: {new Date(k.createdAt).toLocaleString()}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(k.apiKey);
                                                        alert('API key copied to clipboard');
                                                    }}
                                                    className="px-3 py-1 bg-slate-700 rounded text-slate-200 text-sm"
                                                >
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm('Revoke this key?')) return;
                                                        try {
                                                            await revokeApiKey(k.id);
                                                            setApiKeys(apiKeys.filter(a => a.id !== k.id));
                                                        } catch (e: any) {
                                                            alert(e.message || 'Failed to revoke');
                                                        }
                                                    }}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
>>>>>>> cacd644 (feat(api): add API key generation, clone endpoint, client service, and UI)
                    </div >
                )}
            </div >

    <PayPalModal
        isOpen={isPayPalOpen}
        onClose={() => setIsPayPalOpen(false)}
        plan={selectedPlan}
        mode={payPalMode}
        onSuccess={() => {
            refreshUser();
            setIsPayPalOpen(false);
        }}
    />
        </div >
    );
};
