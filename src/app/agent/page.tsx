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
  soldOut?: boolean;
  customHeading?: string;
  officeType?: string;
  rejectionReason?: string;
  locationPin?: string;
  contactName?: string;
  contactMobile?: string;
  contactDesignation?: string;
  remarks?: string;
  fields?: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos?: { url: string; label: string; isMasked: boolean; isCover: boolean }[];
  createdAt: string;
}

export default function AgentDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    fetch(`/api/agent/properties?view=mine`)
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false); });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/agent/login');
  };

  const handleMarkSold = async (id: string) => {
    if (!confirm('Mark this property as sold?')) return;
    await fetch('/api/agent/properties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: id, action: 'markSold' }),
    });
    fetchProperties();
  };

  const handleUndoSold = async (id: string) => {
    await fetch('/api/agent/properties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: id, action: 'undoSold' }),
    });
    fetchProperties();
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = { retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment', rental_income: 'Rental Income' };
    return labels[cat] || cat;
  };

  const statusBadge = (status: string, soldOut?: boolean) => {
    if (soldOut) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">🚫 Sold Out</span>;
    const colors: Record<string, string> = { published: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', rejected: 'bg-red-100 text-red-800', draft: 'bg-gray-100 text-gray-600', unpublished: 'bg-gray-100 text-gray-700' };
    const labels: Record<string, string> = { published: '✅ Published', pending: '⏳ Pending Approval', rejected: '❌ Rejected', draft: '📝 Draft', unpublished: 'Unpublished' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{labels[status] || status}</span>;
  };

  const filteredProperties = filter === 'all' ? properties : properties.filter(p => {
    if (filter === 'soldOut') return p.soldOut;
    if (filter === 'draft') return p.status === 'draft';
    return p.status === filter;
  });

  const stats = {
    total: properties.length,
    published: properties.filter(p => p.status === 'published' && !p.soldOut).length,
    pending: properties.filter(p => p.status === 'pending').length,
    draft: properties.filter(p => p.status === 'draft').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
    soldOut: properties.filter(p => p.soldOut).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">🏢 Agent Portal</h1>
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/agent/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all">
              + Submit Property
            </Link>
            <Link href="/agent/change-password" className="text-sm text-gray-500 hover:text-gray-700">⚙️</Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📋 My Properties</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          <button onClick={() => setFilter('all')} className={`rounded-xl border p-3 text-center transition-all ${filter === 'all' ? 'border-blue-300 bg-blue-50 shadow-sm' : 'bg-white hover:shadow-sm'}`}>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">All</p>
          </button>
          <button onClick={() => setFilter('published')} className={`rounded-xl border p-3 text-center transition-all ${filter === 'published' ? 'border-green-300 bg-green-50 shadow-sm' : 'bg-white hover:shadow-sm'}`}>
            <p className="text-xl font-bold text-green-600">{stats.published}</p>
            <p className="text-xs text-gray-500">Published</p>
          </button>
          <button onClick={() => setFilter('pending')} className={`rounded-xl border p-3 text-center transition-all ${filter === 'pending' ? 'border-yellow-300 bg-yellow-50 shadow-sm' : 'bg-white hover:shadow-sm'}`}>
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </button>
          <button onClick={() => setFilter('draft')} className={`rounded-xl border p-3 text-center transition-all ${filter === 'draft' ? 'border-gray-300 bg-gray-100 shadow-sm' : 'bg-white hover:shadow-sm'}`}>
            <p className="text-xl font-bold text-gray-600">{stats.draft}</p>
            <p className="text-xs text-gray-500">Drafts</p>
          </button>
          <button onClick={() => setFilter('rejected')} className={`rounded-xl border p-3 text-center transition-all ${filter === 'rejected' ? 'border-red-300 bg-red-50 shadow-sm' : 'bg-white hover:shadow-sm'}`}>
            <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </button>
          <button onClick={() => setFilter('soldOut')} className={`rounded-xl border p-3 text-center transition-all ${filter === 'soldOut' ? 'border-red-300 bg-red-50 shadow-sm' : 'bg-white hover:shadow-sm'}`}>
            <p className="text-xl font-bold text-gray-600">{stats.soldOut}</p>
            <p className="text-xs text-gray-500">Sold Out</p>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading properties...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProperties.map((property) => (
              <div key={property._id} className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${property.soldOut ? 'border-red-200 bg-red-50/30' : property.status === 'draft' ? 'border-dashed border-gray-300' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-blue-600">{property.propertyId}</span>
                      {statusBadge(property.status, property.soldOut)}
                      <span className={`text-xs px-2 py-0.5 rounded ${property.transactionType === 'lease' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>
                        {property.transactionType === 'lease' ? 'Lease' : 'Sale'}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{categoryLabel(property.category)}</span>
                      {property.officeType && <span className="text-xs text-amber-700 capitalize">({property.officeType})</span>}
                    </div>
                    {property.customHeading && <p className="text-sm font-semibold text-gray-800 mt-1">{property.customHeading}</p>}
                    <p className="text-sm text-gray-600 mt-1">
                      📍 {(property.fields?.locationArea?.value as string) || 'No location'} • {property.city}
                    </p>
                    {property.fields?.expectedRent?.value && (
                      <p className="text-xs text-gray-500 mt-0.5">💰 Rent: {property.fields.expectedRent.value as string}</p>
                    )}
                    {property.fields?.expectedSalePrice?.value && (
                      <p className="text-xs text-gray-500 mt-0.5">💰 Price: {property.fields.expectedSalePrice.value as string}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Added: {new Date(property.createdAt).toLocaleDateString()}</p>
                    {/* Rejection Reason - visible to agent */}
                    {property.status === 'rejected' && property.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-medium text-red-700">❌ Rejection Reason:</p>
                        <p className="text-sm text-red-800 mt-0.5">{property.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions - Edit, View, Mark as Sold (NO Delete/Unpublish) */}
                  <div className="flex gap-2 items-center flex-shrink-0 ml-4 flex-wrap justify-end">
                    {/* View - available for published properties (opens public listing) */}
                    {property.status === 'published' && !property.soldOut && (
                      <a href={`/listing/${property.propertyId}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50">
                        👁 View Live
                      </a>
                    )}

                    {/* Edit - available for drafts, pending, rejected, and published */}
                    {['draft', 'pending', 'rejected', 'published'].includes(property.status) && !property.soldOut && (
                      <Link
                        href={`/agent/submit?edit=${property._id}`}
                        className="text-xs font-medium border border-indigo-200 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        ✏️ Edit
                      </Link>
                    )}

                    {/* Mark as Sold - available for published and pending (not drafts) */}
                    {(property.status === 'published' || property.status === 'pending') && !property.soldOut && (
                      <button
                        onClick={() => handleMarkSold(property._id)}
                        className="text-xs font-medium border border-red-200 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        🚫 Mark Sold
                      </button>
                    )}

                    {/* Undo Sold - if it's marked sold */}
                    {property.soldOut && (
                      <button
                        onClick={() => handleUndoSold(property._id)}
                        className="text-xs font-medium border border-green-200 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        ↩ Undo Sold
                      </button>
                    )}

                    {/* Submit Draft - shortcut for drafts */}
                    {property.status === 'draft' && (
                      <Link
                        href={`/agent/submit?edit=${property._id}&submit=true`}
                        className="text-xs font-medium border border-green-200 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        🚀 Submit
                      </Link>
                    )}
                  </div>
                </div>

                {/* Backend-only info (visible to agent for their own properties) */}
                {(property.contactName || property.contactMobile || property.locationPin || property.remarks) && (
                  <div className="mt-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">🔒 Backend Info (not shown publicly)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-700">
                      {property.contactName && (
                        <p><span className="text-gray-500">Contact:</span> {property.contactName}{property.contactDesignation ? ` (${property.contactDesignation})` : ''}</p>
                      )}
                      {property.contactMobile && (
                        <p><span className="text-gray-500">Mobile:</span> {property.contactMobile}</p>
                      )}
                      {property.locationPin && (
                        <p className="sm:col-span-2"><span className="text-gray-500">Location PIN:</span> <a href={property.locationPin.startsWith('http') ? property.locationPin : `https://maps.google.com/?q=${property.locationPin}`} target="_blank" className="text-blue-600 hover:underline truncate">{property.locationPin.length > 50 ? property.locationPin.slice(0, 50) + '...' : property.locationPin}</a></p>
                      )}
                      {property.remarks && (
                        <p className="sm:col-span-2"><span className="text-gray-500">Remarks:</span> {property.remarks}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Photos preview */}
                {property.photos && property.photos.length > 0 && (
                  <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                    {property.photos.slice(0, 5).map((photo, i) => (
                      <img key={i} src={photo.url} alt={photo.label || ''} className={`w-14 h-14 object-cover rounded-lg border ${photo.isMasked ? 'blur-sm' : ''}`} />
                    ))}
                    {property.photos.length > 5 && (
                      <div className="w-14 h-14 rounded-lg border bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                        +{property.photos.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border">
                <p className="text-4xl mb-3">📝</p>
                <p className="text-gray-600 font-medium">
                  {filter === 'all' ? 'No submissions yet' : `No ${filter} properties`}
                </p>
                <Link href="/agent/submit" className="inline-block mt-3 text-blue-600 font-medium text-sm hover:underline">
                  + Submit your first property →
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
