'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface City {
  _id: string;
  name: string;
  state: string;
  status: 'active' | 'coming_soon' | 'hidden';
  displayOrder: number;
}

export default function CityManagementPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [form, setForm] = useState({ name: '', state: '', status: 'active', displayOrder: 0 });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const res = await fetch('/api/admin/cities');
    const data = await res.json();
    setCities(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCity ? `/api/admin/cities/${editingCity._id}` : '/api/admin/cities';
    const method = editingCity ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingCity(null);
      setForm({ name: '', state: '', status: 'active', displayOrder: 0 });
      fetchCities();
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setForm({ name: city.name, state: city.state, status: city.status, displayOrder: city.displayOrder });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;
    await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
    fetchCities();
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      coming_soon: 'bg-yellow-100 text-yellow-800',
      hidden: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-xl font-bold text-gray-800">City Management</h1>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingCity(null); setForm({ name: '', state: '', status: 'active', displayOrder: 0 }); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add City
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingCity ? 'Edit City' : 'Add New City'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                <input
                  type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="e.g. Hyderabad" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="e.g. Telangana" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-gray-800"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  {editingCity ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading cities...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cities.map((city) => (
                  <tr key={city._id}>
                    <td className="px-6 py-4 font-medium text-gray-800">{city.name}</td>
                    <td className="px-6 py-4 text-gray-600">{city.state}</td>
                    <td className="px-6 py-4">{statusBadge(city.status)}</td>
                    <td className="px-6 py-4 text-gray-600">{city.displayOrder}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(city)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button onClick={() => handleDelete(city._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cities.length === 0 && (
              <p className="text-center py-8 text-gray-500">No cities added yet. Click &quot;+ Add City&quot; to get started.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
