'use client';

import { useEffect, useState } from 'react';
import { Users, Repeat, Star } from 'lucide-react';
import type { Customer } from '@/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRepeatOnly, setShowRepeatOnly] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const url = showRepeatOnly ? '/api/customers?repeat=true' : '/api/customers';
    const res = await fetch(url);
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, [showRepeatOnly]);

  const repeatCount = customers.filter(c => c.purchase_count >= 2).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Customer CRM</h1>
          <p className="text-gray-500 text-sm">
            {customers.length} customers &nbsp;·&nbsp;
            <span className="text-brand-600 font-medium">{repeatCount} repeat buyers</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRepeatOnly(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !showRepeatOnly ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Users size={12} className="inline mr-1" />
            All Customers
          </button>
          <button
            onClick={() => setShowRepeatOnly(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              showRepeatOnly ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Repeat size={12} className="inline mr-1" />
            Repeat Only
          </button>
        </div>
      </div>

      {showRepeatOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Star size={18} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Repeat Customer List</strong> — These customers have placed 2 or more orders. 
            Consider offering them loyalty discounts or early access to new products!
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card h-16 skeleton" />)}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">No customers yet</p>
          <p className="text-sm">Customers will appear here once they place orders</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Orders</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Total Spent</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Last Order</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400 max-w-[160px] truncate">{c.address || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${c.purchase_count >= 2 ? 'text-brand-600' : 'text-gray-700'}`}>
                        {c.purchase_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ৳{Number(c.total_spent).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {c.last_order_at
                        ? new Date(c.last_order_at).toLocaleDateString('en-BD', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.purchase_count >= 2 ? (
                        <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1 justify-center">
                          <Star size={10} fill="currentColor" /> Repeat
                        </span>
                      ) : (
                        <span className="badge bg-blue-100 text-blue-700">New</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
