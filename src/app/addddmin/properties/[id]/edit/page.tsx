'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFieldsForCategory, FieldDefinition } from '@/lib/propertyFields';

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
        locationPin,
        contactName,
        contactMobile,
        contactDesignation,
      }),
    });
    setSaving(false);
    router.push('/addddmin/properties');
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
