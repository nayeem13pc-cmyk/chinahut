'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';
import { Lock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const ok = login(password);
      if (!ok) {
        toast.error('Incorrect password');
        setPassword('');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-brand">
            <Zap size={24} className="text-white" fill="white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">ChinaHut Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Secure access only</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-brand-600" />
            <h2 className="font-semibold text-gray-900">Sign in to Dashboard</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter password"
                required
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}
