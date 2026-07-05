'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Locality { _id: string; name: string; city: string; }
interface City { _id: string; name: string; status: string; }

export default function LocalitiesPage() {
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/cities').then(r => r.json()).then(data => {
      const active = data.filter((c: City) => c.status === 'active');
      setCities(active);
      if (active.length > 0) { setSelectedCity(active[0].name); setFilterCity(active[0].name); }
    });
  }, []);

  useEffect(() => { if (filterCity) fetchLocalities(); }, [filterCity]);

  const fetchLocalities = async () => {
    const res = await fetch(`/api/admin/localities?city=${filterCity}`);
    const data = await res.json();
    setLocalities(data);
  };

  const addLocality = async () => {
    if (!newName.trim() || !selectedCity) return;
    setLoading(true);
    const res = await fetch('/api/admin/localities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), city: selectedCity }),
    });
    if (res.ok) {
      setNewName('');
      fetchLocalities();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to add');
    }
    setLoading(false);
  };

  const deleteLocality = async (id: string) => {
    if (!confirm('Remove this locality?')) return;
    await fetch(`/api/admin/localities/${id}`, { method: 'DELETE' });
    fetchLocalities();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Localities / Areas</h1>
        <Link href="/addddmin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">← Back to Dashboard</Link>
      </div>

      {/* Add New */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Add New Locality</h2>
        <div className="flex flex-wrap gap-3">
          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm text-gray-700">
            {cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLocality()}
            placeholder="Locality name (e.g. Madhapur)"
            className="flex-1 min-w-[200px] px-4 py-2.5 border rounded-lg text-sm text-gray-700"
          />
          <button onClick={addLocality} disabled={loading || !newName.trim()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Adding...' : '+ Add'}
          </button>
        </div>
      </div>

      {/* Filter & List */}
      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-gray-600">Filter by city:</span>
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-gray-700">
            {cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{localities.length} localities</span>
        </div>

        {localities.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No localities added for this city yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {localities.map(loc => (
              <span key={loc._id} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700">
                📍 {loc.name}
                <button onClick={() => deleteLocality(loc._id)} className="text-gray-400 hover:text-red-500 font-bold text-xs">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
