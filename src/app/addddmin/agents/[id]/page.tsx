'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Agent {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  agentCode?: string;
  isActive: boolean;
  status: string;
  createdAt: string;
}

interface Property {
  _id: string;
  propertyId: string;
  city: string;
  transactionType: string;
  category: string;
  officeType?: string;
  status: string;
  fields: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos: { url: string; isCover: boolean; isMasked: boolean }[];
  createdAt: string;
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/agents/${id}`).then(r => r.json()),
      fetch(`/api/admin/agents/${id}/properties`).then(r => r.json()),
    ]).then(([agentData, propsData]) => {
      if (agentData && !agentData.error) setAgent(agentData);
      if (Array.isArray(propsData)) setProperties(propsData);
      setLoading(false);
    });
  }, [id]);

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = { retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment' };
    return labels[cat] || cat;
  };

  const statusBadge = (status: string) => {
    if (status === 'published') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">LIVE</span>;
    if (status === 'pending') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700">PENDING</span>;
    if (status === 'rejected') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">REJECTED</span>;
    if (status === 'draft') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">DRAFT</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">{status.toUpperCase()}</span>;
  };

  const getCoverPhoto = (p: Property) => p.photos?.find(x => x.isCover) || p.photos?.[0] || null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!agent) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Agent Not Found</h2>
        <Link href="/addddmin/agents" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Agents</Link>
      </div>
    </div>
  );

  const publishedCount = properties.filter(p => p.status === 'published').length;
  const pendingCount = properties.filter(p => p.status === 'pending').length;
  const rejectedCount = properties.filter(p => p.status === 'rejected').length;
  const draftCount = properties.filter(p => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/addddmin/agents" className="text-blue-600 hover:text-blue-800">← Agents</Link>
          <h1 className="text-xl font-bold text-gray-800">Agent Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Info Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {agent.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{agent.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  {agent.agentCode && <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{agent.agentCode}</span>}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${agent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {agent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>📱 {agent.phone}</span>
                  {agent.email && <span>✉️ {agent.email}</span>}
                  <span>📅 Joined {new Date(agent.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Uploads</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
            <p className="text-xs text-gray-500 mt-1">Published</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            <p className="text-xs text-gray-500 mt-1">Rejected</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold text-gray-500">{draftCount}</p>
            <p className="text-xs text-gray-500 mt-1">Drafts</p>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Properties Uploaded by {agent.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{properties.length} total submissions</p>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🏚️</div>
              <p className="text-gray-500">This agent hasn&apos;t uploaded any properties yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {properties.map((property) => (
                <div key={property._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {getCoverPhoto(property) ? (
                      <img src={getCoverPhoto(property)!.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">🏢</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs text-blue-600 font-bold">{property.propertyId}</span>
                      {statusBadge(property.status)}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${property.transactionType === 'lease' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>
                        {property.transactionType === 'lease' ? 'LEASE' : 'SALE'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {categoryLabel(property.category)}{property.officeType ? ` (${property.officeType})` : ''} — {property.city}
                    </p>
                    <p className="text-xs text-gray-400">
                      {property.fields?.locationArea?.value && `📍 ${property.fields.locationArea.value}`}
                      {' • '}
                      Uploaded {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/addddmin/properties/${property._id}/edit`} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
                      View/Edit
                    </Link>
                    <Link href={`/listing/${property.propertyId}`} target="_blank" className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium">
                      Public →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
