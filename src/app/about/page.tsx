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
  education2: string;
  education2Detail: string;
  educationLogoUrl: string;
  education2LogoUrl: string;
  quote: string;
  credentials: string[];
  experience: { company: string; title: string; description: string; logoUrl: string }[];
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
  educationDetail: 'PGDM, 2013',
  education2: 'Osmania University',
  education2Detail: 'Mechanical Engineer',
  educationLogoUrl: '/logos/iim-lucknow.svg',
  education2LogoUrl: '/logos/osmania.svg',
  quote: "A decade of corporate leadership shaped the consulting approach that defines 4Ps Realty Services today.",
  credentials: ['Commercial Real Estate Strategist', 'Corporate Leasing Specialist', 'Retail Expansion Consultant', 'Investment Advisory Professional'],
  experience: [
    { company: 'Airtel', title: 'Enterprise Business Experience', description: 'Delivered customer-centric solutions by managing the complete corporate client lifecycle across diverse roles', logoUrl: '/logos/airtel.svg' },
    { company: 'Park+', title: 'South Sales Head – Commercial Vertical', description: 'Led business development and strategic partnerships across the South region for the Commercial Vertical', logoUrl: '/logos/parkplus.svg' },
    { company: 'Disney Star', title: 'Pricing & Revenue Strategy Lead', description: 'Led pricing and revenue strategy for Star Maa, the leading Telugu entertainment channel', logoUrl: '/logos/disney-star.svg' },
    { company: '4Ps Realty', title: 'Founder', description: 'Helping businesses, investors, and landowners make informed commercial real estate decisions through strategic leasing and sales advisory', logoUrl: '/logo.webp' },
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
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/about').then(r => r.json()).then(d => {
      if (d && !d.error && d.founderName) {
        // Only override defaults with backend values that are non-empty
        const merged = { ...DEFAULTS };
        for (const key of Object.keys(d) as (keyof AboutData)[]) {
          const val = d[key];
          if (val !== undefined && val !== null && val !== '') {
            (merged as any)[key] = val;
          }
        }
        setData(merged);
      } else {
        setData(DEFAULTS);
      }
      setLoading(false);
    }).catch(() => { setData(DEFAULTS); setLoading(false); });
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const wa = data.whatsappNumber || '919059909675';

  // Corporate journey — text is static, logos come from backend (admin can update)
  const staticJourney = [
    { company: 'Airtel', title: 'Enterprise Business Experience', description: 'Delivered customer-centric solutions by managing the complete corporate client lifecycle across diverse roles', defaultLogo: '/logos/airtel.svg' },
    { company: 'Park+', title: 'South Sales Head – Commercial Vertical', description: 'Led business development and strategic partnerships across the South region for the Commercial Vertical.', defaultLogo: '/logos/parkplus.svg' },
    { company: 'Disney Star', title: 'Pricing & Revenue Strategy Lead', description: 'Led pricing and revenue strategy for Star Maa, the leading Telugu entertainment channel.', defaultLogo: '/logos/disney-star.svg' },
    { company: '4Ps Realty', title: 'Founder', description: 'Helping businesses, investors, and landowners make informed commercial real estate decisions through strategic leasing and sales advisory.', defaultLogo: '/logo.webp' },
  ];
  // Merge logo URLs from backend data if admin has updated them
  const corporateJourney = staticJourney.map((item, i) => ({
    ...item,
    logoUrl: (data.experience && data.experience[i]?.logoUrl) || item.defaultLogo,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Reduced size similar to homepage */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <p className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-2">About Us</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            About 4Ps Realty Services
          </h1>
          <p className="text-gray-300 mx-auto max-w-xl text-sm leading-relaxed">
            Commercial Real Estate Solutions Tailored to Your Goals
          </p>
        </div>
      </section>

      {/* Meet Our Founder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Founder Photo */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-48 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl mb-3">
              {data.founderPhotoUrl ? (
                <img src={data.founderPhotoUrl} alt={data.founderName} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="text-center">
                    <span className="text-6xl block mb-2">👤</span>
                    <p className="text-gray-500 text-xs">Photo</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-lg font-bold text-gray-900">Jhansi D</p>
            <p className="text-sm text-gray-600">Founder of 4Ps</p>
            <p className="text-sm text-gray-500">IIM Lucknow 2013</p>
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
          <div className="space-y-3">
            {/* IIM Lucknow */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">Education</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <img src={data.educationLogoUrl || '/logos/iim-lucknow.svg'} alt={data.education} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{data.education}</p>
                  <p className="text-xs text-gray-500">{data.educationDetail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <img src={data.education2LogoUrl || '/logos/osmania.svg'} alt={data.education2} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{data.education2}</p>
                  <p className="text-xs text-gray-500">{data.education2Detail}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-gray-600 text-sm leading-relaxed">My corporate journey across Bharti Airtel, Park+, and Disney Star shaped my understanding of businesses, markets, and growth. Today, I bring that experience into commercial real estate, helping clients make smarter leasing, sales, and investment decisions.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Why Real Estate - Story (Full width, no numbers) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-2">My Story</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why Real Estate?</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm">A simple question changed everything and became the start of a journey that continues today.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.storySteps.map((step, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-shadow aspect-square flex flex-col justify-start">
                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-lg mt-6">
            Today, that journey continues through <span className="font-bold text-orange-600">4Ps Realty Services.</span>
          </p>
        </div>
      </section>

      {/* Mission, Vision, What Makes Us Different */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* CTA Section - Background matching site theme (gray-50 based) */}
      <section className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                Let&apos;s Find the <span className="text-orange-500">Right Place</span> for Your Business
              </h2>
              <p className="text-gray-600 text-sm max-w-lg">
                Whether you&apos;re expanding your retail footprint, searching for office space, investing in commercial real estate, or looking to unlock the value of your land, we&apos;d love to partner with you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href={`https://wa.me/${wa}?text=Hi%204Ps%20Realty!%20I'd%20like%20to%20schedule%20a%20consultation.`} target="_blank" className="bg-orange-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-lg">
                Schedule a Consultation →
              </Link>
              <Link href={`https://wa.me/${wa}`} target="_blank" className="bg-white border border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95">
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
