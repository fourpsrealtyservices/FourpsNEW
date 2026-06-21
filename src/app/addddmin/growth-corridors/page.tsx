'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Corridor {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  city: string;
  order: number;
  isActive: boolean;
}

export default function AdminGrowthCorridorsPage() {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Corridor | null>(null);
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', city: 'Hyderabad', order: 0, isActive: true });

  const fetchCorridors = async () => {
    const res = await fetch('/api/admin/growth-corridors');
    const data = await res.json();
    setCorridors(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCorridors(); }, []);

  const resetForm = () => {
    setForm({ title: '', content: '', imageUrl: '', city: 'Hyderabad', order: 0, isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return alert('Title and content are required');
    if (editing) {
      await fetch(`/api/admin/growth-corridors/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/admin/growth-corridors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    resetForm();
    fetchCorridors();
  };

  const handleEdit = (c: Corridor) => {
    setEditing(c);
    setForm({ title: c.title, content: c.content, imageUrl: c.imageUrl, city: c.city, order: c.order, isActive: c.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this growth corridor?')) return;
    await fetch(`/api/admin/growth-corridors/${id}`, { method: 'DELETE' });
    fetchCorridors();
  };

  const toggleActive = async (c: Corridor) => {
    await fetch(`/api/admin/growth-corridors/${c._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    fetchCorridors();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-800">📍 Growth Corridors</h1>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Add Corridor
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Edit Corridor' : 'Add New Corridor'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="e.g. HITEC City & Madhapur" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content / Description *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="Describe this corridor..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm text-gray-700 font-medium">Active (visible on website)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  {editing ? 'Update' : 'Add Corridor'}
                </button>
                <button onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Corridors List */}
        {corridors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No growth corridors added yet.</p>
            <p className="text-sm text-gray-400 mt-2">Add corridors to display on the public Growth Corridors page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {corridors.map((c) => (
              <div key={c._id} className={`bg-white rounded-xl border p-5 flex gap-4 ${!c.isActive ? 'opacity-60' : ''}`}>
                {c.imageUrl && (
                  <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{c.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-xs text-gray-400">Order: {c.order}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1">City: {c.city}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(c)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200">Edit</button>
                  <button onClick={() => toggleActive(c)} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded hover:bg-amber-200">
                    {c.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
