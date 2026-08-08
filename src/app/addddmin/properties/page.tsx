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
  soldOut?: boolean;
  customHeading?: string;
  locationArea?: string;
  officeType?: string;
  fields?: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos?: { url: string; label: string; isMasked: boolean; isCover: boolean }[];
  submittedBy: { type: string; name: string; agentId?: string };
  createdAt: string;
}

const PER_PAGE = 20;

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    const params = filter ? `?status=${filter}` : '';
    const res = await fetch(`/api/admin/properties${params}`);
    const data = await res.json();
    if (Array.isArray(data)) setProperties(data);
    else if (data && Array.isArray(data.properties)) setProperties(data.properties);
    else setProperties([]);
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

  const handleToggleSoldOut = async (id: string, soldOut: boolean) => {
    setProperties(prev => prev.map(p => p._id === id ? { ...p, soldOut } : p));
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soldOut }),
    });
  };

  const handleTogglePhotoMask = async (propertyId: string, photoIndex: number, isMasked: boolean) => {
    setProperties(prev => prev.map(p => {
      if (p._id === propertyId && p.photos) {
        const updatedPhotos = p.photos.map((photo, i) => i === photoIndex ? { ...photo, isMasked } : photo);
        return { ...p, photos: updatedPhotos };
      }
      return p;
    }));
    await fetch(`/api/admin/properties/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoIndex, isMasked }),
    });
  };

  const handleDownloadExcel = () => {
    // Generate CSV (Excel-compatible)
    const headers = ['Property ID', 'Title/Heading', 'City', 'Transaction Type', 'Category', 'Office Type', 'Status', 'Sold Out', 'Location/Area', 'Submitted By', 'Agent/Admin', 'Created Date', 'All Field Details'];
    const rows = filteredProperties.map(p => {
      const fieldDetails = Object.entries(p.fields || {}).map(([k, v]) => `${k}: ${Array.isArray(v.value) ? v.value.join(', ') : v.value}${v.unit ? ' ' + v.unit : ''}`).join(' | ');
      return [
        p.propertyId,
        p.customHeading || '',
        p.city,
        p.transactionType,
        p.category,
        p.officeType || '',
        p.status,
        p.soldOut ? 'Yes' : 'No',
        (p.fields?.locationArea?.value as string) || p.locationArea || '',
        p.submittedBy?.name || '',
        p.submittedBy?.type || '',
        new Date(p.createdAt).toLocaleDateString(),
        fieldDetails,
      ];
    });
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fourps_properties_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment', rental_income: 'Rental Income',
    };
    return labels[cat] || cat;
  };

  // Search filter
  const filteredProperties = properties.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    const loc = (p.fields?.locationArea?.value as string) || p.locationArea || '';
    return (
      p.propertyId.toLowerCase().includes(s) ||
      p.city.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      p.transactionType.toLowerCase().includes(s) ||
      loc.toLowerCase().includes(s) ||
      (p.customHeading || '').toLowerCase().includes(s) ||
      (p.submittedBy?.name || '').toLowerCase().includes(s)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / PER_PAGE);
  const paginatedProperties = filteredProperties.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when search/filter changes
  useEffect(() => { setPage(1); }, [search, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-xl font-bold text-gray-800">Manage Listings</h1>
            <span className="text-sm text-gray-400">({filteredProperties.length} properties)</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownloadExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">
              📥 Download Excel
            </button>
            <Link href="/addddmin/properties/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
              + New Property
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by Property ID, location, city, category, agent name..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['', 'published', 'pending', 'rejected', 'unpublished', 'draft'].map((s) => (
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
          <>
            <div className="space-y-4">
              {paginatedProperties.map((property) => (
                <div key={property._id} className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm font-bold text-blue-600">{property.propertyId}</span>
                        {statusBadge(property.status)}
                        {property.soldOut && <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">🚫 Sold Out</span>}
                        <span className="text-xs text-gray-500">{property.transactionType === 'lease' ? 'Lease' : 'Sale'}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{categoryLabel(property.category)}</span>
                      </div>
                      {property.customHeading && <p className="text-sm font-semibold text-gray-800 mt-1">{property.customHeading}</p>}
                      <p className="text-sm text-gray-600 mt-1">
                        {(property.fields?.locationArea?.value as string) || property.locationArea || 'No location'} • {property.city}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        By: {property.submittedBy?.name} ({property.submittedBy?.type}) • {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap justify-end">
                      {property.status === 'published' && (
                        <a href={`/listing/${property.propertyId}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm font-medium border px-2 py-1 rounded">View</a>
                      )}
                      <Link href={`/addddmin/properties/${property._id}/edit`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium border px-2 py-1 rounded">Edit</Link>
                      {property.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(property._id, 'published')} className="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                          <button onClick={() => handleStatusChange(property._id, 'rejected')} className="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                        </>
                      )}
                      {property.status === 'published' && (
                        <button onClick={() => handleStatusChange(property._id, 'unpublished')} className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">Unpublish</button>
                      )}
                      {property.status === 'published' && (
                        <button
                          onClick={() => handleToggleSoldOut(property._id, !property.soldOut)}
                          className={`text-sm font-medium border px-2 py-1 rounded ${property.soldOut ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'}`}
                        >
                          {property.soldOut ? '↩ Undo Sold' : '🚫 Mark Sold'}
                        </button>
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
                    </div>
                  )}
                </div>
              ))}
              {filteredProperties.length === 0 && (
                <p className="text-center py-8 text-gray-500">No properties found.</p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">
                  ← Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (page <= 4) pageNum = i + 1;
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                    else pageNum = page - 3 + i;
                    return (
                      <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === pageNum ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50 text-gray-600'}`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">
                  Next →
                </button>
                <span className="text-xs text-gray-400 ml-2">Page {page} of {totalPages}</span>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
