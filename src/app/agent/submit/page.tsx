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
  const [city, setCity] = useState('');
  const [transactionType, setTransactionType] = useState<'lease' | 'sale' | ''>('');
  const [category, setCategory] = useState('');
  const [officeType, setOfficeType] = useState<'furnished' | 'unfurnished' | ''>('');
  const [fieldValues, setFieldValues] = useState<Record<string, { value: string | string[]; checked: boolean; unit?: string }>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/public/cities').then(r => r.json()).then(data => setCities(data.filter((c: City) => c.status === 'active')));
  }, []);

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

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/agent/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, transactionType, category, officeType: category === 'office' ? officeType : undefined, fields: fieldValues, photos }),
    });
    if (res.ok) { alert('Property submitted for Admin approval!'); router.push('/agent'); }
    else { const d = await res.json(); alert(d.error || 'Failed'); }
    setLoading(false);
  };

  const renderField = (field: FieldDefinition) => {
    const fs = fieldValues[field.key];
    if (!fs) return null;
    const isCFP = fs.value === 'Call for Price';
    return (
      <div key={field.key} className="border rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2 mb-1">
          <input type="checkbox" checked={fs.checked} onChange={() => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], checked: !p[field.key].checked } }))} className="w-4 h-4" title="Check to show on listing card" />
          <label className="font-medium text-gray-700 text-sm">{field.label}</label>
          {!fs.checked && <span className="text-xs text-orange-500 ml-auto">Hidden on card</span>}
        </div>
        <div className="ml-6">
          {field.hasCFP && (
            <label className="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isCFP} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.checked ? 'Call for Price' : '' } }))} className="w-3.5 h-3.5" />
              <span className="text-orange-700 font-medium">Call for Price</span>
            </label>
          )}
          {!isCFP && (field.type === 'text' || field.type === 'number') && (
            <input type={field.type} value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} placeholder={field.placeholder || ''} className="w-full px-3 py-2 border rounded text-sm text-gray-800" />
          )}
          {!isCFP && field.type === 'range' && (
            <div className="flex gap-2 items-center">
              <input type="number" value={(fs.value as string).split(' to ')[0] || ''} onChange={e => { const max = (fs.value as string).split(' to ')[1] || ''; setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: `${e.target.value} to ${max}` } })); }} placeholder={field.placeholderMin || 'Min'} className="w-full px-3 py-2 border rounded text-sm text-gray-800" />
              <span className="text-sm text-gray-500">to</span>
              <input type="number" value={(fs.value as string).split(' to ')[1] || ''} onChange={e => { const min = (fs.value as string).split(' to ')[0] || ''; setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: `${min} to ${e.target.value}` } })); }} placeholder={field.placeholderMax || 'Max'} className="w-full px-3 py-2 border rounded text-sm text-gray-800" />
            </div>
          )}
          {field.type === 'textarea' && (
            <textarea value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} rows={2} className="w-full px-3 py-2 border rounded text-sm text-gray-800" />
          )}
          {field.type === 'dropdown' && (
            <select value={fs.value as string} onChange={e => setFieldValues(p => ({ ...p, [field.key]: { ...p[field.key], value: e.target.value } }))} className="w-full px-3 py-2 border rounded text-sm text-gray-800">
              <option value="">Select...</option>
              {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {field.type === 'multi-checkbox' && (
            <div className="flex flex-wrap gap-2">
              {field.options?.map(o => (
                <label key={o} className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/agent" className="text-blue-600 hover:text-blue-800">← Back</Link>
          <h1 className="text-xl font-bold text-gray-800">Submit Property</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          ⚠️ Your submission will be reviewed by Admin before publishing.
        </div>

        {step >= 1 && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-3">1. City</h3>
            <select value={city} onChange={e => { setCity(e.target.value); if (e.target.value) setStep(2); }} className="w-full px-4 py-3 border rounded-lg text-gray-800">
              <option value="">Choose city...</option>
              {cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        )}

        {step >= 2 && city && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-3">2. Transaction Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setTransactionType('lease'); setCategory(''); setStep(3); }} className={`p-4 rounded-lg border-2 font-medium ${transactionType === 'lease' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700'}`}>For Lease</button>
              <button onClick={() => { setTransactionType('sale'); setCategory(''); setStep(3); }} className={`p-4 rounded-lg border-2 font-medium ${transactionType === 'sale' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700'}`}>For Sale</button>
            </div>
          </div>
        )}

        {step >= 3 && transactionType && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-3">3. Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES[transactionType].map(cat => (
                <button key={cat.key} onClick={() => { setCategory(cat.key); setStep(cat.key === 'office' ? 3.5 : 4); }} className={`p-3 rounded-lg border-2 text-center ${category === cat.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="text-xl">{cat.icon}</div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step >= 3.5 && category === 'office' && !officeType && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Office Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setOfficeType('furnished'); setStep(4); }} className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 text-center">🪑 Furnished</button>
              <button onClick={() => { setOfficeType('unfurnished'); setStep(4); }} className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 text-center">🏗️ Unfurnished</button>
            </div>
          </div>
        )}

        {step >= 4 && transactionType && category && (category !== 'office' || officeType) && (
          <>
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-800 mb-3">4. Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{getFieldsForCategory(transactionType, category).map(f => renderField(f))}</div>
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-800 mb-3">5. Photos</h3>
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

            <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
