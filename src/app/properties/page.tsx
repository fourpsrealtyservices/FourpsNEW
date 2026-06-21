'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface City { _id: string; name: string; status: string; }
interface Property {
  _id: string; propertyId: string; city: string; transactionType: string; category: string;
  officeType?: string; fields: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos: { url: string; isCover: boolean; isMasked: boolean; label: string }[]; createdAt: string;
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || 'Hyderabad',
    transactionType: searchParams.get('transactionType') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => { fetch('/api/public/cities').then(r => r.json()).then(setCities); }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.transactionType) params.set('transactionType', filters.transactionType);
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    fetch(`/api/public/properties?${params}`).then(r => r.json()).then(data => { setProperties(data); setLoading(false); });
  }, [filters]);

  const getCoverPhoto = (p: Property) => p.photos?.find(x => x.isCover) || p.photos?.[0] || null;
  const getPrice = (p: Property) => {
    const r = p.fields?.expectedRent || p.fields?.expectedSalePrice || p.fields?.expectedRentPerSeat || p.fields?.expectedPrice;
    if (!r?.checked) return ''; if (r.value === 'Call for Price') return 'Call for Price'; return `₹${r.value}`;
  };
  const getArea = (p: Property) => {
    const a = p.fields?.superBuiltUpArea || p.fields?.carpetArea || p.fields?.plotArea || p.fields?.assetSize;
    if (a?.checked && a.value) return `${a.value} ${a.unit || 'sq ft'}`; return '';
  };
  const categoryLabel = (c: string) => ({ retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Plots/Warehouse', land_plot: 'Land', investment: 'Investment' }[c] || c);
  const categoryIcon = (c: string) => ({ retail: '🏪', office: '🏢', coworking: '👥', commercial_plot: '🏭', land_plot: '🌍', investment: '📈' }[c] || '🏠');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">4P</div>
            <span className="text-xl font-bold text-gray-900">FourPs<span className="text-blue-600">.in</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/properties" className="text-blue-600 font-bold">Properties</Link>
            <Link href="/growth-corridors" className="hover:text-blue-600">Growth Corridors</Link>
            <Link href="/about" className="hover:text-blue-600">About Us</Link>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
          </nav>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-[57px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:border-blue-300 outline-none">
              {cities.filter(c => c.status === 'active').map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
            <select value={filters.transactionType} onChange={e => setFilters({...filters, transactionType: e.target.value})} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:border-blue-300 outline-none">
              <option value="">All Types</option>
              <option value="lease">For Lease</option>
              <option value="sale">For Sale</option>
            </select>
            <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:border-blue-300 outline-none">
              <option value="">All Categories</option>
              <option value="retail">Retail</option>
              <option value="office">Office</option>
              <option value="coworking">Co-working</option>
              <option value="commercial_plot">Plots / Warehouse</option>
              <option value="land_plot">Land</option>
              <option value="investment">Investment</option>
            </select>
            <input type="text" value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} placeholder="Search locality..." className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:border-blue-300 outline-none flex-1 min-w-[180px]" />
            {(filters.transactionType || filters.category || filters.search) && (
              <button onClick={() => setFilters({...filters, transactionType: '', category: '', search: ''})} className="px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 active:scale-95">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Property Listings
            {filters.search && <span className="text-blue-600"> in {filters.search}</span>}
          </h1>
          <p className="text-sm text-gray-500">{properties.length} properties found</p>
        </div>

        {loading && <div className="text-center py-20"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>}

        {!loading && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No properties found</h2>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <Link key={property._id} href={`/listing/${property.propertyId}`} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {getCoverPhoto(property) ? (
                  <img src={getCoverPhoto(property)!.url} alt="" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${getCoverPhoto(property)!.isMasked ? 'blur-md' : ''}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"><span className="text-4xl opacity-30">{categoryIcon(property.category)}</span></div>
                )}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-gray-700 shadow-sm">{categoryLabel(property.category)}</span>
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow ${property.transactionType === 'lease' ? 'bg-emerald-500 text-white' : 'bg-violet-500 text-white'}`}>
                  {property.transactionType === 'lease' ? 'LEASE' : 'SALE'}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{property.propertyId}</span>
                  {getPrice(property) && <span className={`text-sm font-bold ${getPrice(property) === 'Call for Price' ? 'text-orange-600' : 'text-gray-900'}`}>{getPrice(property)}</span>}
                </div>
                <h3 className="text-gray-900 font-bold text-sm mb-1 group-hover:text-blue-600">{categoryLabel(property.category)} for {property.transactionType === 'lease' ? 'Lease' : 'Sale'}</h3>
                <p className="text-gray-500 text-xs">📍 {(property.fields?.locationArea?.checked && property.fields?.locationArea?.value) || property.city}</p>
                {getArea(property) && <p className="text-xs text-gray-500 mt-1"><span className="font-medium text-gray-700">{getArea(property)}</span></p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
