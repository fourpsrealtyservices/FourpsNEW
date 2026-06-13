'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Property {
  _id: string;
  propertyId: string;
  city: string;
  transactionType: string;
  category: string;
  officeType?: string;
  fields: Record<string, { value: string | string[]; checked: boolean; unit?: string }>;
  photos: { url: string; publicId: string; isCover: boolean; isMasked: boolean; label: string }[];
  submittedBy?: { type: string; name: string };
  createdAt: string;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fourps.in';

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', mobile: '', email: '', message: '', preferredCallbackTime: '' });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/public/properties/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setProperty(null);
        else setProperty(data);
        setLoading(false);
      });
  }, [id]);

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = { retail: 'Retail', office: 'Office', coworking: 'Co-working', commercial_plot: 'Commercial Plot', land_plot: 'Land/Plot', investment: 'Investment' };
    return labels[cat] || cat;
  };

  const getWhatsAppShareMessage = () => {
    if (!property) return '';
    const location = property.fields?.locationArea?.checked ? property.fields.locationArea.value : property.city;
    const area = property.fields?.superBuiltUpArea?.checked ? `${property.fields.superBuiltUpArea.value} sq ft` : '';
    return encodeURIComponent(
      `Hi! Check out this property on FourPs Realty:\n${categoryLabel(property.category)} for ${property.transactionType === 'lease' ? 'Lease' : 'Sale'} | ID: ${property.propertyId}\n${location ? `Location: ${location}` : ''}${area ? ` | Area: ${area}` : ''}\nView details: ${SITE_URL}/listing/${property.propertyId}`
    );
  };

  const getWhatsAppEnquiryMessage = () => {
    if (!property) return '';
    return encodeURIComponent(`Hi FourPs! I'm interested in Property ID: ${property.propertyId}. Please share more details.`);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/public/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'enquiry',
        ...enquiryForm,
        propertyId: property?.propertyId,
        message: enquiryForm.message || `I am interested in Property ID: ${property?.propertyId}`,
      }),
    });
    if (res.ok) setEnquirySubmitted(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Property not found</p></div>;

  const checkedFields = Object.entries(property.fields || {}).filter(([, v]) => v.checked && v.value && (Array.isArray(v.value) ? v.value.length > 0 : v.value !== ''));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-900">FourPs<span className="text-blue-500">.in</span></Link>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">← Back to Listings</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property ID & Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-lg font-bold text-blue-600">{property.propertyId}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${property.transactionType === 'lease' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
            For {property.transactionType === 'lease' ? 'Lease' : 'Sale'}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{categoryLabel(property.category)}</span>
          {property.officeType && <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 capitalize">{property.officeType}</span>}
          <span className="text-sm text-gray-500">📍 {property.city}</span>
        </div>

        {/* Photo Gallery */}
        {property.photos && property.photos.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.photos.map((photo, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.label || `Photo ${i + 1}`}
                    className={`w-full h-64 object-cover ${photo.isMasked ? 'blur-sm' : ''}`}
                  />
                  {photo.label && <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{photo.label}</span>}
                  {photo.isMasked && <span className="absolute inset-0 flex items-center justify-center text-white font-medium bg-black/20">🔒 Image Restricted</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {checkedFields.map(([key, field]) => (
                  <div key={key} className="border-b pb-3">
                    <p className="text-xs text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</p>
                    <p className="text-gray-800 font-medium">
                      {Array.isArray(field.value) ? field.value.join(', ') : field.value}
                      {field.unit ? ` ${field.unit}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            {/* WhatsApp Enquiry */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppEnquiryMessage()}`}
              target="_blank"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700"
            >
              💬 Enquire on WhatsApp
            </a>

            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${getWhatsAppShareMessage()}`}
              target="_blank"
              className="block w-full bg-white border-2 border-green-600 text-green-700 text-center py-3 rounded-lg font-medium hover:bg-green-50"
            >
              📤 Share on WhatsApp
            </a>

            {/* Callback Form Toggle */}
            <button
              onClick={() => setShowEnquiry(!showEnquiry)}
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              📞 Request Callback
            </button>

            {/* Enquiry Form */}
            {showEnquiry && !enquirySubmitted && (
              <form onSubmit={handleEnquirySubmit} className="bg-white rounded-xl border p-4 space-y-3">
                <input type="text" required placeholder="Your Name" value={enquiryForm.name} onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800" />
                <input type="tel" required placeholder="Mobile Number" value={enquiryForm.mobile} onChange={e => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800" />
                <input type="email" placeholder="Email (optional)" value={enquiryForm.email} onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800" />
                <textarea placeholder={`I am interested in Property ID: ${property.propertyId}`} value={enquiryForm.message} onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800" />
                <select value={enquiryForm.preferredCallbackTime} onChange={e => setEnquiryForm({ ...enquiryForm, preferredCallbackTime: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800">
                  <option value="">Preferred callback time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Submit Enquiry</button>
              </form>
            )}
            {enquirySubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium">✅ Enquiry Submitted!</p>
                <p className="text-green-600 text-sm mt-1">We&apos;ll get back to you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppEnquiryMessage()}`}
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-green-600 z-50"
      >
        💬
      </a>
    </div>
  );
}
