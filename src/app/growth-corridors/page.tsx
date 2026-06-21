'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface Corridor {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  city: string;
}

const fallbackCorridors = [
  { _id: '1', title: 'HITEC City & Madhapur', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', content: 'The IT backbone of Hyderabad — home to Google, Microsoft, Amazon, and 100+ tech companies. Grade A office rents range from ₹55-85/sq ft. Ideal for IT/ITES, fintech, and SaaS companies.', city: 'Hyderabad' },
  { _id: '2', title: 'Financial District', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', content: 'The newest commercial hub with premium towers, wide roads, and excellent infrastructure. Major occupiers include banks, consulting firms, and global tech giants. Rents: ₹60-90/sq ft.', city: 'Hyderabad' },
  { _id: '3', title: 'Gachibowli & Nanakramguda', imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80', content: 'Strategic location between HITEC City and Financial District. Growing rapidly with SEZs, business parks, and pharma companies. Affordable yet premium: ₹45-65/sq ft.', city: 'Hyderabad' },
  { _id: '4', title: 'Kokapet & Narsingi', imageUrl: 'https://images.unsplash.com/photo-1582407947092-79ad8656ff9d?auto=format&fit=crop&w=600&q=80', content: 'The next frontier — upcoming IT corridor with massive land parcels and new developments. Early movers can lock in rates of ₹35-50/sq ft with high appreciation potential.', city: 'Hyderabad' },
];

export default function GrowthCorridorsPage() {
  const [corridors, setCorridors] = useState<Corridor[]>(fallbackCorridors);

  useEffect(() => {
    fetch('/api/public/growth-corridors')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCorridors(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1582407947092-79ad8656ff9d?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/75"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Growth Corridors</h1>
          <p className="text-blue-100 text-lg">Explore Hyderabad&apos;s most promising commercial real estate zones</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-8">
          {corridors.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="h-48 md:h-auto">
                  <img src={c.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3">{c.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{c.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Looking for space in these corridors?</h2>
          <p className="text-blue-100 mb-6">We have exclusive inventory across all major growth corridors in Hyderabad.</p>
          <Link href="/properties" className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Browse Properties
          </Link>
        </div>
      </section>
    </div>
  );
}
