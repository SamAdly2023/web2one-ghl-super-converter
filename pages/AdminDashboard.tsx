import React from 'react';
import { Users, Activity, DollarSign, Settings, Bell, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><Bell size={20} /></button>
                    <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><Settings size={20} /></button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
                    { label: 'Conversions', value: '8,543', change: '+25%', icon: Activity, color: 'emerald' },
                    { label: 'Revenue', value: '$12,450', change: '+8%', icon: DollarSign, color: 'purple' },
                    { label: 'Server Load', value: '34%', change: '-2%', icon: Server, color: 'orange' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-500 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Recent Conversions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Target URL</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-white">Example User {i + 1}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">https://example.com/page-{i}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">Jan {15 - i}, 2026</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
