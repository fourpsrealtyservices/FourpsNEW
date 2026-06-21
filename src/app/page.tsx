'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface City { _id: string; name: string; status: string; }
interface Testimonial { _id: string; name: string; role: string; text: string; imageUrl: string; }
interface Property {
  _id: string; propertyId: string; city: string; transactionType: string; category: string;
  officeType?: string; fields: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos: { url: string; isCover: boolean; isMasked: boolean; label: string }[]; createdAt: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

const AREA_SUGGESTIONS = [
  'Banjara Hills', 'Jubilee Hills', 'HITEC City', 'Madhapur', 'Gachibowli', 'Kondapur',
  'Ameerpet', 'Kukatpally', 'Begumpet', 'Secunderabad', 'Somajiguda', 'Punjagutta',
  'Manikonda', 'Nanakramguda', 'Financial District', 'Miyapur', 'Tolichowki', 'Attapur',
];

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [transactionFilter, setTransactionFilter] = useState('lease');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => { fetch('/api/public/cities').then(r => r.json()).then(setCities); }, []);
  useEffect(() => { fetch('/api/public/testimonials').then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); }); }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (transactionFilter) params.set('transactionType', transactionFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (search) params.set('search', search);
    fetch(`/api/public/properties?${params}`).then(r => r.json()).then(data => { setProperties(data); setLoading(false); });
  }, [selectedCity, transactionFilter, categoryFilter, search]);

  useEffect(() => { const t = setTimeout(() => setShowRequirementForm(true), 45000); return () => clearTimeout(t); }, []);

  const getCoverPhoto = (p: Property) => p.photos?.find(x => x.isCover) || p.photos?.[0] || null;
  const getPrice = (p: Property) => {
    const r = p.fields?.expectedRent || p.fields?.expectedSalePrice || p.fields?.expectedRentPerSeat || p.fields?.expectedPrice;
    if (!r?.checked) return ''; if (r.value === 'Call for Price') return 'Call for Price'; return `₹${r.value}`;
  };
  const getArea = (p: Property) => {
    const a = p.fields?.superBuiltUpArea || p.fields?.carpetArea || p.fields?.plotArea || p.fields?.assetSize || p.fields?.seatsAvailable;
    if (a?.checked && a.value) { if (typeof a.value === 'string' && a.value.includes(' to ')) return `${a.value} ${a.unit || 'seats'}`; return `${a.value} ${a.unit || 'sq ft'}`; } return '';
  };
  const categoryLabel = (c: string) => ({ retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land', investment: 'Investment', rental_income: 'Rental Income' }[c] || c);
  const categoryIcon = (c: string) => ({ retail: '🏪', office: '🏢', coworking: '👥', commercial_plot: '🏭', land_plot: '🌍', investment: '📈', rental_income: '🏠' }[c] || '🏠');

  const filteredSuggestions = AREA_SUGGESTIONS.filter(a => a.toLowerCase().includes(search.toLowerCase()));

  const leaseCategories = [
    { key: 'retail', label: 'Retail', icon: '🏪' },
    { key: 'office', label: 'Office', icon: '🏢' },
    { key: 'coworking', label: 'Co-working', icon: '👥' },
    { key: 'commercial_plot', label: 'Commercial Plot', icon: '🏭' },
  ];

  const saleCategories = [
    { key: 'retail', label: 'Retail', icon: '🏪' },
    { key: 'office', label: 'Office', icon: '🏢' },
    { key: 'rental_income', label: 'Rental Income Properties', icon: '🏠' },
    { key: 'investment', label: 'Investment', icon: '📈' },
  ];

  const categories = transactionFilter === 'sale' ? saleCategories : leaseCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner - Compact with Real Estate Background */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-gray-900/60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 pb-24 md:pb-28 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Commercial Real Estate<br />Made Simple!
          </h1>

          {/* For Lease / For Sale Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => { setTransactionFilter(transactionFilter === 'lease' ? '' : 'lease'); setCategoryFilter(''); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${transactionFilter === 'lease' ? 'bg-violet-500 text-white shadow-lg' : 'bg-white/15 backdrop-blur-sm text-white border border-white/20'}`}>
              For Lease
            </button>
            <button onClick={() => { setTransactionFilter(transactionFilter === 'sale' ? '' : 'sale'); setCategoryFilter(''); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${transactionFilter === 'sale' ? 'bg-violet-500 text-white shadow-lg' : 'bg-white/15 backdrop-blur-sm text-white border border-white/20'}`}>
              For Sale
            </button>
          </div>

          {/* Category Icons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(categoryFilter === cat.key ? '' : cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                  categoryFilter === cat.key ? 'bg-white text-gray-900 shadow-lg' : 'bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Bar with Area Suggestions */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search area, locality..."
                  className="w-full px-5 py-3.5 rounded-xl text-gray-800 border border-gray-100 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-100"
                />
                {/* Area Suggestions Dropdown */}
                {showSuggestions && search.length > 0 && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-[156px] overflow-y-auto">
                    {filteredSuggestions.map(area => (
                      <button key={area} onMouseDown={() => { setSearch(area); setShowSuggestions(false); }} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 active:bg-blue-100 border-b border-gray-50 last:border-0">
                        📍 {area}
                      </button>
                    ))}
                  </div>
                )}
                {showSuggestions && search.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-[156px] overflow-y-auto">
                    <p className="px-4 py-2 text-xs text-gray-400 font-medium">Popular Areas</p>
                    {AREA_SUGGESTIONS.slice(0, 8).map(area => (
                      <button key={area} onMouseDown={() => { setSearch(area); setShowSuggestions(false); }} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 active:bg-blue-100 border-b border-gray-50 last:border-0">
                        📍 {area}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link href={`/properties?city=${selectedCity}&search=${search}&transactionType=${transactionFilter}&category=${categoryFilter}`} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-center active:scale-95">
                Search →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section - Only 2 rows (6 items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Latest Properties</h2>
          <Link href="/properties" className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1">
            See All →
          </Link>
        </div>

        {loading && <div className="text-center py-10"><div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>}

        {!loading && properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🏗️</div>
            <p className="text-gray-600 font-semibold">No properties found</p>
            <button onClick={() => setShowRequirementForm(true)} className="mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm">Post Requirement</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.slice(0, 6).map((property) => (
            <Link key={property._id} href={`/listing/${property.propertyId}`} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {getCoverPhoto(property) ? (
                  <img src={getCoverPhoto(property)!.url} alt="" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${getCoverPhoto(property)!.isMasked ? 'blur-md' : ''}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"><span className="text-4xl opacity-30">{categoryIcon(property.category)}</span></div>
                )}
                {/* Category badge top-right */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm">
                  {categoryLabel(property.category)}
                </span>
                {/* Transaction badge top-left */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow bg-violet-500 text-white">
                  {property.transactionType === 'lease' ? 'LEASE' : 'SALE'}
                </span>
                {property.photos?.length > 1 && <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">📷 {property.photos.length}</span>}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{property.propertyId}</span>
                  {/* Price/Call for Price tag - always visible */}
                  {getPrice(property) && (
                    <span className={`text-sm font-bold ${getPrice(property) === 'Call for Price' ? 'text-orange-600' : 'text-gray-900'}`}>
                      {getPrice(property)}
                    </span>
                  )}
                </div>
                <h3 className="text-gray-900 font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">{categoryLabel(property.category)} for {property.transactionType === 'lease' ? 'Lease' : 'Sale'}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1">📍 {(property.fields?.locationArea?.checked && property.fields?.locationArea?.value) || property.city}</p>
                {getArea(property) && <p className="text-xs text-gray-500 mt-1"><span className="font-medium text-gray-700">{getArea(property)}</span></p>}
              </div>
            </Link>
          ))}
        </div>

        {properties.length > 6 && (
          <div className="text-center mt-8">
            <Link href="/properties" target="_blank" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all">
              See More Properties →
            </Link>
          </div>
        )}
      </section>

      {/* Client Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-white py-14 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-10">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex gap-1 text-yellow-400 mb-3">{'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}</div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{t.name.charAt(0)}</div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog / Insights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-3">Insights & Market Updates</h2>
        <p className="text-gray-500 text-center mb-10">Stay informed about the commercial real estate market</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Why HITEC City is the #1 Choice for IT Offices in 2025', tag: 'Market Trends', date: 'May 2025', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
            { title: 'Complete Guide: Leasing Commercial Space in Hyderabad', tag: 'Guide', date: 'Apr 2025', img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80' },
            { title: 'Top 5 Emerging Commercial Hubs in Hyderabad', tag: 'Insights', date: 'Mar 2025', img: 'https://images.unsplash.com/photo-1582407947092-79ad8656ff9d?auto=format&fit=crop&w=600&q=80' },
          ].map((blog, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="h-40 overflow-hidden">
                <img src={blog.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{blog.tag}</span>
                  <span className="text-xs text-gray-400">{blog.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">{blog.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why FourPs */}
      <section className="bg-white border-t border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-10">Why Choose FourPs Realty?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Precision', desc: 'Curated listings matched to your needs' },
              { icon: '💎', title: 'Premium', desc: 'Grade A properties in prime locations' },
              { icon: '🤝', title: 'Partnership', desc: 'Dedicated relationship managers' },
              { icon: '⚡', title: 'Performance', desc: 'Fast closures, transparent deals' },
            ].map(item => (
              <div key={item.title} className="text-center p-5 rounded-2xl hover:bg-gray-50 transition-colors">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <h3 className="font-extrabold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src="/logo.webp" alt="FourPs Realty" className="h-10 w-auto mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">Can&apos;t find what you need?</h2>
          <p className="text-blue-100 text-sm mb-5">Tell us your requirements and we&apos;ll find the perfect space</p>
          <button onClick={() => setShowRequirementForm(true)} className="bg-white text-blue-600 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 shadow-lg active:scale-95 transition-all">Post Your Requirement →</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.webp" alt="FourPs Realty" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">India&apos;s premium commercial real estate platform. Retail, Office, Co-working & Investment spaces.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <p><Link href="/properties" className="text-gray-300 hover:text-white">All Properties</Link></p>
                <p><Link href="/growth-corridors" className="text-gray-300 hover:text-white">Growth Corridors</Link></p>
                <p><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></p>
                <p><Link href="/services" className="text-gray-300 hover:text-white">Services</Link></p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Contact</h4>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center">
            <p className="text-gray-500 text-xs">© {new Date().getFullYear()} FourPs Realty. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20FourPs!%20I%20would%20like%20to%20know%20more%20about%20your%20properties.`} target="_blank" className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all z-50">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
      </a>

      {showRequirementForm && <RequirementModal onClose={() => setShowRequirementForm(false)} cities={cities} />}
    </div>
  );
}

function RequirementModal({ onClose, cities }: { onClose: () => void; cities: { _id: string; name: string; status: string }[] }) {
  const [form, setForm] = useState({ name: '', mobile: '', city: '', lookingFor: '', propertyType: '', location: '', area: '', budget: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch('/api/public/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'requirement' }) });
    if (res.ok) setSubmitted(true); setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
          <div><h3 className="text-lg font-extrabold text-gray-900">Post Your Requirement</h3><p className="text-xs text-gray-500">Tell us what you&apos;re looking for</p></div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">✕</button>
        </div>
        {submitted ? (
          <div className="p-8 text-center"><div className="text-5xl mb-3">✅</div><h4 className="text-lg font-bold text-gray-900 mb-2">Submitted!</h4><p className="text-gray-500 text-sm mb-5">We&apos;ll get back to you shortly.</p><button onClick={onClose} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm">Done</button></div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mobile *</label><input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">City *</label><select value={form.city} onChange={e => setForm({...form, city: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300"><option value="">Select</option>{cities.filter(c=>c.status!=='hidden').map(c=><option key={c._id} value={c.name}>{c.name}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Looking For *</label><select value={form.lookingFor} onChange={e => setForm({...form, lookingFor: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300"><option value="">Select</option><option value="Lease">Lease</option><option value="Sale">Sale</option></select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Property Type</label><select value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300"><option value="">Select</option><option>Retail</option><option>Office</option><option>Co-working</option><option>Plot/Warehouse</option></select></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Area/Locality</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. HITEC City" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Area Required</label><input type="text" value={form.area} onChange={e => setForm({...form, area: e.target.value})} placeholder="e.g. 2000 sq ft" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Budget</label><input type="text" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="e.g. ₹50-60/sq ft" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300" /></div>
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} placeholder="Any specific requirements..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-blue-300 resize-none" /></div>
            <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 active:scale-95 transition-all">{submitting ? 'Submitting...' : 'Submit Requirement'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
