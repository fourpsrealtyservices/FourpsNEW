'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Stats {
  properties: number;
  pending: number;
  leads: number;
  agents: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ properties: 0, pending: 0, leads: 0, agents: 0 });

  useEffect(() => {
    // Fetch quick stats
    Promise.all([
      fetch('/api/admin/properties').then(r => r.json()),
      fetch('/api/admin/leads').then(r => r.json()),
      fetch('/api/admin/agents').then(r => r.json()),
    ]).then(([props, leads, agents]) => {
      const propList = Array.isArray(props) ? props : props.properties || [];
      const leadList = Array.isArray(leads) ? leads : leads.leads || [];
      const agentList = Array.isArray(agents) ? agents : [];
      setStats({
        properties: propList.filter((p: { status: string }) => p.status === 'published').length,
        pending: propList.filter((p: { status: string }) => p.status === 'pending').length,
        leads: leadList.length,
        agents: agentList.filter((a: { status: string }) => a.status === 'approved').length,
      });
    });
  }, []);

  const menuItems = [
    { href: '/addddmin/properties/new', icon: '➕', title: 'Upload Property', desc: 'Add a new listing', color: 'from-blue-500 to-blue-600' },
    { href: '/addddmin/approvals', icon: '✅', title: 'Pending Approvals', desc: `${stats.pending} submissions waiting`, color: 'from-amber-500 to-orange-500', badge: stats.pending },
    { href: '/addddmin/properties', icon: '🏢', title: 'Manage Listings', desc: `${stats.properties} live properties`, color: 'from-emerald-500 to-teal-600' },
    { href: '/addddmin/drafts', icon: '📝', title: 'Drafts', desc: 'Incomplete listings saved for later', color: 'from-amber-400 to-yellow-500' },
    { href: '/addddmin/leads', icon: '📋', title: 'Leads & Enquiries', desc: `${stats.leads} total leads`, color: 'from-purple-500 to-indigo-600' },
    { href: '/addddmin/agents', icon: '👥', title: 'Agent Management', desc: `${stats.agents} active agents`, color: 'from-pink-500 to-rose-600' },
    { href: '/addddmin/growth-corridors', icon: '📍', title: 'Growth Corridors', desc: 'Manage corridor zones', color: 'from-green-500 to-emerald-600' },
    { href: '/addddmin/cities', icon: '🌍', title: 'City Settings', desc: 'Manage active cities', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">4P</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">FourPs.in Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              🌐 View Site
            </Link>
            <a href="/api/auth/logout" className="text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium">
              Logout
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back! 👋</h2>
          <p className="text-gray-500">Here&apos;s what&apos;s happening with your listings today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-gray-900">{stats.properties}</p>
            <p className="text-sm text-gray-500 mt-1">Live Listings</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Pending Review</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-purple-600">{stats.leads}</p>
            <p className="text-sm text-gray-500 mt-1">Total Leads</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-bold text-emerald-600">{stats.agents}</p>
            <p className="text-sm text-gray-500 mt-1">Active Agents</p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-100 transition-all duration-200 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-100/50`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    {item.badge ? <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span> : null}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">{'\u2192'}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
