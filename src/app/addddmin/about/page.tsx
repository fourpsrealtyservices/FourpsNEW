'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ExpItem { company: string; title: string; description: string; logoUrl: string; }
interface StoryStep { title: string; description: string; }

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [founderName, setFounderName] = useState('');
  const [founderTitle, setFounderTitle] = useState('');
  const [founderPhotoUrl, setFounderPhotoUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [education, setEducation] = useState('');
  const [educationDetail, setEducationDetail] = useState('');
  const [education2, setEducation2] = useState('');
  const [education2Detail, setEducation2Detail] = useState('');
  const [educationLogoUrl, setEducationLogoUrl] = useState('');
  const [education2LogoUrl, setEducation2LogoUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [credentials, setCredentials] = useState<string[]>([]);
  const [experience, setExperience] = useState<ExpItem[]>([]);
  const [storySteps, setStorySteps] = useState<StoryStep[]>([]);

  useEffect(() => {
    fetch('/api/admin/about').then(r => r.json()).then(data => {
      if (data && !data.error) {
        setFounderName(data.founderName || '');
        setFounderTitle(data.founderTitle || '');
        setFounderPhotoUrl(data.founderPhotoUrl || '');
        setLinkedinUrl(data.linkedinUrl || '');
        setEducation(data.education || '');
        setEducationDetail(data.educationDetail || '');
        setEducation2(data.education2 || '');
        setEducation2Detail(data.education2Detail || '');
        setEducationLogoUrl(data.educationLogoUrl || '');
        setEducation2LogoUrl(data.education2LogoUrl || '');
        setQuote(data.quote || '');
        setMission(data.mission || '');
        setVision(data.vision || '');
        setWhatsappNumber(data.whatsappNumber || '');
        setCredentials(data.credentials || []);
        setExperience(data.experience || []);
        setStorySteps(data.storySteps || []);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ founderName, founderTitle, founderPhotoUrl, linkedinUrl, education, educationDetail, education2, education2Detail, educationLogoUrl, education2LogoUrl, quote, mission, vision, whatsappNumber, credentials, experience, storySteps }),
    });
    setSaving(false);
    alert('About page content saved!');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setFounderPhotoUrl(data.url);
      else alert('Upload failed');
    } catch { alert('Upload error'); }
    setUploading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/addddmin" className="text-blue-600 hover:text-blue-800">← Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-800">📄 About Page Content</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Founder Info */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Founder Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Founder Name</label>
                <input type="text" value={founderName} onChange={e => setFounderName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title / Designation</label>
                <input type="text" value={founderTitle} onChange={e => setFounderTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founder Photo</label>
              <div className="flex items-center gap-4">
                {founderPhotoUrl && <img src={founderPhotoUrl} alt="Founder" className="w-20 h-20 rounded-xl object-cover border" />}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
                {uploading && <span className="text-xs text-blue-600">Uploading...</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="text" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (with country code)</label>
                <input type="text" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" placeholder="919059909675" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education 1 — Institute</label>
                <input type="text" value={education} onChange={e => setEducation(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education 1 — Detail</label>
                <input type="text" value={educationDetail} onChange={e => setEducationDetail(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700">Education 1 Logo:</label>
              {educationLogoUrl && <img src={educationLogoUrl} alt="Edu1" className="w-10 h-10 rounded border object-contain bg-white" />}
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const fd = new FormData(); fd.append('file', file);
                try { const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json(); if (r.ok) setEducationLogoUrl(d.url); } catch { alert('Upload failed'); }
              }} className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
              <input type="text" value={educationLogoUrl} onChange={e => setEducationLogoUrl(e.target.value)} placeholder="or paste logo URL" className="flex-1 px-2 py-1 border rounded text-gray-800 text-xs" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education 2 — Institute</label>
                <input type="text" value={education2} onChange={e => setEducation2(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education 2 — Detail</label>
                <input type="text" value={education2Detail} onChange={e => setEducation2Detail(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-gray-800" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700">Education 2 Logo:</label>
              {education2LogoUrl && <img src={education2LogoUrl} alt="Edu2" className="w-10 h-10 rounded border object-contain bg-white" />}
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const fd = new FormData(); fd.append('file', file);
                try { const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json(); if (r.ok) setEducation2LogoUrl(d.url); } catch { alert('Upload failed'); }
              }} className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
              <input type="text" value={education2LogoUrl} onChange={e => setEducation2LogoUrl(e.target.value)} placeholder="or paste logo URL" className="flex-1 px-2 py-1 border rounded text-gray-800 text-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founder Quote</label>
              <textarea value={quote} onChange={e => setQuote(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Credentials / Skills</h3>
          <div className="space-y-2">
            {credentials.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={c} onChange={e => { const u = [...credentials]; u[i] = e.target.value; setCredentials(u); }} className="flex-1 px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                <button onClick={() => setCredentials(credentials.filter((_, j) => j !== i))} className="text-red-500 text-sm px-2">✕</button>
              </div>
            ))}
            <button onClick={() => setCredentials([...credentials, ''])} className="text-sm text-blue-600 font-medium">+ Add Credential</button>
          </div>
        </div>

        {/* Corporate Experience */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏢 Corporate Journey</h3>
          <p className="text-xs text-gray-500 mb-4">Add companies with title, description, and upload their logos.</p>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex gap-2">
                  <input type="text" value={exp.company} onChange={e => { const u = [...experience]; u[i] = { ...u[i], company: e.target.value }; setExperience(u); }} placeholder="Company Name" className="w-1/3 px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                  <input type="text" value={exp.title} onChange={e => { const u = [...experience]; u[i] = { ...u[i], title: e.target.value }; setExperience(u); }} placeholder="Role / Title" className="flex-1 px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                  <button onClick={() => setExperience(experience.filter((_, j) => j !== i))} className="text-red-500 text-sm px-2">✕</button>
                </div>
                <input type="text" value={exp.description} onChange={e => { const u = [...experience]; u[i] = { ...u[i], description: e.target.value }; setExperience(u); }} placeholder="Description" className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                <div className="flex items-center gap-3">
                  {exp.logoUrl && <img src={exp.logoUrl} alt={exp.company} className="w-10 h-10 rounded border object-contain bg-white" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (res.ok) { const u = [...experience]; u[i] = { ...u[i], logoUrl: data.url }; setExperience(u); }
                    } catch { alert('Logo upload failed'); }
                  }} className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                  <span className="text-[10px] text-gray-400">or paste URL:</span>
                  <input type="text" value={exp.logoUrl} onChange={e => { const u = [...experience]; u[i] = { ...u[i], logoUrl: e.target.value }; setExperience(u); }} placeholder="Logo URL" className="flex-1 px-2 py-1 border rounded text-gray-800 text-xs" />
                </div>
              </div>
            ))}
            <button onClick={() => setExperience([...experience, { company: '', title: '', description: '', logoUrl: '' }])} className="text-sm text-blue-600 font-medium">+ Add Experience</button>
          </div>
        </div>

        {/* Story Steps */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Story Steps (Why Real Estate?)</h3>
          <div className="space-y-3">
            {storySteps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-xs text-gray-400 font-bold mt-2 w-6">{String(i+1).padStart(2, '0')}</span>
                <input type="text" value={step.title} onChange={e => { const u = [...storySteps]; u[i] = { ...u[i], title: e.target.value }; setStorySteps(u); }} placeholder="Title" className="w-1/3 px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                <input type="text" value={step.description} onChange={e => { const u = [...storySteps]; u[i] = { ...u[i], description: e.target.value }; setStorySteps(u); }} placeholder="Description" className="flex-1 px-3 py-2 border rounded-lg text-gray-800 text-sm" />
                <button onClick={() => setStorySteps(storySteps.filter((_, j) => j !== i))} className="text-red-500 text-sm px-2">✕</button>
              </div>
            ))}
            <button onClick={() => setStorySteps([...storySteps, { title: '', description: '' }])} className="text-sm text-blue-600 font-medium">+ Add Step</button>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Mission & Vision</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
              <textarea value={mission} onChange={e => setMission(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
              <textarea value={vision} onChange={e => setVision(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-gray-800 text-sm" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : '💾 Save All Changes'}
          </button>
          <Link href="/about" target="_blank" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300">
            🌐 Preview About Page
          </Link>
        </div>
      </main>
    </div>
  );
}
