'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { CheckoutFormData } from '@/types';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItems === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Order failed');

      clearCart();
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-2">
          Thank you, <strong>{form.name}</strong>! Your order has been received.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          We'll contact you at <strong>{form.phone}</strong> soon.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 mb-4 text-5xl">🛒</p>
        <h1 className="font-display text-2xl font-bold mb-4">No items in cart</h1>
        <Link href="/" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Checkout Form */}
        <div>
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Rahim Uddin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. 01XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="House no., Road, Area, City, District"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Any special instructions?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? 'Placing Order...' : `Place Order — ৳${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Your Order</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    🛍️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-gray-400">×{quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ৳{(product.selling_price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-brand-600">৳{totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                💳 Payment method: Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
