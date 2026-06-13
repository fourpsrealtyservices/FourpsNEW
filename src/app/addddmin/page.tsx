'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/addddmin/login');
  };

  const menuItems = [
    {
      title: 'Upload New Property',
      description: 'Add a new property listing',
      href: '/addddmin/properties/new',
      icon: '🏢',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      title: 'Pending Approvals',
      description: 'Review agent submissions',
      href: '/addddmin/properties?status=pending',
      icon: '⏳',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    },
    {
      title: 'Manage Listings',
      description: 'Edit, unpublish or delete properties',
      href: '/addddmin/properties',
      icon: '📋',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
      title: 'Agent Management',
      description: 'Add or manage agent accounts',
      href: '/addddmin/agents',
      icon: '👥',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
    {
      title: 'Leads & Enquiries',
      description: 'View visitor enquiries and requirements',
      href: '/addddmin/leads',
      icon: '📞',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    },
    {
      title: 'City Management',
      description: 'Manage cities and their status',
      href: '/addddmin/cities',
      icon: '🏙️',
      color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">FourPs Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`block p-6 rounded-xl border-2 transition-all ${item.color}`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
