import { useCallback } from 'react';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/** Loads the Razorpay checkout script once and returns an opener function. */
function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load Razorpay checkout'));
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  /**
   * @param order    response from /api/payments/create-order
   * @param customer { name, email, phone }
   * @returns Promise resolving with Razorpay's payment response,
   *          or rejecting if the user closes the window / payment fails.
   */
  const openCheckout = useCallback(async (order, customer) => {
    await loadScript();

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'The Daily Yolk',
        description: 'Farm fresh eggs',
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: '#F0A529' },
        handler: (response) => resolve(response),
        modal: {
          ondismiss: () => reject(new Error('Payment window closed')),
        },
      });
      rzp.on('payment.failed', (response) =>
        reject(new Error(response.error?.description || 'Payment failed'))
      );
      rzp.open();
    });
  }, []);

  return { openCheckout };
}
