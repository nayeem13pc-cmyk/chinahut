'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { Order, OrderStatus } from '@/types';
import { Clock, Truck, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; color: string }> = {
  new:         { label: 'New Order',    icon: Clock,         color: 'status-new' },
  in_delivery: { label: 'In Delivery',  icon: Truck,         color: 'status-in_delivery' },
  delivered:   { label: 'Delivered',    icon: CheckCircle,   color: 'status-delivered' },
  cancelled:   { label: 'Cancelled',    icon: XCircle,       color: 'status-cancelled' },
};

const ALL_STATUSES: OrderStatus[] = ['new', 'in_delivery', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/orders' : `/api/orders?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Order status updated!');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} orders</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {s === 'all' ? 'All Orders' : STATUS_CONFIG[s as OrderStatus].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 h-20 skeleton" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;

            return (
              <div key={order.id} className="card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`badge ${cfg.color} flex items-center gap-1`}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-800 mt-1">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">📞 {order.customer_phone}</p>
                    <p className="text-xs text-gray-400 truncate">📍 {order.customer_address}</p>

                    {order.items && order.items.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {order.items.length} item(s):{' '}
                        {order.items.map(i => `${i.product_name} ×${i.quantity}`).join(', ')}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-BD', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Amount + Status control */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                    <p className="text-lg font-bold text-gray-900">
                      ৳{Number(order.total_amount).toFixed(2)}
                    </p>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer hover:border-brand-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50"
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
