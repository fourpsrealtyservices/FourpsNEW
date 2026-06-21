'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Agent {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  agentCode?: string;
  password?: string;
  isActive: boolean;
  status: string;
  mustChangePassword?: boolean;
  createdAt: string;
}

export default function AgentManagementPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [approveData, setApproveData] = useState<{ agentId: string; password: string } | null>(null);

  useEffect(() => { fetchAgents(); }, []);

  const fetchAgents = async () => {
    const res = await fetch('/api/admin/agents');
    const data = await res.json();
    setAgents(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.password) { setError('Password is required for agent login'); return; }

    const res = await fetch('/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }

    setShowForm(false);
    setForm({ name: '', phone: '', email: '', password: '' });
    fetchAgents();
  };

  const approveAgent = async (id: string) => {
    setApproveData({ agentId: id, password: '' });
  };

  const confirmApprove = async () => {
    if (!approveData || !approveData.password) { alert('Please set a password for the agent'); return; }
    await fetch(`/api/admin/agents/${approveData.agentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', isActive: true, password: approveData.password, mustChangePassword: true }),
    });
    setApproveData(null);
    fetchAgents();
  };

  const rejectAgent = async (id: string) => {
    if (!confirm('Reject this agent registration?')) return;
    await fetch(`/api/admin/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', isActive: false }),
    });
    fetchAgents();
  };

  const resetPassword = async (agent: Agent) => {
    const newPw = prompt(`Set new password for ${agent.name}:`);
    if (!newPw) return;
    await fetch(`/api/admin/agents/${agent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPw, mustChangePassword: true }),
    });
    alert(`Password set to: ${newPw}\nShare this with the agent.`);
    fetchAgents();
  };

  const toggleActive = async (agent: Agent) => {
    await fetch(`/api/admin/agents/${agent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !agent.isActive }),
    });
    fetchAgents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    await fetch(`/api/admin/agents/${id}`, { method: 'DELETE' });
    fetchAgents();
  };

  const pendingCount = agents.filter(a => a.status === 'pending').length;

  const filteredAgents = agents.filter(a => {
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'approved') return a.status === 'approved';
    return true;
  });

  const statusBadge = (agent: Agent) => {
    if (agent.status === 'pending') return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    if (agent.status === 'rejected') return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
    if (agent.isActive) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactive</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-xl font-bold text-gray-800">Agent Management</h1>
            {pendingCount > 0 && <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">{pendingCount} pending</span>}
          </div>
          <button onClick={() => { setShowForm(true); setForm({ name: '', phone: '', email: '', password: '' }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Add Agent</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Approve Modal */}
        {approveData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Set Password for Agent</h3>
              <p className="text-sm text-gray-500 mb-4">Create a password that you will share with the agent. They will be asked to change it on first login.</p>
              <input
                type="text"
                value={approveData.password}
                onChange={(e) => setApproveData({ ...approveData, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg text-gray-800 mb-4"
                placeholder="Set initial password"
              />
              <div className="flex gap-3">
                <button onClick={confirmApprove} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Approve & Set Password</button>
                <button onClick={() => setApproveData(null)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>All ({agents.length})</button>
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white border text-gray-600'}`}>Pending ({pendingCount})</button>
          <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-white border text-gray-600'}`}>Approved ({agents.filter(a => a.status === 'approved').length})</button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Agent</h3>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (with country code)</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="+919876543210" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (share with agent)</label>
                <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="Initial password" required />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Create Agent</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading agents...</p>
        ) : (
          <div className="space-y-3">
            {filteredAgents.map((agent) => (
              <div key={agent._id} className={`bg-white rounded-lg border p-4 ${agent.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-gray-800">{agent.name}</span>
                      {agent.agentCode && <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{agent.agentCode}</span>}
                      {statusBadge(agent)}
                    </div>
                    <p className="text-sm text-gray-600">{agent.phone} {agent.email && `• ${agent.email}`}</p>
                    <p className="text-xs text-gray-400 mt-1">Registered: {new Date(agent.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {agent.status === 'pending' && (
                      <>
                        <button onClick={() => approveAgent(agent._id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">✓ Approve</button>
                        <button onClick={() => rejectAgent(agent._id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">✕ Reject</button>
                      </>
                    )}
                    {agent.status === 'approved' && (
                      <>
                        <button onClick={() => resetPassword(agent)} className="text-orange-600 hover:text-orange-800 text-sm border px-3 py-1 rounded">Reset Password</button>
                        <button onClick={() => toggleActive(agent)} className="text-blue-600 hover:text-blue-800 text-sm border px-3 py-1 rounded">
                          {agent.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(agent._id)} className="text-red-600 hover:text-red-800 text-sm border px-3 py-1 rounded">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {filteredAgents.length === 0 && <p className="text-center py-8 text-gray-500">No agents found.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
