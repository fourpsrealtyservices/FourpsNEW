'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Property {
  _id: string;
  propertyId: string;
  city: string;
  transactionType: string;
  category: string;
  status: string;
  fields?: Record<string, { value: string | string[]; checked: boolean }>;
  createdAt: string;
}

export default function AgentDashboard() {
  const [view, setView] = useState<'browse' | 'mine'>('browse');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/agent/properties?view=${view}`)
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false); });
  }, [view]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/agent/login');
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = { retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment' };
    return labels[cat] || cat;
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = { published: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', rejected: 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Agent Portal</h1>
          <div className="flex gap-4 items-center">
            <Link href="/agent/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              + Submit Property
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setView('browse')} className={`px-6 py-2 rounded-lg text-sm font-medium ${view === 'browse' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>
            Browse Inventory
          </button>
          <button onClick={() => setView('mine')} className={`px-6 py-2 rounded-lg text-sm font-medium ${view === 'mine' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>
            My Submissions
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-bold text-blue-600">{property.propertyId}</span>
                  {view === 'mine' && statusBadge(property.status)}
                  <span className="text-xs text-gray-500">{property.transactionType === 'lease' ? 'Lease' : 'Sale'}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{categoryLabel(property.category)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {(property.fields?.locationArea?.value as string) || 'No location'} • {property.city}
                </p>
                <p className="text-xs text-gray-400 mt-1">{new Date(property.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {properties.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                {view === 'mine' ? 'No submissions yet. Click "+ Submit Property" to add one.' : 'No properties available.'}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
