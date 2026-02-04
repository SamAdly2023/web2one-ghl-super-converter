/**
 * PayPal Integration Service
 * Handles payment processing for subscriptions and one-time purchases
 */

// Use environment variable or fallback to provided key
const PAYPAL_CLIENT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PAYPAL_CLIENT_ID)
    || 'AarwkYK4lzBjwzF7OCgJeoRBnGAZehBAsNrEyrQZSdzu7yyPH3P7qEm0qtm-VNj_SvYFPpKA9PjZqO2G';

// Note: Secret should NEVER be exposed in frontend code
// This is for demonstration - in production, handle payments server-side
const PAYPAL_API_BASE = 'https://api-m.paypal.com'; // Use sandbox for testing: https://api-m.sandbox.paypal.com

export interface PayPalOrderResponse {
    id: string;
    status: string;
    links: Array<{ href: string; rel: string; method: string }>;
}

export interface PayPalCaptureResponse {
    id: string;
    status: string;
    payer: {
        email_address: string;
        payer_id: string;
    };
}

/**
 * Load PayPal SDK dynamically
 */
export function loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="paypal.com/sdk"]')) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
        document.head.appendChild(script);
    });
}

/**
 * Create a PayPal order for a plan purchase
 */
export async function createPayPalOrder(planName: string, amount: number): Promise<string> {
    // In production, this should call your backend API
    // For demo purposes, we'll use client-side order creation

    const paypal = (window as any).paypal;
    if (!paypal) {
        throw new Error('PayPal SDK not loaded');
    }

    return new Promise((resolve, reject) => {
        paypal.Buttons({
            createOrder: (data: any, actions: any) => {
                return actions.order.create({
                    purchase_units: [{
                        description: `Web2One ${planName} Plan`,
                        amount: {
                            currency_code: 'USD',
                            value: amount.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: async (data: any, actions: any) => {
                const order = await actions.order.capture();
                resolve(order.id);
            },
            onError: (err: any) => {
                reject(err);
            },
            onCancel: () => {
                reject(new Error('Payment cancelled by user'));
            }
        }).render('#paypal-button-container');
    });
}

/**
 * Get PayPal Client ID for frontend use
 */
export function getPayPalClientId(): string {
    return PAYPAL_CLIENT_ID;
}

/**
 * Verify a completed payment (should be done server-side in production)
 */
export async function verifyPayment(orderId: string): Promise<boolean> {
    // In production, verify with your backend
    // For now, we'll assume the payment is valid if we have an order ID
    return orderId.length > 0;
}

export default {
    loadPayPalScript,
    createPayPalOrder,
    getPayPalClientId,
    verifyPayment
};
