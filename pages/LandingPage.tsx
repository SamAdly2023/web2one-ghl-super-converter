import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../types';
import {
    Zap, Shield, Rocket, Globe, Star, Check, ChevronRight,
    ArrowRight, Users, Award, Clock, Sparkles, Play,
    MousePointer, Layers, Palette, Code2, Download
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Agency Owner",
            company: "Digital Spark Agency",
            image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff",
            text: "Web2One saved us hundreds of hours. We used to spend 3-4 days recreating landing pages for clients. Now it takes 30 seconds. Absolute game-changer for our GHL agency."
        },
        {
            name: "Marcus Chen",
            role: "Marketing Director",
            company: "GrowthLab",
            image: "https://ui-avatars.com/api/?name=Marcus+Chen&background=10b981&color=fff",
            text: "The AI reconstruction is incredible. Even complex React sites come out perfectly. Our clients think we hired a full development team. Worth every penny."
        },
        {
            name: "Emily Rodriguez",
            role: "Funnel Specialist",
            company: "Convert Pro",
            image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=f59e0b&color=fff",
            text: "I've tried every GHL cloning tool out there. Web2One is the only one that handles modern websites without breaking. The full-width fix alone is worth the subscription."
        }
    ];

    const features = [
        {
            icon: Globe,
            title: "Clone Any Website",
            description: "Enter any URL and our AI extracts every visual element, style, and asset automatically."
        },
        {
            icon: Sparkles,
            title: "AI-Powered Reconstruction",
            description: "Gemini AI intelligently rebuilds JS-heavy sites as static, GHL-compatible HTML."
        },
        {
            icon: Palette,
            title: "Instant Rebranding",
            description: "Replace logos, colors, and links in one click. Your brand, their design."
        },
        {
            icon: Layers,
            title: "Full-Width Perfect",
            description: "Our proprietary CSS injection ensures perfect full-width layouts every time."
        },
        {
            icon: Code2,
            title: "Clean Code Output",
            description: "Production-ready HTML/CSS that passes validation and loads lightning fast."
        },
        {
            icon: Download,
            title: "One-Click Export",
            description: "Copy to clipboard or download. Paste directly into your GHL page builder."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Hero Section - Inspired by LinkAuthority */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
                    {/* Network lines effect */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    {/* Glowing orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: Math.random() * 0.5 + 0.2
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center pt-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-8 animate-fade-in">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-blue-400 text-sm font-medium">THE #1 GHL WEBSITE CLONING TOOL</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                        <span className="text-white">Clone Premium Sites</span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
                            Import to GHL Instantly
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Stop wasting hours rebuilding landing pages manually. Our AI-powered tool
                        transforms <span className="text-white font-semibold">any website</span> into
                        GoHighLevel-ready code in <span className="text-blue-400 font-semibold">30 seconds</span>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <button
                            onClick={() => navigate(user ? '/dashboard' : '/login')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-lg font-bold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            <span className="flex items-center gap-2">
                                Start Cloning Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            See How It Works
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Social Proof Bar */}
                    <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-3">
                                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold"
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <span className="ml-2">2,500+ Users</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <span>4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-blue-400" />
                            <span>50,000+ Sites Cloned</span>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <MousePointer className="w-6 h-6 text-slate-500" />
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-16 border-y border-slate-800 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <p className="text-center text-slate-500 mb-8 uppercase tracking-wider text-sm">Trusted by leading GHL agencies worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
                        {['TechScale', 'GrowthIO', 'FunnelPro', 'ConvertX', 'LeadGen+', 'ScaleForce'].map((name, i) => (
                            <div key={i} className="text-2xl font-bold text-slate-400">{name}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24" id="features">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">POWERFUL FEATURES</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need to Clone Like a Pro</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Built specifically for GoHighLevel agencies who demand perfection.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-slate-900/50" id="how-it-works">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
                            <Rocket className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-medium">SIMPLE PROCESS</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Clone Any Site in 3 Easy Steps</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { step: "01", title: "Paste the URL", desc: "Enter any website URL you want to clone. Our system handles the rest." },
                            { step: "02", title: "AI Magic", desc: "Our Gemini AI analyzes and reconstructs the site as clean, static HTML." },
                            { step: "03", title: "Export to GHL", desc: "Copy the code and paste directly into your GoHighLevel page builder." }
                        ].map((item, i) => (
                            <div key={i} className="relative text-center">
                                <div className="text-8xl font-black text-slate-800 mb-4">{item.step}</div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-12 -right-4 text-slate-700">
                                        <ArrowRight className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24" id="pricing">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-medium">SIMPLE PRICING</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Start free, upgrade when you're ready. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-2xl p-8 transition-all ${plan.popular
                                    ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-2 border-blue-400 scale-105 shadow-2xl shadow-blue-500/25'
                                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-black text-sm font-bold rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-5xl font-black">${plan.price}</span>
                                    {plan.price > 0 && <span className="text-slate-400">/mo</span>}
                                </div>
                                <p className="text-sm text-slate-300 mb-6">
                                    {plan.credits === -1 ? 'Unlimited conversions' : `${plan.credits} conversions`}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <Check className={`w-4 h-4 ${plan.popular ? 'text-white' : 'text-emerald-400'}`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => navigate('/login')}
                                    className={`w-full py-3 rounded-lg font-bold transition-all ${plan.popular
                                        ? 'bg-white text-blue-600 hover:bg-slate-100'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-6">
                            <Users className="w-4 h-4 text-pink-400" />
                            <span className="text-pink-400 text-sm font-medium">TESTIMONIALS</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Loved by GHL Agencies</h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <img
                                    src={testimonials[activeTestimonial].image}
                                    alt={testimonials[activeTestimonial].name}
                                    className="w-24 h-24 rounded-full"
                                />
                                <div>
                                    <div className="flex text-yellow-400 mb-4">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-xl text-slate-300 mb-6 italic">
                                        "{testimonials[activeTestimonial].text}"
                                    </p>
                                    <div>
                                        <div className="font-bold">{testimonials[activeTestimonial].name}</div>
                                        <div className="text-slate-400 text-sm">
                                            {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`w-3 h-3 rounded-full transition-all ${i === activeTestimonial ? 'bg-blue-500 w-8' : 'bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>

                        <div className="relative px-8 py-16 md:py-24 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to Clone Your First Site?
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                                Join thousands of GHL agencies saving hours on every project. Start with 2 free conversions.
                            </p>
                            <button
                                onClick={() => navigate(user ? '/dashboard' : '/login')}
                                className="group px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-bold hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-white/60 mt-4 text-sm">No credit card required</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-2xl font-bold">
                            <span className="text-blue-500">Web2One</span>
                        </div>
                        <div className="flex gap-8 text-slate-400">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <button onClick={() => navigate('/guide')} className="hover:text-white transition-colors">User Guide</button>
                            <a href="mailto:support@web2one.com" className="hover:text-white transition-colors">Support</a>
                        </div>
                        <div className="text-slate-500 text-sm">
                            © 2026 Web2One. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
