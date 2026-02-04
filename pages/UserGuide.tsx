import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, ChevronRight, ChevronDown, Play, Copy, Check,
    Globe, Sparkles, Download, Palette, Layers, Zap,
    ArrowRight, HelpCircle, MessageCircle, Mail
} from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export const UserGuide: React.FC = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [copiedStep, setCopiedStep] = useState<number | null>(null);

    const steps = [
        {
            title: "Enter the Website URL",
            description: "Copy the URL of any website you want to clone. This can be any public website - a competitor's landing page, a template you admire, or an award-winning design.",
            tips: [
                "Make sure the URL is complete (includes https://)",
                "The site must be publicly accessible",
                "Works best with static or semi-static pages"
            ],
            code: "https://example.com/beautiful-landing-page"
        },
        {
            title: "Configure Rebranding (Optional)",
            description: "Customize the clone with your own branding. Upload your logo, enter your brand name, and specify where you want all buttons and links to point to.",
            tips: [
                "Logo can be a URL or uploaded file",
                "Brand name will replace all instances of the original",
                "Website link updates CTAs and navigation"
            ],
            code: null
        },
        {
            title: "Start the AI Conversion",
            description: "Click 'Clone This Site' and watch our AI work its magic. The system will deep-scrape the source, extract assets, and reconstruct it as clean, static HTML optimized for GHL.",
            tips: [
                "Process takes 15-60 seconds depending on complexity",
                "Complex sites may require more processing time",
                "One credit is used per successful conversion"
            ],
            code: null
        },
        {
            title: "Copy and Paste into GHL",
            description: "Once complete, copy the generated HTML code. In your GoHighLevel funnel builder, add a 'Custom HTML' element and paste the code directly.",
            tips: [
                "Use the 'Copy Code' button for one-click copying",
                "Paste into a full-width section for best results",
                "The code includes our proprietary CSS fixes"
            ],
            code: `<div id="ghl-clone-container">
  <!-- Your cloned content here -->
  <style>
    * { box-sizing: border-box !important; }
    body, html { margin: 0 !important; padding: 0 !important; }
    /* ... more optimizations */
  </style>
</div>`
        }
    ];

    const faqs: FAQItem[] = [
        {
            question: "What types of websites can I clone?",
            answer: "Web2One works with most public websites including landing pages, portfolios, agency sites, and marketing pages. It's specially optimized for converting JavaScript-heavy sites (React, Vue, Next.js) into static HTML that works perfectly in GHL. However, it cannot clone password-protected pages, dynamic web apps with user authentication, or sites with aggressive anti-scraping measures."
        },
        {
            question: "Will the clone look exactly like the original?",
            answer: "Our AI aims for high-fidelity reconstruction, typically achieving 90-95% visual accuracy. Some elements like complex animations, custom JavaScript functionality, or backend-dependent features may not transfer. The focus is on preserving the visual design and layout while ensuring GHL compatibility."
        },
        {
            question: "How do credits work?",
            answer: "Each successful conversion uses one credit. Failed conversions don't consume credits. Free accounts get 2 credits to try the service. Starter plans include 10 credits per month, while Pro and Agency plans offer unlimited conversions."
        },
        {
            question: "Is this legal?",
            answer: "Web2One is a tool for legitimate use cases like recreating designs with permission, cloning your own sites, or using sites as inspiration with proper rebranding. Users are responsible for ensuring they have the right to clone and use any website content. We recommend using it for sites you own, have permission to clone, or as a starting point for creating original designs."
        },
        {
            question: "Why is my cloned page showing blank in GHL?",
            answer: "This is usually caused by JavaScript-heavy sites that render content dynamically. Our AI attempts to reconstruct these as static HTML, but some sites may be too complex. Try enabling 'Deep Reconstruction Mode' in advanced settings, or contact support for assistance with specific sites."
        },
        {
            question: "Can I edit the generated code?",
            answer: "Absolutely! The generated HTML/CSS is standard code that you can edit in any text editor or directly in GHL's custom code blocks. You can modify colors, text, images, and layout as needed. The code is well-structured and includes comments for easy navigation."
        },
        {
            question: "What's included in the Pro plan?",
            answer: "Pro includes unlimited conversions, priority processing, advanced rebranding tools, API access for automation, white-label exports without Web2One branding, and 24/7 priority support. It's perfect for agencies handling multiple client projects."
        },
        {
            question: "Do you offer refunds?",
            answer: "Yes, we offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with the service, contact support within 7 days of purchase for a full refund. We want you to be completely happy with Web2One."
        }
    ];

    const handleCopyCode = (stepIndex: number, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedStep(stepIndex);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">USER GUIDE</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            How to Clone Any Website for GHL
                        </h1>
                        <p className="text-xl text-slate-400">
                            Follow this step-by-step guide to transform any website into a
                            GoHighLevel-ready landing page in minutes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Video Tutorial */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="aspect-video bg-slate-800 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-700 transition-colors">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                    <p className="text-slate-400">Watch the 3-minute tutorial</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step by Step Guide */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Step-by-Step Instructions</h2>

                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-800"></div>
                                    )}

                                    <div className="flex gap-6">
                                        {/* Step Number */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
                                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                            <p className="text-slate-400 mb-4">{step.description}</p>

                                            {/* Tips */}
                                            <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                                                <div className="text-sm font-medium text-blue-400 mb-2">💡 Pro Tips:</div>
                                                <ul className="space-y-1">
                                                    {step.tips.map((tip, tipIndex) => (
                                                        <li key={tipIndex} className="text-slate-300 text-sm flex items-start gap-2">
                                                            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Code Example */}
                                            {step.code && (
                                                <div className="relative">
                                                    <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                                                        <pre>{step.code}</pre>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopyCode(index, step.code!)}
                                                        className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        {copiedStep === index ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Breakdown */}
            <section className="py-16 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Understanding the Features</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: Globe,
                                    title: "Deep Scraping",
                                    description: "Our system fetches the complete HTML, CSS, and asset structure from any public URL using multiple proxy fallbacks."
                                },
                                {
                                    icon: Sparkles,
                                    title: "AI Reconstruction",
                                    description: "Gemini AI analyzes the page structure and rebuilds JavaScript-rendered content as static, portable HTML."
                                },
                                {
                                    icon: Palette,
                                    title: "Rebranding Engine",
                                    description: "Automatically finds and replaces logos, brand names, and links throughout the cloned page."
                                },
                                {
                                    icon: Layers,
                                    title: "GHL Optimization",
                                    description: "Special CSS injection ensures full-width layouts, no margin issues, and perfect rendering in GHL builders."
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                                    >
                                        <span className="font-medium text-white">{faq.question}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-4">
                                            <p className="text-slate-400">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Support CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Still Need Help?</h3>
                                <p className="text-white/80">Our support team is here to help you succeed.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    Live Chat
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                                    <Mail className="w-5 h-5" />
                                    Email Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Start CTA */}
            <section className="py-16 border-t border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Cloning?</h2>
                    <p className="text-slate-400 mb-8">Create your first high-fidelity clone in under 60 seconds.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>
        </div>
    );
};
