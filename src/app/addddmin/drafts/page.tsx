'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Property {
  _id: string;
  propertyId: string;
  city: string;
  transactionType: string;
  category: string;
  status: string;
  createdAt: string;
  fields?: Record<string, { value: string | string[]; checked: boolean }>;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/properties?status=draft')
      .then(r => r.json())
      .then(data => {
        setDrafts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const publishDraft = async (id: string) => {
    if (!confirm('Publish this draft?')) return;
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published', publishedAt: new Date() }),
    });
    setDrafts(prev => prev.filter(d => d._id !== id));
  };

  const deleteDraft = async (id: string) => {
    if (!confirm('Delete this draft permanently?')) return;
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    setDrafts(prev => prev.filter(d => d._id !== id));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading drafts...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Dashboard</Link>
          <h1 className="text-xl font-bold text-gray-800">📝 Drafts</h1>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">{drafts.length}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No drafts saved.</p>
            <Link href="/addddmin/properties/new" className="mt-4 inline-block text-blue-600 hover:underline">
              ➕ Upload a new property
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div key={draft._id} className="bg-white rounded-xl border border-amber-200 p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-bold text-gray-700">{draft.propertyId}</span>
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium">DRAFT</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {draft.city} • {draft.transactionType === 'lease' ? 'For Lease' : 'For Sale'} • {draft.category}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(draft.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/addddmin/properties/${draft._id}/edit`}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 font-medium"
                  >
                    ✏️ Continue Editing
                  </Link>
                  <button
                    onClick={() => publishDraft(draft._id)}
                    className="text-sm bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 font-medium"
                  >
                    🚀 Publish
                  </button>
                  <button
                    onClick={() => deleteDraft(draft._id)}
                    className="text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 font-medium"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
