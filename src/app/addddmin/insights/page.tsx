'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Insight { _id: string; title: string; tag: string; content: string; imageUrl: string; order: number; isActive: boolean; }

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Insight | null>(null);
  const [form, setForm] = useState({ title: '', tag: 'Insights', content: '', imageUrl: '', order: 0, isActive: true });
  const [uploading, setUploading] = useState(false);

  const fetchInsights = () => { fetch('/api/admin/insights').then(r => r.json()).then(d => { setInsights(d); setLoading(false); }); };
  useEffect(fetchInsights, []);

  const resetForm = () => { setForm({ title: '', tag: 'Insights', content: '', imageUrl: '', order: 0, isActive: true }); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/insights/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/admin/insights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    resetForm();
    fetchInsights();
  };

  const handleEdit = (i: Insight) => { setEditing(i); setForm({ title: i.title, tag: i.tag, content: i.content, imageUrl: i.imageUrl, order: i.order, isActive: i.isActive }); };
  const handleDelete = async (id: string) => { if (confirm('Delete this insight?')) { await fetch(`/api/admin/insights/${id}`, { method: 'DELETE' }); fetchInsights(); } };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try { const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json(); if (r.ok) setForm({ ...form, imageUrl: d.url }); } catch { alert('Upload failed'); }
    setUploading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-800">📰 Market Insights</h1>
          </div>
          <span className="text-sm text-gray-500">{insights.length} insights</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 mb-8 space-y-4">
          <h3 className="font-semibold text-gray-800">{editing ? '✏️ Edit Insight' : '➕ Add New Insight'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title *" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-4 py-3 border rounded-lg text-sm text-gray-800" />
            <input type="text" placeholder="Tag (e.g. Market Trends, Guide, Insights)" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="px-4 py-3 border rounded-lg text-sm text-gray-800" />
          </div>
          <textarea placeholder="Content * (supports markdown-style ## headings and **bold**)" required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-4 py-3 border rounded-lg text-sm text-gray-800 font-mono" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cover Image</label>
              <div className="flex items-center gap-2">
                {form.imageUrl && <img src={form.imageUrl} alt="" className="w-12 h-12 rounded object-cover border" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                {uploading && <span className="text-xs text-blue-600">Uploading...</span>}
              </div>
              <input type="text" placeholder="or paste image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-xs text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 border rounded-lg text-sm text-gray-800" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">{editing ? 'Update' : 'Create'} Insight</button>
            {editing && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium">Cancel</button>}
          </div>
        </form>

        {/* List */}
        <div className="space-y-3">
          {insights.map(insight => (
            <div key={insight._id} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
              {insight.imageUrl && <img src={insight.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{insight.tag}</span>
                  {!insight.isActive && <span className="text-xs text-red-500 font-medium">Hidden</span>}
                  <span className="text-xs text-gray-400">Order: {insight.order}</span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm truncate">{insight.title}</h4>
                <p className="text-xs text-gray-500 truncate">{insight.content.substring(0, 100)}...</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(insight)} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(insight._id)} className="text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {insights.length === 0 && <p className="text-center text-gray-400 py-8">No insights yet. Add one above.</p>}
        </div>
      </main>
    </div>
  );
}
