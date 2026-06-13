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
  locationArea?: string;
  fields?: Record<string, { value: string | string[]; checked: boolean }>;
  photos?: { url: string; label: string; isMasked: boolean; isCover: boolean }[];
  submittedBy: { type: string; name: string };
  createdAt: string;
}

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    const params = filter ? `?status=${filter}` : '';
    const res = await fetch(`/api/admin/properties${params}`);
    const data = await res.json();
    // Handle both array response and { properties: [...] } format
    if (Array.isArray(data)) {
      setProperties(data);
    } else if (data && Array.isArray(data.properties)) {
      setProperties(data.properties);
    } else {
      setProperties([]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchProperties();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    fetchProperties();
  };

  const handleTogglePhotoMask = async (propertyId: string, photoIndex: number, isMasked: boolean) => {
    // Update locally for instant feedback
    setProperties(prev => prev.map(p => {
      if (p._id === propertyId && p.photos) {
        const updatedPhotos = p.photos.map((photo, i) => i === photoIndex ? { ...photo, isMasked } : photo);
        return { ...p, photos: updatedPhotos };
      }
      return p;
    }));
    // Persist to backend
    await fetch(`/api/admin/properties/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoIndex, isMasked }),
    });
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      unpublished: 'bg-gray-100 text-gray-800',
      draft: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      retail: 'Retail', office: 'Office', coworking: 'Co-working',
      commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment',
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-xl font-bold text-gray-800">Manage Listings</h1>
          </div>
          <Link href="/addddmin/properties/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + New Property
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['', 'published', 'pending', 'rejected', 'unpublished'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setLoading(true); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading properties...</p>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-blue-600">{property.propertyId}</span>
                      {statusBadge(property.status)}
                      <span className="text-xs text-gray-500">{property.transactionType === 'lease' ? 'Lease' : 'Sale'}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{categoryLabel(property.category)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {property.fields?.locationArea?.value || property.locationArea || 'No location'} • {property.city}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      By: {property.submittedBy?.name} • {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {property.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusChange(property._id, 'published')} className="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                        <button onClick={() => handleStatusChange(property._id, 'rejected')} className="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                      </>
                    )}
                    {property.status === 'published' && (
                      <button onClick={() => handleStatusChange(property._id, 'unpublished')} className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">Unpublish</button>
                    )}
                    {property.status === 'unpublished' && (
                      <button onClick={() => handleStatusChange(property._id, 'published')} className="text-green-600 hover:text-green-800 text-sm font-medium">Publish</button>
                    )}
                    <button onClick={() => handleDelete(property._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                  </div>
                </div>
                {/* Photos with mask toggle */}
                {property.photos && property.photos.length > 0 && (
                  <div className="mt-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {property.photos.map((photo, i) => (
                        <div key={i} className="relative flex-shrink-0">
                          <img src={photo.url} alt={photo.label || `Photo ${i + 1}`} className={`w-24 h-24 object-cover rounded border ${photo.isMasked ? 'blur-sm' : ''}`} />
                          {photo.isCover && <span className="absolute top-0.5 left-0.5 text-xs bg-blue-500 text-white px-1 rounded">Cover</span>}
                          <button
                            onClick={() => handleTogglePhotoMask(property._id, i, !photo.isMasked)}
                            className={`absolute bottom-0.5 right-0.5 text-xs px-1.5 py-0.5 rounded ${photo.isMasked ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}
                          >
                            {photo.isMasked ? '🔒' : '👁️'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Click 👁️/🔒 to toggle mask on each photo</p>
                  </div>
                )}
              </div>
            ))}
            {properties.length === 0 && (
              <p className="text-center py-8 text-gray-500">No properties found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
