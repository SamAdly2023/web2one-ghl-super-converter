import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { StepIndicator } from './StepIndicator';
import { CodeDisplay } from './CodeDisplay';
import { AppState, ConversionStep, RebrandingInfo } from '../types';
import { fetchWebsiteHtml } from '../services/webFetcher';
import { optimizeHtmlForGHL } from '../services/geminiService';
import { createProject, updateProject, useCredit } from '../services/databaseService';
import { useAuth } from '../context/AuthContext';
import { X, Zap, AlertTriangle } from 'lucide-react';


export const ConverterTool: React.FC = () => {
    const { user, credits, useCredit: authUseCredit, refreshUser } = useAuth();
    const [url, setUrl] = useState('');
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

    // Updated defaults to be empty
    const [rebrand, setRebrand] = useState<RebrandingInfo>({
        logoUrl: '',
        brandName: '',
        websiteLink: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [steps, setSteps] = useState<ConversionStep[]>([
        { id: 'fetch', label: 'Deep Scrape Source', status: 'pending' },
        { id: 'extract', label: 'Asset & Brand Mapping', status: 'pending' },
        { id: 'optimize', label: 'AI Static Reconstruction', status: 'pending' },
        { id: 'finalize', label: 'Full-Width & Hero Fixes', status: 'pending' },
    ]);

    const updateStep = (id: string, status: ConversionStep['status']) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRebrand(prev => ({ ...prev, logoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConvert = async () => {
        if (!url) return;
        if (!user) {
            setError('Please log in to use the converter.');
            return;
        }

        // Check credits
        if (credits !== -1 && credits <= 0) {
            setError('No credits remaining. Please upgrade your plan.');
            return;
        }

        setError(null);
        setGeneratedHtml('');
        setAppState(AppState.FETCHING);
        setSteps(s => s.map(step => ({ ...step, status: 'pending' })));

        let project;
        try {
            // Create project in database
            project = await createProject({
                userId: user.id,
                sourceUrl: url,
                rebrandInfo: rebrand
            });
            setCurrentProjectId(project.id);
            await updateProject(project.id, { status: 'processing' });

            updateStep('fetch', 'loading');
            const rawHtml = await fetchWebsiteHtml(url);
            updateStep('fetch', 'completed');

            updateStep('extract', 'loading');
            setAppState(AppState.CONVERTING);
            await new Promise(r => setTimeout(r, 800));
            updateStep('extract', 'completed');

            updateStep('optimize', 'loading');
            const optimized = await optimizeHtmlForGHL(rawHtml, url, rebrand);
            updateStep('optimize', 'completed');

            updateStep('finalize', 'loading');
            setGeneratedHtml(optimized);
            updateStep('finalize', 'completed');
            setAppState(AppState.COMPLETED);

            // Update project with result
            await updateProject(project.id, {
                status: 'completed',
                outputHtml: optimized,
                completedAt: new Date().toISOString()
            });

            // Use credit
            await authUseCredit();
            await refreshUser();

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during reconstruction.');
            setAppState(AppState.ERROR);
            setSteps(prev => prev.map(s => s.status === 'loading' ? { ...s, status: 'error' } : s));

            // Update project as failed
            if (project?.id) {
                await updateProject(project.id, { status: 'failed' });
            }
        }
    };

    return (
        <div className="flex flex-col items-center overflow-x-hidden">
            <header className="w-full max-w-5xl mb-12 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                    GHL High-Fidelity Cloner v4.5 (Proprietary Static Recon)
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                    Unbreakable <span className="text-blue-500">GHL Designs</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    We use "Static Visual Reconstruction" to clone even the most complex JS-heavy sites.
                    No blank pages. No margin issues. Full branding control.
                </p>
            </header>

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="glass p-6 md:p-8 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
                            <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-xs text-white">1</span>
                            Source Link
                        </h2>
                        <input
                            type="url"
                            placeholder="https://relahq.com/demo/jag"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder:text-slate-600 mb-2"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={appState === AppState.FETCHING || appState === AppState.CONVERTING}
                        />
                        <p className="text-[10px] text-slate-500 px-1 italic">*Complex JS-heavy sites may take up to 60s for full reconstruction.</p>
                    </div>

                    <div className="glass p-6 md:p-8 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-purple-400">
                            <span className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center text-xs text-white">2</span>
                            Identity Override
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2 font-medium">Business Logo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group relative overflow-hidden bg-white"
                                >
                                    {rebrand.logoUrl ? (
                                        <>
                                            <img src={rebrand.logoUrl} alt="Business Logo" className="h-full object-contain p-4" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRebrand(prev => ({ ...prev, logoUrl: '' }));
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors z-10"
                                                title="Remove Logo"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-slate-500 text-sm group-hover:text-blue-400">Upload Logo</p>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </div>
                                <p className="mt-2 text-[10px] text-slate-500 text-center uppercase tracking-widest">Supports PNG, JPG, SVG</p>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2 font-medium">Business Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Business Name"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                                    value={rebrand.brandName}
                                    onChange={(e) => setRebrand(prev => ({ ...prev, brandName: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2 font-medium">Destination URL</label>
                                <input
                                    type="text"
                                    placeholder="https://yourdomain.com"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                                    value={rebrand.websiteLink}
                                    onChange={(e) => setRebrand(prev => ({ ...prev, websiteLink: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 md:p-8 rounded-2xl border border-white/10">
                        <Button
                            onClick={handleConvert}
                            disabled={!url || appState === AppState.FETCHING || appState === AppState.CONVERTING}
                            isLoading={appState === AppState.FETCHING || appState === AppState.CONVERTING}
                            className="w-full py-4 text-lg font-bold tracking-wide"
                        >
                            GENERATE REBRANDED GHL CODE
                        </Button>
                        <div className="mt-8">
                            <StepIndicator steps={steps} />
                        </div>
                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-bounce">
                                <strong>Cloning Error:</strong> {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-7">
                    {appState === AppState.COMPLETED ? (
                        <CodeDisplay code={generatedHtml} />
                    ) : (
                        <div className="h-full min-h-[600px] bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-12 transition-all duration-500">
                            <div className={`mb-6 p-8 rounded-[2.5rem] bg-slate-800 border border-slate-700 shadow-2xl transition-all duration-500 ${appState === AppState.CONVERTING ? 'scale-110 rotate-3 glow' : ''}`}>
                                <svg className={`w-20 h-20 transition-colors duration-500 ${appState === AppState.CONVERTING ? 'text-blue-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-300 mb-3">
                                {appState === AppState.FETCHING || appState === AppState.CONVERTING
                                    ? "AI Architects are Rebuilding UI..."
                                    : "Optimized Output Sandbox"}
                            </h3>
                            <p className="text-slate-500 max-w-sm leading-relaxed">
                                {appState === AppState.CONVERTING
                                    ? "We are currently mapping every visual element. For JS-heavy sites like Rela, we are 'flat-rendering' the components into static HTML/CSS to ensure GHL compatibility."
                                    : `Your high-end cloned design will appear here. Rebranding is currently set to ${rebrand.brandName || "Original Brand"}.`}
                            </p>
                            {appState === AppState.CONVERTING && (
                                <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-[shimmer_1.5s_infinite_linear] w-full" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-24 pb-12 text-slate-600 text-sm flex flex-col items-center gap-2">
                <p>© 2024 Web2One Pro - Advanced High-Fidelity GHL Reconstruction.</p>
                <div className="flex gap-4 text-[10px] uppercase tracking-widest opacity-50">
                    <span>Zero-Margin Engine</span>
                    <span>•</span>
                    <span>Hero-Fix v2</span>
                    <span>•</span>
                    <span>Static Recon v3</span>
                </div>
            </footer>
        </div>
    );
};
