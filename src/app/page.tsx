'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface City {
  _id: string;
  name: string;
  status: string;
}

interface Property {
  _id: string;
  propertyId: string;
  city: string;
  transactionType: string;
  category: string;
  officeType?: string;
  fields: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos: { url: string; isCover: boolean; isMasked: boolean; label: string }[];
  createdAt: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [transactionFilter, setTransactionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/public/cities').then(r => r.json()).then(setCities);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (transactionFilter) params.set('transactionType', transactionFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (search) params.set('search', search);

    fetch(`/api/public/properties?${params}`).then(r => r.json()).then(data => {
      setProperties(data);
      setLoading(false);
    });
  }, [selectedCity, transactionFilter, categoryFilter, search]);

  // Auto pop-up after 45 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRequirementForm(true);
    }, 45000);
    return () => clearTimeout(timer);
  }, []);

  const getCoverPhoto = (property: Property) => {
    const cover = property.photos?.find(p => p.isCover);
    return cover || property.photos?.[0] || null;
  };

  const getPrice = (property: Property) => {
    const rent = property.fields?.expectedRent || property.fields?.expectedSalePrice || property.fields?.expectedRentPerSeat || property.fields?.expectedPrice;
    if (!rent?.checked) return '';
    if (rent.value === 'Call for Price') return 'Call for Price';
    return `₹${rent.value}`;
  };

  const getArea = (property: Property) => {
    const area = property.fields?.superBuiltUpArea || property.fields?.carpetArea || property.fields?.plotArea || property.fields?.assetSize || property.fields?.seatsAvailable;
    if (area?.checked && area.value) {
      if (typeof area.value === 'string' && area.value.includes(' to ')) {
        return `${area.value} ${area.unit || 'seats'}`;
      }
      return `${area.value} ${area.unit || 'sq ft'}`;
    }
    return '';
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = { retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment' };
    return labels[cat] || cat;
  };

  const categoryIcon = (cat: string) => {
    const icons: Record<string, string> = { retail: '🏪', office: '🏢', coworking: '👥', commercial_plot: '📐', land_plot: '🌍', investment: '📈' };
    return icons[cat] || '🏠';
  };

  const categories = [
    { key: 'retail', label: 'Retail', icon: '🏪', desc: 'Shops & Showrooms' },
    { key: 'office', label: 'Office', icon: '🏢', desc: 'Business Spaces' },
    { key: 'coworking', label: 'Co-working', icon: '👥', desc: 'Shared Spaces' },
    { key: 'commercial_plot', label: 'Plots', icon: '📐', desc: 'Commercial Plots' },
    { key: 'land_plot', label: 'Land', icon: '🌍', desc: 'Land Parcels' },
    { key: 'investment', label: 'Investment', icon: '📈', desc: 'Investment Options' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">4P</div>
            <span className="text-xl font-bold text-gray-900">FourPs<span className="text-blue-600">.in</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="#properties" className="hover:text-blue-600 transition-colors">Properties</Link>
            <button onClick={() => setShowRequirementForm(true)} className="hover:text-blue-600 transition-colors">Post Requirement</button>
            <Link href="/agent/login" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Agent Login</Link>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-xl active:scale-95 transition-transform">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 animate-in slide-in-from-top">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100">🏠 Home</Link>
            <Link href="#properties" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100">🏢 Properties</Link>
            <button onClick={() => { setShowRequirementForm(true); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100">📝 Post Requirement</button>
            <Link href="/agent/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-center">Agent Login</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-4 md:mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-xs md:text-sm font-medium">Now serving {selectedCity}</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-4 tracking-tight">
              Premium Commercial<br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Real Estate</span>
            </h1>
            <p className="text-blue-100/80 text-base md:text-xl max-w-2xl mx-auto mb-6 md:mb-10 px-4">
              Discover the finest retail spaces, offices, co-working hubs & investment opportunities
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-2 shadow-2xl shadow-blue-900/20 flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="appearance-none px-5 py-4 pr-10 rounded-xl text-gray-800 bg-gray-50 border border-gray-100 font-medium text-sm w-full md:w-44 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {cities.filter(c => c.status === 'active').map((city) => (
                      <option key={city._id} value={city.name}>{city.name}</option>
                    ))}
                    {cities.filter(c => c.status === 'coming_soon').map((city) => (
                      <option key={city._id} value={city.name} disabled>
                        {city.name} (Coming Soon)
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">📍</span>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by locality, area, property ID..."
                  className="flex-1 px-5 py-4 rounded-xl text-gray-800 border-0 outline-none text-sm placeholder-gray-400"
                />
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 text-sm">
                  🔍 Search
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="#F9FAFB"/></svg>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(categoryFilter === cat.key ? '' : cat.key)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                categoryFilter === cat.key
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                  : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{cat.label}</span>
              <span className="text-[10px] text-gray-400 mt-0.5 hidden md:block">{cat.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Transaction Type Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 id="properties" className="text-2xl md:text-3xl font-bold text-gray-900">
            {loading ? 'Discovering...' : `${properties.length} Properties`}
            <span className="text-lg font-normal text-gray-400 ml-2">in {selectedCity}</span>
          </h2>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTransactionFilter('')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${!transactionFilter ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setTransactionFilter('lease')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${transactionFilter === 'lease' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              For Lease
            </button>
            <button
              onClick={() => setTransactionFilter('sale')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${transactionFilter === 'sale' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              For Sale
            </button>
          </div>
        </div>
      </section>

      {/* Property Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!loading && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏗️</div>
            <p className="text-gray-600 text-lg font-medium">No properties found</p>
            <p className="text-gray-400 mt-1">Try changing your city or filters</p>
            <button onClick={() => setShowRequirementForm(true)} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Post Your Requirement
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              key={property._id}
              href={`/listing/${property.propertyId}`}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                {getCoverPhoto(property) ? (
                  <img
                    src={getCoverPhoto(property)!.url}
                    alt={property.propertyId}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${getCoverPhoto(property)!.isMasked ? 'blur-md' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">{categoryIcon(property.category)}</span>
                  </div>
                )}
                {getCoverPhoto(property)?.isMasked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm">
                    <span className="text-white/90 text-sm font-medium bg-black/30 px-3 py-1.5 rounded-lg">🔒 Restricted View</span>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${
                    property.transactionType === 'lease'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-violet-500 text-white'
                  }`}>
                    {property.transactionType === 'lease' ? 'LEASE' : 'SALE'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm">
                    {categoryLabel(property.category)}
                  </span>
                </div>
                {/* Photo count */}
                {property.photos?.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
                    📷 {property.photos.length}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">{property.propertyId}</span>
                  <span className="text-xs text-gray-400">{new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h3 className="text-gray-900 font-semibold text-base mb-1 group-hover:text-blue-600 transition-colors">
                  {categoryLabel(property.category)} {property.transactionType === 'lease' ? 'for Lease' : 'for Sale'}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span>📍</span>
                  {(property.fields?.locationArea?.checked && property.fields?.locationArea?.value) || property.city}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <div>
                    {getArea(property) && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{getArea(property)}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {getPrice(property) && (
                      <p className={`text-sm font-bold ${getPrice(property) === 'Call for Price' ? 'text-orange-600' : 'text-gray-900'}`}>
                        {getPrice(property)}
                        {getPrice(property) !== 'Call for Price' && (
                          <span className="text-xs font-normal text-gray-400">
                            {property.transactionType === 'lease' ? '/month' : ''}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why FourPs Section */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why FourPs Realty?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Your trusted partner for premium commercial real estate</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Precision', desc: 'Curated listings matched to your exact requirements' },
              { icon: '💎', title: 'Premium', desc: 'Grade A properties in prime business locations' },
              { icon: '🤝', title: 'Partnership', desc: 'Dedicated relationship managers for every client' },
              { icon: '⚡', title: 'Performance', desc: 'Fast closures with transparent dealings' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <span className="text-4xl block mb-3">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Can&apos;t find what you need?</h2>
          <p className="text-blue-100 mb-6">Tell us your requirements and we&apos;ll find the perfect space for you</p>
          <button
            onClick={() => setShowRequirementForm(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Post Your Requirement →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">4P</div>
                <span className="text-xl font-bold">FourPs<span className="text-blue-400">.in</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                India&apos;s premium commercial real estate platform. We connect businesses with the finest retail spaces, offices, co-working hubs & investment opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
              <div className="space-y-3 text-sm">
                <p><Link href="/" className="text-gray-300 hover:text-white transition-colors">All Properties</Link></p>
                <p><Link href="/agent/login" className="text-gray-300 hover:text-white transition-colors">Agent Portal</Link></p>
                <p><button onClick={() => setShowRequirementForm(true)} className="text-gray-300 hover:text-white transition-colors">Post Requirement</button></p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Get in Touch</h4>
              <p className="text-gray-400 text-sm mb-4">Have a query? Chat with us directly</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.624-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.115 0-4.09-.57-5.794-1.564l-.416-.247-2.746.872.874-2.686-.271-.432A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FourPs Realty. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Built with ❤️ for commercial real estate</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20FourPs!%20I%20would%20like%20to%20know%20more%20about%20your%20properties.`}
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all z-50 group"
        title="Chat on WhatsApp"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.624-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.115 0-4.09-.57-5.794-1.564l-.416-.247-2.746.872.874-2.686-.271-.432A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
        <span className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat with us</span>
      </a>

      {/* Post Your Requirement Pop-up */}
      {showRequirementForm && <RequirementModal onClose={() => setShowRequirementForm(false)} cities={cities} />}
    </div>
  );
}

function RequirementModal({ onClose, cities }: { onClose: () => void; cities: { _id: string; name: string; status: string }[] }) {
  const [form, setForm] = useState({ name: '', mobile: '', city: '', lookingFor: '', propertyType: '', location: '', area: '', budget: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/public/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: 'requirement' }),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Post Your Requirement</h3>
            <p className="text-sm text-gray-500">Tell us what you&apos;re looking for</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Requirement Submitted!</h4>
            <p className="text-gray-500 mb-6">Our team will get back to you shortly on WhatsApp.</p>
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Mobile *</label>
                <input type="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">City *</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none">
                  <option value="">Select city</option>
                  {cities.filter(c => c.status !== 'hidden').map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Looking For *</label>
                <select value={form.lookingFor} onChange={e => setForm({ ...form, lookingFor: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none">
                  <option value="">Select</option>
                  <option value="Lease">Lease</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Property Type</label>
                <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none">
                  <option value="">Select type</option>
                  <option>Retail</option><option>Office</option><option>Co-working</option><option>Plot</option><option>Land</option><option>Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Preferred Area/Locality</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Banjara Hills" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Area Required</label>
                <input type="text" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. 2000 sq ft" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Budget/Rent Range</label>
                <input type="text" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="e.g. ₹50-60/sq ft" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Additional Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any specific requirements..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none resize-none" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/25">
              {submitting ? 'Submitting...' : 'Submit Requirement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

