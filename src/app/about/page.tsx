'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AboutData {
  founderName: string;
  founderTitle: string;
  founderPhotoUrl: string;
  linkedinUrl: string;
  education: string;
  educationDetail: string;
  quote: string;
  credentials: string[];
  experience: { company: string; description: string }[];
  storySteps: { title: string; description: string }[];
  mission: string;
  vision: string;
  whatsappNumber: string;
}

const DEFAULTS: AboutData = {
  founderName: 'Jhansi Desavath',
  founderTitle: 'Founder & CEO',
  founderPhotoUrl: '',
  linkedinUrl: '',
  education: 'IIM Lucknow',
  educationDetail: 'Post Graduate Programme',
  quote: "A strong business foundation combined with years of corporate leadership shaped the consulting approach that defines 4P's Realty Services today.",
  credentials: ['Commercial Real Estate Consultant', 'Relationship Builder', 'Corporate Strategy Professional', 'Business Growth Enabler'],
  experience: [
    { company: 'Airtel', description: 'Built strong foundation in operations & customer focus' },
    { company: 'Park+', description: 'Gained diverse experience in growth & partnerships' },
    { company: 'Disney Star', description: 'Enhanced strategic thinking & business development expertise' },
  ],
  storySteps: [
    { title: 'Career Break', description: 'After a fulfilling career break following Disney Star, I was still exploring my next chapter.' },
    { title: 'A Friend Asked', description: 'A friend casually asked if I could help find tenants for his commercial property.' },
    { title: 'Spoke to Retail Brands', description: 'I reached out to retailers, clothing brands, electronics stores and businesses in my network.' },
    { title: 'Unexpected Responses', description: "Most of them weren't interested in that particular property." },
    { title: 'Realized the Market Gap', description: 'They said, "If you have opportunities in other locations, let us know."' },
    { title: 'Started Helping Businesses', description: 'I began understanding requirements, studying markets and connecting the right dots.' },
    { title: "Founded 4P's Realty", description: 'What began as a small favor became a full-time mission.' },
  ],
  mission: 'To transform the unorganized commercial real estate sector into a transparent, trusted and professional ecosystem for businesses, investors and land owners.',
  vision: "To become India's most trusted commercial real estate advisory platform by helping businesses make confident location decisions.",
  whatsappNumber: '919059909675',
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(DEFAULTS);

  useEffect(() => {
    fetch('/api/public/about').then(r => r.json()).then(d => {
      if (d && !d.error && d.founderName) setData({ ...DEFAULTS, ...d });
    }).catch(() => {});
  }, []);

  const wa = data.whatsappNumber || '919059909675';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            About 4P&apos;s<br />Realty Services
          </h1>
          <p className="text-lg text-gray-200 font-medium mb-4">Your trusted partner for commercial real estate</p>
          <p className="text-gray-300 max-w-xl text-sm leading-relaxed mb-8">
            Helping brands, corporates, retailers, investors and land owners make smarter real estate decisions through strategic advisory and market expertise.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/services" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-lg">
              Explore Services →
            </Link>
            <Link href={`https://wa.me/${wa}`} target="_blank" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all active:scale-95">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Founder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Founder Photo */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-56 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl mb-4">
              {data.founderPhotoUrl ? (
                <img src={data.founderPhotoUrl} alt={data.founderName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="text-center">
                    <span className="text-6xl block mb-2">👤</span>
                    <p className="text-gray-500 text-xs">Photo</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-lg font-serif italic text-gray-600">{data.founderName}</p>
            {data.linkedinUrl && (
              <div className="flex items-center gap-2 mt-2">
                <a href={data.linkedinUrl} target="_blank" className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold hover:bg-blue-700 transition-colors">in</a>
              </div>
            )}
          </div>

          {/* Founder Info */}
          <div>
            <p className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">Meet Our Founder</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{data.founderName}</h2>
            <p className="text-gray-500 font-medium mb-5">{data.founderTitle}</p>

            <div className="space-y-3">
              {data.credentials.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 text-sm">◉</div>
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Quote */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-3">Education</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg font-bold text-blue-800">IIM</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{data.education}</p>
                  <p className="text-xs text-gray-500">{data.educationDetail}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <span className="text-4xl text-gray-200 font-serif leading-none">&ldquo;</span>
              <p className="text-gray-600 text-sm leading-relaxed -mt-2">{data.quote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Experience Timeline */}
      {data.experience.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-100 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center text-orange-500 font-bold text-xs uppercase tracking-wider mb-8">A Decade of Corporate Experience</h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {data.experience.map((exp, i) => (
                <div key={exp.company} className="flex items-center">
                  <div className="text-center px-6">
                    <div className="w-20 h-20 mx-auto bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <span className="font-bold text-gray-700 text-sm">{exp.company}</span>
                    </div>
                    <p className="text-xs text-gray-600 max-w-[160px] leading-relaxed">{exp.description}</p>
                  </div>
                  {i < data.experience.length - 1 && <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>}
                </div>
              ))}
            </div>

            <p className="text-center text-gray-500 text-sm mt-8 max-w-2xl mx-auto italic">
              This journey across leading organizations built the expertise to understand businesses deeply and recommend real estate solutions that truly create impact.
            </p>
          </div>
        </section>
      )}

      {/* Why Real Estate - Story */}
      {data.storySteps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <p className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">My Story</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why Real Estate?</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm max-w-md">A simple question changed everything and became the start of a journey that continues today.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {data.storySteps.map((step, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-shadow">
                <div className="text-orange-500 font-extrabold text-lg mb-2">{String(i + 1).padStart(2, '0')}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-lg mt-10 font-serif italic">
            Today, that journey continues through <span className="font-bold text-orange-600">4P&apos;s Realty Services.</span>
          </p>
        </section>
      )}

      {/* Mission, Vision, What Makes Us Different */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-orange-400 text-xl">🎯</span>
              </div>
              <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">Our Mission</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{data.mission}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-orange-400 text-xl">🔭</span>
              </div>
              <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">Our Vision</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{data.vision}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-4">What Makes Us Different</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Business First', desc: 'We understand your business before recommending properties.' },
                  { title: 'Relationship Driven', desc: 'Long-term partnerships over one-time transactions.' },
                  { title: 'Market Intelligence', desc: 'Every recommendation is backed by deep market research.' },
                  { title: 'End-to-End Advisory', desc: 'From requirement gathering to deal closure.' },
                ].map((item) => (
                  <div key={item.title}>
                    <p className="text-white font-bold text-xs mb-0.5">{item.title}</p>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h3 className="text-center text-orange-500 font-bold text-xs uppercase tracking-wider mb-8">Our Process</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {[
            { icon: '📋', label: 'Requirement Discussion' },
            { icon: '🔍', label: 'Market Research' },
            { icon: '🏢', label: 'Property Search' },
            { icon: '✅', label: 'Verification' },
            { icon: '📑', label: 'Shortlisting' },
            { icon: '🚗', label: 'Site Visits' },
            { icon: '🤝', label: 'Negotiation & Deal Closure' },
          ].map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center text-2xl mb-2 shadow-sm">
                {step.icon}
              </div>
              <p className="text-xs font-semibold text-gray-700 leading-tight">{step.label}</p>
              {i < 6 && <span className="hidden md:block text-gray-300 mt-1">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-blue-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                Let&apos;s Find the <span className="text-orange-400">Right Place</span> for Your Business
              </h2>
              <p className="text-gray-300 text-sm max-w-lg">
                Whether you&apos;re expanding your retail footprint, searching for office space, investing in commercial real estate, or looking to unlock the value of your land, we&apos;d love to partner with you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href={`https://wa.me/${wa}?text=Hi%20FourPs!%20I'd%20like%20to%20schedule%20a%20consultation.`} target="_blank" className="bg-orange-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-lg">
                Schedule a Consultation →
              </Link>
              <Link href={`https://wa.me/${wa}`} target="_blank" className="bg-white/10 border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all active:scale-95">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
