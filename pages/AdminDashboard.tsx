import React, { useState, useEffect } from 'react';
import {
    Users, Activity, DollarSign, Settings, Bell, Server,
    Search, Filter, MoreVertical, Edit2, Trash2, Crown,
    Download, RefreshCw, ChevronDown, Check, X, Eye,
    TrendingUp, Calendar, CreditCard, Shield, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User, Project, PlanType, PLANS } from '../types';
import { getAllUsers, getAllProjects, updateUserPlan, getStats, getAllPayments, updateUser } from '../services/databaseService';

type TabType = 'overview' | 'users' | 'projects' | 'payments' | 'settings';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setUsers(getAllUsers());
        setProjects(getAllProjects());
        setStats(getStats());
    };

    const handlePlanChange = (userId: string, newPlan: PlanType) => {
        updateUserPlan(userId, newPlan);
        loadData();
        setShowEditModal(false);
    };

    const handleCreditsChange = (userId: string, credits: number) => {
        updateUser(userId, { credits });
        loadData();
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'projects', label: 'Projects', icon: Server },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Top Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-500" />
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm">Manage users, projects, and subscriptions</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={loadData}
                            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                            <img
                                src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="hidden md:block">
                                <div className="text-white font-medium text-sm">{user?.name}</div>
                                <div className="text-slate-400 text-xs">Administrator</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    label: 'Total Users',
                                    value: stats?.totalUsers || 0,
                                    change: '+12%',
                                    icon: Users,
                                    color: 'blue',
                                    gradient: 'from-blue-500 to-blue-600'
                                },
                                {
                                    label: 'Total Projects',
                                    value: stats?.totalProjects || 0,
                                    change: '+25%',
                                    icon: Activity,
                                    color: 'emerald',
                                    gradient: 'from-emerald-500 to-emerald-600'
                                },
                                {
                                    label: 'Revenue',
                                    value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
                                    change: '+8%',
                                    icon: DollarSign,
                                    color: 'purple',
                                    gradient: 'from-purple-500 to-purple-600'
                                },
                                {
                                    label: 'Pro Users',
                                    value: (stats?.planBreakdown?.pro || 0) + (stats?.planBreakdown?.agency || 0),
                                    change: '+15%',
                                    icon: Crown,
                                    color: 'yellow',
                                    gradient: 'from-yellow-500 to-orange-500'
                                },
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                    <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                                                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                                            </div>
                                            <span className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                                                <TrendingUp size={14} />
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                        <p className="text-slate-500 text-sm">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Plan Breakdown */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Plan Distribution</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {PLANS.map((plan) => {
                                    const count = stats?.planBreakdown?.[plan.id] || 0;
                                    const total = stats?.totalUsers || 1;
                                    const percentage = Math.round((count / total) * 100);
                                    return (
                                        <div key={plan.id} className="text-center">
                                            <div className="text-2xl font-bold text-white">{count}</div>
                                            <div className="text-slate-400 text-sm">{plan.name}</div>
                                            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${plan.id === 'agency' ? 'from-purple-500 to-pink-500' :
                                                            plan.id === 'pro' ? 'from-blue-500 to-cyan-500' :
                                                                plan.id === 'starter' ? 'from-emerald-500 to-green-500' :
                                                                    'from-slate-500 to-slate-600'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-800">
                                    <h3 className="text-lg font-bold text-white">Recent Users</h3>
                                </div>
                                <div className="divide-y divide-slate-800">
                                    {users.slice(0, 5).map((u, i) => (
                                        <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-800/50">
                                            <img
                                                src={u.picture || `https://ui-avatars.com/api/?name=${u.name}&background=random`}
                                                alt={u.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <div className="text-white font-medium">{u.name}</div>
                                                <div className="text-slate-400 text-sm">{u.email}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.plan === 'agency' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                    u.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        u.plan === 'starter' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                }`}>
                                                {u.plan.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-800">
                                    <h3 className="text-lg font-bold text-white">Recent Projects</h3>
                                </div>
                                <div className="divide-y divide-slate-800">
                                    {projects.slice(0, 5).map((p, i) => (
                                        <div key={i} className="p-4 hover:bg-slate-800/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        p.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            p.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                                'bg-slate-500/10 text-slate-400'
                                                    }`}>
                                                    {p.status.toUpperCase()}
                                                </span>
                                                <span className="text-slate-500 text-xs">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-slate-300 text-sm truncate">{p.sourceUrl}</div>
                                        </div>
                                    ))}
                                    {projects.length === 0 && (
                                        <div className="p-8 text-center text-slate-500">No projects yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Search and Filter */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <button className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white flex items-center gap-2">
                                <Filter size={20} />
                                Filter
                            </button>
                            <button className="px-4 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center gap-2">
                                <Download size={20} />
                                Export
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr className="text-left text-slate-400 text-sm uppercase">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4">Credits</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4">Last Active</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-800/50 text-sm">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={u.picture || `https://ui-avatars.com/api/?name=${u.name}&background=random`}
                                                        alt={u.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <div className="text-white font-medium flex items-center gap-2">
                                                            {u.name}
                                                            {u.email === ADMIN_EMAIL && (
                                                                <Shield className="w-4 h-4 text-blue-500" />
                                                            )}
                                                        </div>
                                                        <div className="text-slate-400">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.plan === 'agency' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                        u.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            u.plan === 'starter' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                    {u.plan.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                {u.credits === -1 ? (
                                                    <span className="text-blue-400">Unlimited</span>
                                                ) : (
                                                    <span>{u.credits} remaining</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(u.lastLoginAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setSelectedUser(u); setShowEditModal(true); }}
                                                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    No users found matching your search
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr className="text-left text-slate-400 text-sm uppercase">
                                        <th className="px-6 py-4">Source URL</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {projects.map((p) => {
                                        const projectUser = users.find(u => u.id === p.userId);
                                        return (
                                            <tr key={p.id} className="hover:bg-slate-800/50 text-sm">
                                                <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{p.sourceUrl}</td>
                                                <td className="px-6 py-4 text-slate-400">{projectUser?.email || 'Unknown'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            p.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                p.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-slate-500/10 text-slate-400'
                                                        }`}>
                                                        {p.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">
                                                    {new Date(p.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {projects.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    No projects created yet
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                            <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Payment History</h3>
                            <p className="text-slate-400">All PayPal transactions will appear here</p>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">API Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Gemini API Key</label>
                                    <input
                                        type="password"
                                        value="AIzaSyBTn4trIqGR0QKLBxMI4tRQLnUalxWZ0Pk"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">PayPal Client ID</label>
                                    <input
                                        type="password"
                                        value="AarwkYK4lzBjwzF7OCgJeoRBnGAZehBAsNrEyrQZSdzu7yyPH3P7qEm0qtm-VNj_SvYFPpKA9PjZqO2G"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Edit User</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={selectedUser.picture || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=random`}
                                alt={selectedUser.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <div className="text-white font-bold">{selectedUser.name}</div>
                                <div className="text-slate-400">{selectedUser.email}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Plan</label>
                                <select
                                    value={selectedUser.plan}
                                    onChange={(e) => handlePlanChange(selectedUser.id, e.target.value as PlanType)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                >
                                    {PLANS.map((plan) => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Credits</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={selectedUser.credits === -1 ? 999 : selectedUser.credits}
                                        onChange={(e) => handleCreditsChange(selectedUser.id, parseInt(e.target.value))}
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        min="-1"
                                    />
                                    <button
                                        onClick={() => handleCreditsChange(selectedUser.id, -1)}
                                        className="px-4 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                                    >
                                        <Zap size={20} />
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs mt-1">Set to -1 for unlimited, or click ⚡ button</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ADMIN_EMAIL = 'samadly728@gmail.com';
