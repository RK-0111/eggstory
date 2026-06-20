import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useRazorpay } from '../hooks/useRazorpay.js';
import { createPaymentOrder, verifyPayment } from '../api/payments.js';
import { formatRupees } from '../utils/format.js';

export default function CartDrawer() {
  const { items, isOpen, totalPaise, setQuantity, removeItem, clearCart, closeCart } = useCart();
  const { openCheckout } = useRazorpay();

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | paying | success
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const updateField = (field) => (e) =>
    setCustomer((c) => ({ ...c, [field]: e.target.value }));

  const canPay =
    items.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim().length >= 10 &&
    status !== 'paying';

  const getAvailablePacks = (product) =>
    typeof product.stock === 'number' ? Math.floor(product.stock / product.packSize) : Infinity;

  const handlePay = async () => {
    setError('');
    setStatus('paying');
    try {
      // 1. Backend creates a Razorpay order and recalculates total server-side.
      const order = await createPaymentOrder(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        customer
      );

      // 2. Razorpay Checkout opens in the browser.
      const paymentResponse = await openCheckout(order, customer);

      // 3. Backend verifies the signature before we trust the payment.
      const result = await verifyPayment(paymentResponse);
      if (!result.verified) throw new Error('Payment could not be verified');

      clearCart();
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      setError(err.message);
    }
  };

  const handleClose = () => {
    if (status === 'success') setStatus('idle');
    closeCart();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={handleClose} />
      <aside className="drawer" role="dialog" aria-label="Shopping cart">
        <div className="drawer-head">
          <h2>{status === 'success' ? 'Order confirmed' : 'Your basket'}</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Close cart">x</button>
        </div>

        <div className="drawer-body">
          {status === 'success' ? (
            <div className="pay-success">
              <div className="tick">OK</div>
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Payment received!</h3>
              <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
                Your eggs are being packed. We&apos;ll reach out on the phone
                number you shared to confirm delivery.
              </p>
            </div>
          ) : items.length === 0 ? (
            <p className="cart-empty">Your basket is empty - go pick a pack!</p>
          ) : (
            items.map(({ product, quantity }) => {
              const availablePacks = getAvailablePacks(product);
              return (
                <div className="cart-item" key={product.id}>
                  <div>
                    <div className="cart-item-name">
                      {product.name} - pack of {product.packSize}
                    </div>
                    <div className="cart-item-meta">
                      {formatRupees(product.pricePaise)} each
                    </div>
                    <button className="remove-link" onClick={() => removeItem(product.id)}>
                      Remove
                    </button>
                  </div>
                  <div className="qty-controls">
                    <button
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity(product.id, Math.min(quantity + 1, availablePacks))}
                      aria-label="Increase quantity"
                      disabled={quantity >= availablePacks}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {status !== 'success' && items.length > 0 && (
          <div className="drawer-foot">
            <div className="total-row">
              <span>Total</span>
              <span>{formatRupees(totalPaise)}</span>
            </div>
            <div className="checkout-form">
              <input
                placeholder="Your name"
                value={customer.name}
                onChange={updateField('name')}
                autoComplete="name"
              />
              <input
                placeholder="Phone number"
                value={customer.phone}
                onChange={updateField('phone')}
                autoComplete="tel"
                inputMode="tel"
              />
              <input
                placeholder="Email (optional)"
                value={customer.email}
                onChange={updateField('email')}
                autoComplete="email"
                type="email"
              />
            </div>
            <button className="pay-btn" disabled={!canPay} onClick={handlePay}>
              {status === 'paying' ? 'Opening secure checkout...' : `Pay ${formatRupees(totalPaise)}`}
            </button>
            {error && <p className="pay-error">{error}</p>}
          </div>
        )}
      </aside>
    </>
  );
}
