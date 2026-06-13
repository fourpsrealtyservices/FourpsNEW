'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
  _id: string;
  leadId: string;
  type: string;
  name: string;
  mobile: string;
  email?: string;
  message?: string;
  propertyId?: string;
  city?: string;
  lookingFor?: string;
  propertyType?: string;
  preferredLocation?: string;
  areaRequired?: string;
  budgetRange?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    const params = filter ? `?status=${filter}` : '';
    const res = await fetch(`/api/admin/leads${params}`);
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = { new: 'bg-blue-100 text-blue-800', contacted: 'bg-yellow-100 text-yellow-800', converted: 'bg-green-100 text-green-800', not_interested: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Back</Link>
          <h1 className="text-xl font-bold text-gray-800">Leads & Enquiries</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 flex-wrap">
          {['', 'new', 'contacted', 'converted', 'not_interested'].map((s) => (
            <button key={s} onClick={() => { setFilter(s); setLoading(true); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? <p className="text-gray-500">Loading...</p> : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead._id} className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600">{lead.leadId}</span>
                      {statusBadge(lead.status)}
                      <span className="text-xs text-gray-400">{lead.type}</span>
                    </div>
                    <p className="font-medium text-gray-800">{lead.name} — <a href={`tel:${lead.mobile}`} className="text-blue-600">{lead.mobile}</a></p>
                    {lead.propertyId && <p className="text-sm text-gray-600">Property: {lead.propertyId}</p>}
                    {lead.message && <p className="text-sm text-gray-500 mt-1">{lead.message}</p>}
                    {lead.preferredLocation && <p className="text-sm text-gray-500">Location: {lead.preferredLocation} • Budget: {lead.budgetRange}</p>}
                    <p className="text-xs text-gray-400 mt-2">{new Date(lead.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)} className="text-xs border rounded px-2 py-1 text-gray-700">
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {leads.length === 0 && <p className="text-center py-8 text-gray-500">No leads found.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
