'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFieldsForCategory, FieldDefinition } from '@/lib/propertyFields';

interface Photo {
  url: string;
  label: string;
  isCover: boolean;
  isMasked: boolean;
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Record<string, unknown> | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, { value: string | string[]; checked: boolean; unit?: string }>>({});
  const [locationPin, setLocationPin] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactDesignation, setContactDesignation] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then(r => r.json())
      .then(data => {
        setProperty(data);
        setFieldValues(data.fields || {});
        setLocationPin(data.locationPin || '');
        setContactName(data.contactName || '');
        setContactMobile(data.contactMobile || '');
        setContactDesignation(data.contactDesignation || '');
        setPhotos(data.photos || []);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: fieldValues,
        photos,
        locationPin,
        contactName,
        contactMobile,
        contactDesignation,
      }),
    });
    setSaving(false);
    router.push('/addddmin/properties');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setPhotos(prev => [...prev, { url: data.url, label: '', isCover: prev.length === 0, isMasked: false }]);
      }
    }
    setUploading(false);
    e.target.value = '';
  };

  const deletePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(p => p.isCover)) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };

  const setCoverPhoto = (index: number) => {
    setPhotos(prev => prev.map((p, i) => ({ ...p, isCover: i === index })));
  };

  const toggleMask = (index: number) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, isMasked: !p.isMasked } : p));
  };

  const updateLabel = (index: number, label: string) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, label } : p));
  };

  const movePhoto = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= photos.length) return;
    setPhotos(prev => {
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  };

  const renderFieldInput = (field: FieldDefinition) => {
    const fieldState = fieldValues[field.key];
    if (!fieldState) return null;
    const isCFP = fieldState.value === 'Call for Price';

    return (
      <div key={field.key} className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            checked={fieldState.checked}
            onChange={() => setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], checked: !prev[field.key].checked } }))}
            className="w-4 h-4 rounded"
          />
          <label className="font-medium text-gray-700">{field.label}</label>
          {field.unit && <span className="text-xs text-gray-500">({field.unit})</span>}
        </div>
        {fieldState.checked && (
          <div className="ml-7">
            {field.hasCFP && (
              <label className="flex items-center gap-2 mb-2 text-sm cursor-pointer">
                <input type="checkbox" checked={isCFP} onChange={(e) => setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: e.target.checked ? 'Call for Price' : '' } }))} className="w-3.5 h-3.5" />
                <span className="text-orange-700 font-medium">Call for Price</span>
              </label>
            )}
            {!isCFP && (field.type === 'text' || field.type === 'number') && (
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                value={fieldState.value as string}
                onChange={(e) => setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: e.target.value } }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm"
              />
            )}
            {!isCFP && field.type === 'range' && (
              <div className="flex gap-2 items-center">
                <input type="number" value={(fieldState.value as string).split(' to ')[0] || ''} onChange={(e) => { const max = (fieldState.value as string).split(' to ')[1] || ''; setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: `${e.target.value} to ${max}` } })); }} placeholder="Min" className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                <span className="text-sm text-gray-500">to</span>
                <input type="number" value={(fieldState.value as string).split(' to ')[1] || ''} onChange={(e) => { const min = (fieldState.value as string).split(' to ')[0] || ''; setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: `${min} to ${e.target.value}` } })); }} placeholder="Max" className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
              </div>
            )}
            {field.type === 'textarea' && (
              <textarea value={fieldState.value as string} onChange={(e) => setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: e.target.value } }))} rows={3} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
            )}
            {field.type === 'dropdown' && (
              <select value={fieldState.value as string} onChange={(e) => setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm">
                <option value="">Select...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {field.type === 'multi-checkbox' && (
              <div className="flex flex-wrap gap-2">
                {field.options?.map(opt => (
                  <label key={opt} className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded">
                    <input type="checkbox" checked={(fieldState.value as string[]).includes(opt)} onChange={(e) => { const current = fieldState.value as string[]; const updated = e.target.checked ? [...current, opt] : current.filter(v => v !== opt); setFieldValues(prev => ({ ...prev, [field.key]: { ...prev[field.key], value: updated } })); }} className="w-3 h-3" />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Property not found</p></div>;

  const fields = getFieldsForCategory(property.transactionType as string, property.category as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/addddmin/properties" className="text-blue-600 hover:text-blue-800">← Back</Link>
          <h1 className="text-xl font-bold text-gray-800">Edit Property — {property.propertyId as string}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Property Details</h3>
          <p className="text-sm text-gray-500 mb-4">Check/uncheck fields and update values. Only checked fields will show on the public listing.</p>
          <div className="space-y-3">
            {fields.map(field => renderFieldInput(field))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Backend-Only Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location PIN</label>
              <input type="text" value={locationPin} onChange={(e) => setLocationPin(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
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
          </div>
        </div>

        {/* Photo Management */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Photos</h3>
          <p className="text-sm text-gray-500 mb-4">Upload, reorder, label, mask or delete photos. The cover photo is shown as thumbnail.</p>

          {/* Upload */}
          <div className="mb-4">
            <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 text-sm font-medium">
              {uploading ? '⏳ Uploading...' : '📷 Upload Photos'}
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          {/* Photo Grid */}
          {photos.length === 0 && <p className="text-gray-400 text-sm">No photos uploaded yet.</p>}
          <div className="space-y-3">
            {photos.map((photo, index) => (
              <div key={index} className={`flex items-start gap-4 p-3 rounded-lg border ${photo.isCover ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                {/* Thumbnail */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img src={photo.url} alt={photo.label || `Photo ${index + 1}`} className={`w-full h-full object-cover ${photo.isMasked ? 'blur-md' : ''}`} />
                  {photo.isCover && <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">COVER</span>}
                  {photo.isMasked && <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">MASKED</span>}
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={photo.label}
                    onChange={(e) => updateLabel(index, e.target.value)}
                    placeholder="Label (e.g. Building Exterior, Lobby)"
                    className="w-full px-3 py-1.5 border rounded-lg text-gray-800 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    {!photo.isCover && (
                      <button onClick={() => setCoverPhoto(index)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">★ Set Cover</button>
                    )}
                    <button onClick={() => toggleMask(index)} className={`text-xs px-2 py-1 rounded ${photo.isMasked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
                      {photo.isMasked ? '👁 Unmask' : '🔒 Mask/Blur'}
                    </button>
                    <button onClick={() => movePhoto(index, 'up')} disabled={index === 0} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-30">↑ Up</button>
                    <button onClick={() => movePhoto(index, 'down')} disabled={index === photos.length - 1} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-30">↓ Down</button>
                    <button onClick={() => deletePhoto(index)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/addddmin/properties" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300">Cancel</Link>
        </div>
      </main>
    </div>
  );
}
