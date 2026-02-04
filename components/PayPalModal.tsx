import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Shield, Zap } from 'lucide-react';
import { Plan, PlanType } from '../types';
import { loadPayPalScript, getPayPalClientId } from '../services/paypalService';
import { updateUser, updateUserPlan, createPayment, createSubscription } from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

interface PayPalModalProps {
    plan: Plan;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode?: 'subscription' | 'credits';
}

export const PayPalModal: React.FC<PayPalModalProps> = ({ plan, isOpen, onClose, onSuccess, mode = 'subscription' }) => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const paypalContainerRef = useRef<HTMLDivElement>(null);
    const buttonRendered = useRef(false);

    useEffect(() => {
        if (isOpen && !buttonRendered.current) {
            initPayPal();
        }

        return () => {
            // Cleanup PayPal buttons on unmount
            if (paypalContainerRef.current) {
                paypalContainerRef.current.innerHTML = '';
            }
            buttonRendered.current = false;
        };
    }, [isOpen]);

    const initPayPal = async () => {
        try {
            setLoading(true);
            setError(null);
            await loadPayPalScript();

            const paypal = (window as any).paypal;
            if (!paypal || !paypalContainerRef.current) {
                throw new Error('PayPal SDK failed to load');
            }

            // Clear previous buttons
            paypalContainerRef.current.innerHTML = '';

            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: (data: any, actions: any) => {
                    return actions.order.create({
                        purchase_units: [{
                            description: mode === 'credits'
                                ? `Web2One Credits - ${plan.name}`
                                : `Web2One ${plan.name} Plan - Monthly Subscription`,
                            amount: {
                                currency_code: 'USD',
                                value: plan.price.toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: async (data: any, actions: any) => {
                    try {
                        const order = await actions.order.capture();

                        // Update user plan in database
                        if (user) {
                            if (mode === 'credits') {
                                // Add credits to existing balance
                                const currentCredits = user.credits === -1 ? 0 : user.credits;
                                await updateUser(user.id, {
                                    credits: currentCredits + plan.credits
                                });
                            } else {
                                // Update Plan logic
                                await updateUserPlan(user.id, plan.id);

                                // Create subscription record
                                await createSubscription({
                                    userId: user.id,
                                    planId: plan.id,
                                    status: 'active',
                                    paypalSubscriptionId: order.id,
                                    autoRenew: true
                                });
                            }

                            // Create payment record (for all types)
                            await createPayment({
                                userId: user.id,
                                amount: plan.price,
                                planId: plan.id,
                                paypalTransactionId: order.id,
                                status: 'completed'
                            });

                            await refreshUser();
                        }

                        setPaymentComplete(true);
                        setTimeout(() => {
                            onSuccess();
                            onClose();
                        }, 2000);
                    } catch (err) {
                        setError('Payment processing failed. Please try again.');
                    }
                },
                onError: (err: any) => {
                    console.error('PayPal Error:', err);
                    setError('Payment failed. Please try again or contact support.');
                },
                onCancel: () => {
                    setError('Payment was cancelled.');
                }
            }).render(paypalContainerRef.current);

            buttonRendered.current = true;
            setLoading(false);
        } catch (err) {
            console.error('PayPal Init Error:', err);
            setError('Failed to load payment system. Please refresh and try again.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-white" />
                            <span className="text-white font-bold">Secure Checkout</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{plan.name} Plan</h2>
                    <p className="text-white/80">
                        ${plan.price}/month • {plan.credits === -1 ? 'Unlimited' : `${plan.credits}`} conversions
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {paymentComplete ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                            <p className="text-slate-400">Your account has been upgraded to {plan.name}</p>
                        </div>
                    ) : (
                        <>
                            {/* Plan Features */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-slate-400 mb-3">What's included:</h4>
                                <ul className="space-y-2">
                                    {plan.features.slice(0, 4).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                            <Check className="w-4 h-4 text-emerald-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* PayPal Button Container */}
                            <div className="relative min-h-[150px]">
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                                <div ref={paypalContainerRef}></div>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Security Notice */}
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                <Shield className="w-4 h-4" />
                                <span>Secured by PayPal. Cancel anytime.</span>
                            </div>
                        </>
                    )}
                </div>

                <style>{`
                    @keyframes scale-in {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-scale-in {
                        animation: scale-in 0.2s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default PayPalModal;
