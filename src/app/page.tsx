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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/public/cities').then(r => r.json()).then(setCities);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (transactionFilter) params.set('transactionType', transactionFilter);
    if (search) params.set('search', search);

    fetch(`/api/public/properties?${params}`).then(r => r.json()).then(data => {
      setProperties(data);
      setLoading(false);
    });
  }, [selectedCity, transactionFilter, search]);

  const getCoverPhoto = (property: Property) => {
    const cover = property.photos?.find(p => p.isCover);
    return cover || property.photos?.[0] || null;
  };

  const getPrice = (property: Property) => {
    const rent = property.fields?.expectedRent || property.fields?.expectedSalePrice || property.fields?.expectedRentPerSeat || property.fields?.expectedPrice;
    return rent?.checked ? rent.value as string : '';
  };

  const getArea = (property: Property) => {
    const area = property.fields?.superBuiltUpArea || property.fields?.carpetArea || property.fields?.plotArea || property.fields?.assetSize || property.fields?.seatsAvailable;
    if (area?.checked && area.value) return `${area.value} ${area.unit || 'sq ft'}`;
    return '';
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = { retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment' };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-900">FourPs<span className="text-blue-500">.in</span></Link>
          <nav className="hidden md:flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/properties" className="hover:text-blue-600">Properties</Link>
            <Link href="/agent/login" className="hover:text-blue-600">Agent Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Perfect Commercial Space</h1>
          <p className="text-blue-200 text-lg mb-8">Premium commercial real estate — Retail, Office, Co-working & More</p>

          {/* Search Bar with City Selector */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-800 bg-gray-50 border-0 font-medium"
            >
              {cities.map((city) => (
                <option key={city._id} value={city.name} disabled={city.status === 'coming_soon'}>
                  {city.name}{city.status === 'coming_soon' ? ' (Coming Soon)' : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by locality, property ID..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 border-0 outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Transaction Type Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setTransactionFilter('')}
            className={`px-6 py-2 rounded-full font-medium text-sm ${!transactionFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setTransactionFilter('lease')}
            className={`px-6 py-2 rounded-full font-medium text-sm ${transactionFilter === 'lease' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            For Lease
          </button>
          <button
            onClick={() => setTransactionFilter('sale')}
            className={`px-6 py-2 rounded-full font-medium text-sm ${transactionFilter === 'sale' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            For Sale
          </button>
        </div>
      </section>

      {/* Property Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {loading ? 'Loading...' : `${properties.length} Properties in ${selectedCity}`}
        </h2>

        {!loading && properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found in {selectedCity}.</p>
            <p className="text-gray-400 mt-2">Try changing the city or filters.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              key={property._id}
              href={`/listing/${property.propertyId}`}
              className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden group"
            >
              <div className="relative h-48 bg-gray-100">
                {getCoverPhoto(property) ? (
                  <img
                    src={getCoverPhoto(property)!.url}
                    alt={property.propertyId}
                    className={`w-full h-full object-cover ${getCoverPhoto(property)!.isMasked ? 'blur-sm' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🏢</div>
                )}
                {getCoverPhoto(property)?.isMasked && (
                  <span className="absolute inset-0 flex items-center justify-center text-white font-medium bg-black/20">🔒 Image Restricted</span>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${property.transactionType === 'lease' ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`}>
                    {property.transactionType === 'lease' ? 'Lease' : 'Sale'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-white/90 text-gray-700">
                    {categoryLabel(property.category)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-blue-600 font-bold">{property.propertyId}</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {(property.fields?.locationArea?.checked && property.fields?.locationArea?.value) || property.city}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {getArea(property) && <span>{getArea(property)}</span>}
                  {getPrice(property) && <span className="font-medium text-gray-800">₹{getPrice(property)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FourPs<span className="text-blue-400">.in</span></h3>
              <p className="text-gray-400">Premium commercial real estate platform. Find the perfect space for your business.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <p><Link href="/properties" className="hover:text-white">All Properties</Link></p>
                <p><Link href="/agent/login" className="hover:text-white">Agent Login</Link></p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-gray-400">WhatsApp us for enquiries</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FourPs Realty. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20FourPs!%20I%20would%20like%20to%20know%20more%20about%20your%20properties.`}
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-green-600 z-50"
        title="Chat on WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
