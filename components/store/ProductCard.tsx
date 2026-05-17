'use client';

import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.stock_count === 0) return;
    addItem(product);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock_count === 0;

  return (
    <div className="card group flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🛍️
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <p className="text-lg font-bold text-brand-600">
              ৳{product.selling_price.toFixed(2)}
            </p>
            {product.stock_count > 0 && product.stock_count <= 10 && (
              <p className="text-xs text-amber-600">Only {product.stock_count} left!</p>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || added}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white'
                : isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand'
            }`}
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
