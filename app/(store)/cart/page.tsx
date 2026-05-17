'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();

  if (totalItems === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Start adding some amazing products!</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart ({totalItems} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🛍️
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
                <p className="text-brand-600 font-bold mt-1">
                  ৳{product.selling_price.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQty(product.id, quantity - 1)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 text-sm font-semibold min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQty(product.id, quantity + 1)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock_count}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <p className="font-bold text-gray-900">
                  ৳{(product.selling_price * quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(product.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm text-gray-600 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between">
                  <span className="truncate mr-2">{product.name} ×{quantity}</span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    ৳{(product.selling_price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-brand-600">৳{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <Link
              href="/"
              className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
