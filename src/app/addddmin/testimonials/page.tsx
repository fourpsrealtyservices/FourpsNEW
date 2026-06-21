'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  text: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: '', role: '', text: '', imageUrl: '', order: 0, isActive: true });
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = () => {
    fetch('/api/admin/testimonials').then(r => r.json()).then(data => { setTestimonials(data); setLoading(false); });
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const resetForm = () => { setForm({ name: '', role: '', text: '', imageUrl: '', order: 0, isActive: true }); setEditing(null); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setForm({ ...form, imageUrl: data.url });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/testimonials/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    resetForm();
    fetchTestimonials();
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role, text: t.text, imageUrl: t.imageUrl, order: t.order, isActive: t.isActive });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchTestimonials();
  };

  const toggleActive = async (t: Testimonial) => {
    await fetch(`/api/admin/testimonials/${t._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !t.isActive }) });
    fetchTestimonials();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Testimonials</h1>
          <p className="text-sm text-gray-500">Manage testimonials shown on the homepage</p>
        </div>
        <Link href="/addddmin" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">{editing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Client Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rajesh Kumar" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Role / Company *</label>
            <input type="text" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. CEO, TechStart Solutions" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Testimonial Text *</label>
            <textarea required value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={3} placeholder="What the client said..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Photo (Optional)</label>
            <div className="flex items-center gap-3">
              {form.imageUrl && <img src={form.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover border" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-600" />
              {uploading && <span className="text-xs text-blue-600">Uploading...</span>}
            </div>
            <input type="text" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="Or paste image URL" className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-300" />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer pb-1">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">{editing ? 'Update' : 'Add Testimonial'}</button>
          {editing && <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-8"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No testimonials yet. Add one above.</p>
      ) : (
        <div className="space-y-4">
          {testimonials.map(t => (
            <div key={t._id} className={`bg-white rounded-xl border p-5 flex gap-4 items-start ${t.isActive ? 'border-gray-200' : 'border-orange-200 bg-orange-50/50'}`}>
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.name} className="w-14 h-14 rounded-full object-cover border flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">👤</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                  {!t.isActive && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">Hidden</span>}
                  <span className="text-xs text-gray-400">Order: {t.order}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{t.role}</p>
                <p className="text-sm text-gray-600 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${t.isActive ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                  {t.isActive ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => handleEdit(t)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">Edit</button>
                <button onClick={() => handleDelete(t._id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
