'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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

const WHATSAPP_NUMBER = '919059909675';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fourps.in';

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
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

  const fieldLabel = (key: string) => {
    const labels: Record<string, string> = {
      locationArea: 'Location / Area', superBuiltUpArea: 'Super Built-up Area', carpetArea: 'Carpet Area',
      floor: 'Floor', frontage: 'Frontage', ceilingBeamHeight: 'Ceiling Height', roadWidthInFront: 'Road Width',
      expectedRent: 'Expected Rent', expectedSalePrice: 'Expected Price', expectedRentPerSeat: 'Rent / Seat',
      expectedPrice: 'Expected Price', expectedReturns: 'Expected Returns', buildingStatus: 'Building Status',
      buildingType: 'Building Type', parking: 'Parking', description: 'Description', seatsAvailable: 'Seats Available',
      amenities: 'Amenities', plotArea: 'Plot Area', dimensions: 'Dimensions', landUseZoning: 'Land Use / Zoning',
      investmentType: 'Investment Type', assetSize: 'Asset Size', tenant: 'Tenant',
    };
    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading property details...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🏚️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Property Not Found</h2>
        <p className="text-gray-500 mb-6">The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">Browse All Properties</Link>
      </div>
    </div>
  );

  // On individual property detail page, show ALL fields that have a value (not just checked ones)
  const checkedFields = Object.entries(property.fields || {}).filter(([, v]) => v.value && (Array.isArray(v.value) ? v.value.length > 0 : v.value !== ''));
  const visiblePhotos = property.photos || [];
  const currentPhoto = visiblePhotos[selectedPhoto];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Top Bar - Property ID & Quick Info */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{property.propertyId}</span>
          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${property.transactionType === 'lease' ? 'bg-emerald-100 text-emerald-800' : 'bg-violet-100 text-violet-800'}`}>
            For {property.transactionType === 'lease' ? 'Lease' : 'Sale'}
          </span>
          <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700">{categoryLabel(property.category)}</span>
          {property.officeType && <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 capitalize">{property.officeType}</span>}
          <span className="text-sm text-gray-400 ml-auto">Listed {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            {visiblePhotos.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                {/* Main Photo */}
                <div className="relative h-72 md:h-96 bg-gray-100">
                  {currentPhoto && (
                    <>
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.label || `Photo ${selectedPhoto + 1}`}
                        className={`w-full h-full object-cover ${currentPhoto.isMasked ? 'blur-lg' : ''}`}
                      />
                      {currentPhoto.isMasked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
                          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-gray-700 shadow-sm">
                            🔒 Image restricted for privacy
                          </div>
                        </div>
                      )}
                      {currentPhoto.label && !currentPhoto.isMasked && (
                        <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg">{currentPhoto.label}</span>
                      )}
                      <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
                        {selectedPhoto + 1} / {visiblePhotos.length}
                      </span>
                      {/* Nav Arrows */}
                      {visiblePhotos.length > 1 && (
                        <>
                          <button onClick={() => setSelectedPhoto(p => p > 0 ? p - 1 : visiblePhotos.length - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors text-gray-700">❮</button>
                          <button onClick={() => setSelectedPhoto(p => p < visiblePhotos.length - 1 ? p + 1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors text-gray-700">❯</button>
                        </>
                      )}
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                {visiblePhotos.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto bg-white">
                    {visiblePhotos.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPhoto(i)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedPhoto === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={photo.url} alt="" className={`w-full h-full object-cover ${photo.isMasked ? 'blur-sm' : ''}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Property Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
                <p className="text-sm text-gray-400">
                  {categoryLabel(property.category)} for {property.transactionType === 'lease' ? 'Lease' : 'Sale'} in {property.city}
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {checkedFields.map(([key, field]) => (
                    <div key={key} className={`${key === 'description' ? 'sm:col-span-2' : ''}`}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{fieldLabel(key)}</p>
                      <p className={`font-medium ${
                        field.value === 'Call for Price' ? 'text-orange-600' : 'text-gray-900'
                      } ${key === 'description' ? 'text-sm text-gray-600 font-normal leading-relaxed whitespace-pre-wrap' : ''}`}>
                        {Array.isArray(field.value) ? (
                          <span className="flex flex-wrap gap-1.5">
                            {field.value.map((v, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">{v}</span>
                            ))}
                          </span>
                        ) : (
                          <>
                            {field.value}
                            {field.unit ? <span className="text-gray-400 text-sm ml-1">{field.unit}</span> : ''}
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                {checkedFields.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No details available for this listing yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Actions */}
          <div className="space-y-4">
            {/* Sticky Action Card */}
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Quick Price/Area Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Summary</h3>
                {property.fields?.locationArea?.checked && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📍</span>
                    <span className="text-gray-900 font-medium">{property.fields.locationArea.value as string}, {property.city}</span>
                  </div>
                )}
                {(property.fields?.expectedRent?.checked || property.fields?.expectedSalePrice?.checked || property.fields?.expectedRentPerSeat?.checked || property.fields?.expectedPrice?.checked) && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💰</span>
                    <span className={`font-bold ${
                      (property.fields?.expectedRent?.value || property.fields?.expectedSalePrice?.value || property.fields?.expectedRentPerSeat?.value || property.fields?.expectedPrice?.value) === 'Call for Price'
                        ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {(() => {
                        const p = property.fields?.expectedRent || property.fields?.expectedSalePrice || property.fields?.expectedRentPerSeat || property.fields?.expectedPrice;
                        if (!p?.checked) return '';
                        return p.value === 'Call for Price' ? 'Call for Price' : `₹${p.value}`;
                      })()}
                    </span>
                  </div>
                )}
                {(property.fields?.superBuiltUpArea?.checked || property.fields?.carpetArea?.checked || property.fields?.plotArea?.checked) && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📐</span>
                    <span className="text-gray-900 font-medium">
                      {(() => {
                        const a = property.fields?.superBuiltUpArea || property.fields?.carpetArea || property.fields?.plotArea;
                        return a?.checked ? `${a.value} ${a.unit || 'sq ft'}` : '';
                      })()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Interested?</h3>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppEnquiryMessage()}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  Enquire on WhatsApp
                </a>

                <a
                  href={`https://wa.me/?text=${getWhatsAppShareMessage()}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  📤 Share this Property
                </a>

                <button
                  onClick={() => setShowEnquiry(!showEnquiry)}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  📞 Request Callback
                </button>
              </div>

              {/* Enquiry Form */}
              {showEnquiry && !enquirySubmitted && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <h3 className="font-semibold text-gray-800">Request a Callback</h3>
                    <p className="text-xs text-gray-500">Fill in your details and we&apos;ll call you back</p>
                  </div>
                  <form onSubmit={handleEnquirySubmit} className="p-5 space-y-3">
                    <input type="text" required placeholder="Your Name *" value={enquiryForm.name} onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
                    <input type="tel" required placeholder="Mobile Number *" value={enquiryForm.mobile} onChange={e => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
                    <input type="email" placeholder="Email (optional)" value={enquiryForm.email} onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" />
                    <textarea placeholder={`I am interested in Property ID: ${property.propertyId}`} value={enquiryForm.message} onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none resize-none" />
                    <select value={enquiryForm.preferredCallbackTime} onChange={e => setEnquiryForm({ ...enquiryForm, preferredCallbackTime: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none">
                      <option value="">Preferred callback time (optional)</option>
                      <option value="Morning">Morning (9am-12pm)</option>
                      <option value="Afternoon">Afternoon (12pm-4pm)</option>
                      <option value="Evening">Evening (4pm-8pm)</option>
                    </select>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Submit Enquiry
                    </button>
                  </form>
                </div>
              )}
              {enquirySubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-green-800 font-semibold">Enquiry Submitted!</p>
                  <p className="text-green-600 text-sm mt-1">Our team will call you back shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp - hidden on mobile since we have bottom bar */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppEnquiryMessage()}`}
        target="_blank"
        className="hidden lg:flex fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full items-center justify-center shadow-xl shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all z-50"
        title="Chat on WhatsApp"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
      </a>

      {/* Mobile Bottom Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppEnquiryMessage()}`}
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          Enquire
        </a>
        <button
          onClick={() => setShowEnquiry(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
        >
          📞 Callback
        </button>
        <a
          href={`https://wa.me/?text=${getWhatsAppShareMessage()}`}
          target="_blank"
          className="w-12 flex items-center justify-center bg-gray-100 text-gray-700 rounded-xl active:scale-95 transition-transform"
        >
          📤
        </a>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
}
