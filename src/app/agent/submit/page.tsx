'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getFieldsForCategory, FieldDefinition } from '@/lib/propertyFields';

interface City { _id: string; name: string; status: string; }
interface Photo { url: string; publicId: string; label: string; isMasked: boolean; isCover: boolean; order: number; }

export default function AgentSubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [city, setCity] = useState('');
  const [transactionType, setTransactionType] = useState<'lease' | 'sale' | ''>('');
  const [category, setCategory] = useState('');
  const [officeType, setOfficeType] = useState<'furnished' | 'unfurnished' | ''>('');

  // Dynamic fields
  const [fieldValues, setFieldValues] = useState<Record<string, { value: string | string[]; checked: boolean; unit?: string }>>({});

  // Nearby areas for search
  const [nearbyAreas, setNearbyAreas] = useState<string[]>([]);
  const [nearbyInput, setNearbyInput] = useState('');
  const [areaOptions, setAreaOptions] = useState<string[]>([]);

  // Custom heading (optional)
  const [customHeading, setCustomHeading] = useState('');

  // Backend-only fields
  const [locationPin, setLocationPin] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactDesignation, setContactDesignation] = useState('');
  const [remarks, setRemarks] = useState('');

  // Photos
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/public/cities').then(r => r.json()).then(data => setCities(data.filter((c: City) => c.status === 'active')));
  }, []);

  // Fetch localities when city changes
  useEffect(() => {
    if (city) {
      fetch(`/api/public/localities?city=${city}`).then(r => r.json()).then((data: { name: string }[]) => {
        if (Array.isArray(data)) setAreaOptions(data.map((l: { name: string }) => l.name));
      });
    }
  }, [city]);

  // Initialize field values when category is selected
  useEffect(() => {
    if (transactionType && category) {
      const fields = getFieldsForCategory(transactionType, category);
      const init: Record<string, { value: string | string[]; checked: boolean; unit?: string }> = {};
      fields.forEach(f => { init[f.key] = { value: f.type === 'multi-checkbox' ? [] : '', checked: false, unit: f.unit || '' }; });
      setFieldValues(init);
    }
  }, [transactionType, category]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          setPhotos(prev => [...prev, { url: data.url, publicId: data.publicId, label: '', isMasked: false, isCover: prev.length === 0, order: prev.length }]);
        }
      } catch (err: unknown) { console.error('Upload failed:', err); }
    }
    setUploading(false);
    e.target.value = '';
  };

  const updatePhotoLabel = (index: number, label: string) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, label } : p));
  };

  const togglePhotoMask = (index: number) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, isMasked: !p.isMasked } : p));
  };

  const setCoverPhoto = (index: number) => {
    setPhotos(prev => prev.map((p, i) => ({ ...p, isCover: i === index })));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (asDraft = false) => {
    // Validate minimum 4 checkboxes are ticked (only for submit, not drafts)
    if (!asDraft) {
      const checkedCount = Object.values(fieldValues).filter(f => f.checked && f.value && (Array.isArray(f.value) ? f.value.length > 0 : f.value !== '')).length;
      if (checkedCount < 4) {
        alert(`Please fill and check at least 4 fields before submitting. Currently only ${checkedCount} field(s) are checked.`);
        return;
      }
    }
    setLoading(true);
    try {
      const res = await fetch('/api/agent/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          transactionType,
          category,
          officeType: category === 'office' ? officeType : undefined,
          customHeading: customHeading || undefined,
          fields: fieldValues,
          nearbyAreas,
          locationPin,
          contactName,
          contactMobile,
          contactDesignation,
          remarks: remarks || undefined,
          photos,
          status: asDraft ? 'draft' : 'pending',
        }),
      });

      if (res.ok) {
        if (asDraft) {
          alert('Property saved as draft!');
        } else {
          alert('Property submitted for Admin approval!');
        }
        router.push('/agent');
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } catch {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FieldDefinition) => {
    const fs = fieldValues[field.key];
    if (!fs) return null;
    const isCFP = fs.value === 'Call for Price';
    return (
      <div key={field.key} className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <input type="checkbox" checked={fs.checked} onChange={() => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], checked: !p[field.key].checked } }))} className="w-4 h-4 rounded" title="Check to show this field on the public listing" />
          <label className="font-medium text-gray-700">{field.label}</label>
          {field.unit && <span className="text-xs text-gray-500">({field.unit})</span>}
          {!fs.checked && <span className="text-xs text-orange-500 ml-auto">Hidden on listing</span>}
        </div>
        <div className="ml-7">
          {field.hasCFP && (
            <label className="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isCFP} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.checked ? 'Call for Price' : '' } }))} className="w-3.5 h-3.5" />
              <span className="text-orange-700 font-medium">Call for Price</span>
            </label>
          )}
          {!isCFP && field.type === 'text' && (
            <input type="text" value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} placeholder={field.placeholder || ''} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
          )}
          {!isCFP && field.type === 'number' && (
            <div className="flex gap-2 items-center">
              <input type="number" value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} placeholder={field.placeholder || '0'} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
              {field.unit && <span className="text-sm text-gray-500 whitespace-nowrap">{field.unit}</span>}
            </div>
          )}
          {!isCFP && field.type === 'range' && (
            <div className="flex gap-2 items-center">
              <input type="number" value={(fs.value as string).split(' to ')[0] || ''} onChange={e => { const max = (fs.value as string).split(' to ')[1] || ''; setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: `${e.target.value} to ${max}` } })); }} placeholder={field.placeholderMin || 'Min'} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
              <span className="text-sm text-gray-500">to</span>
              <input type="number" value={(fs.value as string).split(' to ')[1] || ''} onChange={e => { const min = (fs.value as string).split(' to ')[0] || ''; setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: `${min} to ${e.target.value}` } })); }} placeholder={field.placeholderMax || 'Max'} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
              {field.unit && <span className="text-sm text-gray-500 whitespace-nowrap">{field.unit}</span>}
            </div>
          )}
          {field.type === 'textarea' && (
            <textarea value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} placeholder={field.placeholder} rows={3} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
          )}
          {field.type === 'dropdown' && (
            <select value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm">
              <option value="">Select...</option>
              {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {field.type === 'multi-checkbox' && (
            <div className="flex flex-wrap gap-2">
              {field.options?.map(o => (
                <label key={o} className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded">
                  <input type="checkbox" checked={(fs.value as string[]).includes(o)} onChange={e => { const curr = fs.value as string[]; const upd = e.target.checked ? [...curr, o] : curr.filter(v => v !== o); setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: upd } })); }} className="w-3 h-3" />{o}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/agent" className="text-blue-600 hover:text-blue-800">← Back</Link>
          <h1 className="text-xl font-bold text-gray-800">Submit Property</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-6">
          ⚠️ Your submission will be reviewed by Admin before publishing.
        </div>

        {/* Step 1: City */}
        {step >= 1 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select City</h3>
            <select value={city} onChange={e => { setCity(e.target.value); if (e.target.value) setStep(2); }} className="w-full px-4 py-3 border rounded-lg text-gray-800">
              <option value="">Choose a city...</option>
              {cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        )}

        {/* Step 2: Transaction Type */}
        {step >= 2 && city && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Transaction Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setTransactionType('lease'); setCategory(''); setStep(3); }} className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${transactionType === 'lease' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}>For Lease</button>
              <button onClick={() => { setTransactionType('sale'); setCategory(''); setStep(3); }} className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${transactionType === 'sale' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}>For Sale</button>
            </div>
          </div>
        )}

        {/* Step 3: Category */}
        {step >= 3 && transactionType && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Property Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES[transactionType].map(cat => (
                <button key={cat.key} onClick={() => { setCategory(cat.key); if (cat.key === 'office') { setStep(3.5 as number); } else { setOfficeType(''); setStep(4); } }} className={`p-4 rounded-lg border-2 text-center transition-all ${category === cat.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3.5: Office Type (Furnished/Unfurnished) */}
        {step >= 3.5 && category === 'office' && !officeType && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Office Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setOfficeType('furnished'); setStep(4); }} className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 text-center">
                <div className="text-2xl mb-2">🪑</div>
                <div className="font-medium text-gray-700">Furnished</div>
                <p className="text-xs text-gray-500 mt-1">Plug-and-play, ready to occupy</p>
              </button>
              <button onClick={() => { setOfficeType('unfurnished'); setStep(4); }} className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 text-center">
                <div className="text-2xl mb-2">🏗️</div>
                <div className="font-medium text-gray-700">Unfurnished</div>
                <p className="text-xs text-gray-500 mt-1">Bare/warm shell, tenant fits out</p>
              </button>
            </div>
          </div>
        )}

        {/* Custom Heading (optional) */}
        {step >= 4 && transactionType && category && (category !== 'office' || officeType) && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Listing Heading (Optional)</h3>
            <p className="text-xs text-gray-500 mb-3">Custom heading for this property listing. If left blank, the default format (e.g. &quot;Office for Lease&quot;) will be used.</p>
            <input
              type="text"
              value={customHeading}
              onChange={(e) => setCustomHeading(e.target.value)}
              placeholder="e.g. Premium Office Space in HITEC City"
              className="w-full px-4 py-3 border rounded-lg text-gray-800 text-sm"
            />
          </div>
        )}

        {/* Step 4: Property Details Form */}
        {step >= 4 && transactionType && category && (category !== 'office' || officeType) && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Step 4: Property Details</h3>
            <p className="text-sm text-gray-500 mb-4">Check the fields applicable to this listing. Only checked fields will appear on the public listing.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getFieldsForCategory(transactionType, category).map(f => renderField(f))}
            </div>
          </div>
        )}

        {/* Backend-only fields */}
        {step >= 4 && transactionType && category && (category !== 'office' || officeType) && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Backend-Only Information</h3>

            {/* Nearby Areas Multi-Select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Areas (for search visibility)</label>
              <p className="text-xs text-gray-500 mb-2">Select areas near this property. When users search for any selected area, this property will appear in results.</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {nearbyAreas.map(area => (
                  <span key={area} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {area}
                    <button type="button" onClick={() => setNearbyAreas(nearbyAreas.filter(a => a !== area))} className="text-blue-600 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nearbyInput}
                  onChange={(e) => setNearbyInput(e.target.value)}
                  placeholder="Type to filter or add custom area..."
                  className="flex-1 px-3 py-2 border rounded-lg text-gray-800 text-sm"
                />
                {nearbyInput && !areaOptions.includes(nearbyInput) && (
                  <button type="button" onClick={() => { if (nearbyInput && !nearbyAreas.includes(nearbyInput)) { setNearbyAreas([...nearbyAreas, nearbyInput]); setNearbyInput(''); } }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">+ Add Custom</button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2">
                {areaOptions.filter((a: string) => !nearbyAreas.includes(a) && a.toLowerCase().includes(nearbyInput.toLowerCase())).map((area: string) => (
                  <button key={area} type="button" onClick={() => { setNearbyAreas([...nearbyAreas, area]); setNearbyInput(''); }} className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-xs border border-gray-200">
                    + {area}
                  </button>
                ))}
                {areaOptions.filter((a: string) => !nearbyAreas.includes(a) && a.toLowerCase().includes(nearbyInput.toLowerCase())).length === 0 && nearbyInput && (
                  <p className="text-xs text-gray-400 p-1">No matching areas found. Use &quot;+ Add Custom&quot; to add it.</p>
                )}
              </div>
            </div>

            <p className="text-sm text-red-500 mb-4">⚠️ These fields are NEVER shown on the public website.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location PIN (Google Maps)</label>
                <input
                  type="text" value={locationPin} onChange={(e) => setLocationPin(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="Paste Google Maps link or coordinates"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Mobile</label>
                  <input type="text" value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Designation</label>
                  <input type="text" value={contactDesignation} onChange={(e) => setContactDesignation(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Remarks / Notes</label>
                <p className="text-xs text-gray-400 mb-1">Private notes for internal reference only. Never shown publicly.</p>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any internal notes about this property..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload */}
        {step >= 4 && transactionType && category && (category !== 'office' || officeType) && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Photos</h3>
            <div className="mb-4">
              <label className="block">
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </label>
              {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${photo.isCover ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
                    <img src={photo.url} alt={photo.label || `Photo ${index + 1}`} className={`w-full h-32 object-cover rounded mb-2 ${photo.isMasked ? 'blur-sm' : ''}`} />
                    <input type="text" value={photo.label} onChange={(e) => updatePhotoLabel(index, e.target.value)}
                      placeholder="Label (e.g. Building Exterior)" className="w-full px-2 py-1 border rounded text-xs text-gray-800 mb-2" />
                    <div className="flex gap-2 text-xs">
                      <button type="button" onClick={() => togglePhotoMask(index)} className={`px-2 py-1 rounded ${photo.isMasked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                        {photo.isMasked ? '🔒 Masked' : '👁️ Visible'}
                      </button>
                      <button type="button" onClick={() => setCoverPhoto(index)} className={`px-2 py-1 rounded ${photo.isCover ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {photo.isCover ? '⭐ Cover' : 'Set Cover'}
                      </button>
                      <button type="button" onClick={() => removePhoto(index)} className="px-2 py-1 rounded bg-red-100 text-red-600">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Buttons */}
        {step >= 4 && transactionType && category && (category !== 'office' || officeType) && (
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : '💾 Save as Draft'}
            </button>
            <Link href="/agent" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300">
              Cancel
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
