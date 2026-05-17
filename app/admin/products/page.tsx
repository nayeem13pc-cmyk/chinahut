'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import type { Product, Category } from '@/types';

const EMPTY_FORM = {
  name: '',
  description: '',
  category_id: '',
  cost_price: '',
  selling_price: '',
  stock_count: '',
  image_url: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAll = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetch('/api/products?all=true'),
      fetch('/api/admin/stats').then(() => null), // just trigger revalidate
    ]);

    const prodData = await prodRes.json();
    setProducts(prodData.products || []);

    // Fetch categories directly from supabase-exposed endpoint
    const catRes2 = await fetch('/api/products?all=true&cats=true');
    // Actually get categories via a simple trick
    const catResponse = await fetch('/api/admin/categories');
    if (catResponse.ok) {
      const catData = await catResponse.json();
      setCategories(catData.categories || []);
    }

    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const profit = (() => {
    const sp = parseFloat(form.selling_price);
    const cp = parseFloat(form.cost_price);
    if (!isNaN(sp) && !isNaN(cp)) return (sp - cp).toFixed(2);
    return null;
  })();

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || '',
      category_id: p.category_id || '',
      cost_price: String(p.cost_price),
      selling_price: String(p.selling_price),
      stock_count: String(p.stock_count),
      image_url: p.image_url || '',
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.selling_price || !form.cost_price) {
      toast.error('Name, cost price, and selling price are required');
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Save failed');
      toast.success(editingId ? 'Product updated!' : 'Product added!');
      setShowForm(false);
      fetchAll();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Product deactivated');
      fetchAll();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.filter(p => p.is_active).length} active products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-display text-lg font-bold">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Wireless Earbuds Pro" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category_id" value={form.category_id} onChange={handleChange} className="input-field">
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="Short product description..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (৳) *</label>
                  <input name="cost_price" type="number" step="0.01" min="0" value={form.cost_price} onChange={handleChange} className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (৳) *</label>
                  <input name="selling_price" type="number" step="0.01" min="0" value={form.selling_price} onChange={handleChange} className="input-field" placeholder="0.00" />
                </div>
              </div>

              {/* Live Profit Preview */}
              {profit !== null && (
                <div className={`rounded-xl p-3 text-sm font-semibold flex justify-between ${parseFloat(profit) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <span>Profit per unit:</span>
                  <span>৳{profit} {parseFloat(profit) >= 0 ? '✅' : '⚠️ Loss!'}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                <input name="stock_count" type="number" min="0" value={form.stock_count} onChange={handleChange} className="input-field" placeholder="0" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input name="image_url" type="url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-16 skeleton" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Cost</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Profit</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const profitUnit = p.selling_price - p.cost_price;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500">{p.category?.name || '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-600">৳{Number(p.cost_price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">৳{Number(p.selling_price).toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${profitUnit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ৳{profitUnit.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${p.stock_count === 0 ? 'text-red-500' : p.stock_count <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {p.stock_count}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`badge ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-brand-600 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
