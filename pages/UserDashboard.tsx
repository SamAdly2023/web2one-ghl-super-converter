import React from 'react';
import { ConverterTool } from '../components/ConverterTool';
import { useAuth } from '../context/AuthContext';

export const UserDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto mb-8 text-white">
                <h2 className="text-2xl font-bold">Workspace</h2>
                <p className="text-slate-400">Create new conversions or manage existing ones.</p>
            </div>
            <ConverterTool />
        </div>
    );
};
