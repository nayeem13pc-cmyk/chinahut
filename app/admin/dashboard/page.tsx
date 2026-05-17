'use client';

import { useEffect, useState } from 'react';
import {
  ShoppingBag, TrendingUp, Users, Package,
  DollarSign, Repeat, Truck, CheckCircle,
} from 'lucide-react';
import type { DashboardStats } from '@/types';

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color === 'text-brand-600' ? 'bg-brand-50' : 'bg-gray-50'}`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-5 h-24 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-400">
        Failed to load dashboard stats. Check your Supabase connection.
      </div>
    );
  }

  const profitMargin =
    stats.total_revenue > 0
      ? ((stats.net_profit / stats.total_revenue) * 100).toFixed(1)
      : '0';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time overview of your store</p>
      </div>

      {/* ── Revenue & Profit (Top cards) ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-brand-200 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">৳{Number(stats.total_revenue).toFixed(2)}</p>
              <p className="text-brand-200 text-xs mt-1">From delivered orders</p>
            </div>
            <DollarSign size={24} className="text-brand-300" />
          </div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Net Profit</p>
              <p className="text-3xl font-bold mt-1 text-green-700">
                ৳{Number(stats.net_profit).toFixed(2)}
              </p>
              <p className="text-green-500 text-xs mt-1">Margin: {profitMargin}%</p>
            </div>
            <TrendingUp size={24} className="text-green-500" />
          </div>
        </div>

        {/* Profit Calculator Display */}
        <div className="card p-5">
          <p className="text-sm text-gray-500 font-medium mb-3">Profit Breakdown</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold text-gray-900">
                ৳{Number(stats.total_revenue).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cost</span>
              <span className="font-semibold text-red-500">
                − ৳{(Number(stats.total_revenue) - Number(stats.net_profit)).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
              <span className="text-gray-900">Net Profit</span>
              <span className="text-green-600">৳{Number(stats.net_profit).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Status Cards ────────────────────────── */}
      <h2 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
        Order Status
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="New Orders"
          value={stats.new_orders}
          icon={ShoppingBag}
          color="text-blue-600"
          sub="Awaiting processing"
        />
        <StatCard
          label="In Delivery"
          value={stats.in_delivery_orders}
          icon={Truck}
          color="text-amber-600"
          sub="Out for delivery"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered_orders}
          icon={CheckCircle}
          color="text-green-600"
          sub="Completed orders"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled_orders}
          icon={Package}
          color="text-red-500"
          sub="Cancelled orders"
        />
      </div>

      {/* ── Customer & Product Stats ─────────────────── */}
      <h2 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
        Customers & Inventory
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Customers"
          value={stats.total_customers}
          icon={Users}
          color="text-purple-600"
        />
        <StatCard
          label="Repeat Customers"
          value={stats.repeat_customers}
          icon={Repeat}
          color="text-brand-600"
          sub="2+ purchases"
        />
        <StatCard
          label="Active Products"
          value={stats.active_products}
          icon={Package}
          color="text-gray-700"
        />
      </div>
    </div>
  );
}
