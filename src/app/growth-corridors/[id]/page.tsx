'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Corridor {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  city: string;
}

const fallbackCorridors: Record<string, Corridor> = {
  '1': { _id: '1', title: 'HITEC City & Madhapur', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80', content: 'The IT backbone of Hyderabad — home to Google, Microsoft, Amazon, and 100+ tech companies. Grade A office rents range from ₹55-85/sq ft. Ideal for IT/ITES, fintech, and SaaS companies. This corridor features world-class infrastructure including metro connectivity, premium restaurants, and international schools. The area has seen consistent rental appreciation of 8-12% annually over the past 5 years.', city: 'Hyderabad' },
  '2': { _id: '2', title: 'Financial District', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80', content: 'The newest commercial hub with premium towers, wide roads, and excellent infrastructure. Major occupiers include banks, consulting firms, and global tech giants. Rents: ₹60-90/sq ft. The Financial District is designed as a self-contained business ecosystem with Grade A+ buildings, landscaped walkways, and proximity to the Outer Ring Road for seamless connectivity.', city: 'Hyderabad' },
  '3': { _id: '3', title: 'Gachibowli & Nanakramguda', imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1920&q=80', content: 'Strategic location between HITEC City and Financial District. Growing rapidly with SEZs, business parks, and pharma companies. Affordable yet premium: ₹45-65/sq ft. The area benefits from proximity to ISB, University of Hyderabad, and multiple IT SEZs. Excellent for companies looking for quality space at competitive rates.', city: 'Hyderabad' },
  '4': { _id: '4', title: 'Kokapet & Narsingi', imageUrl: 'https://images.unsplash.com/photo-1582407947092-79ad8656ff9d?auto=format&fit=crop&w=1920&q=80', content: 'The next frontier — upcoming IT corridor with massive land parcels and new developments. Early movers can lock in rates of ₹35-50/sq ft with high appreciation potential. Several large IT parks and mixed-use developments are under construction. The Regional Ring Road connectivity makes this corridor extremely accessible.', city: 'Hyderabad' },
};

export default function CorridorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [corridor, setCorridor] = useState<Corridor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/growth-corridors/${id}`)
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('Not found');
      })
      .then(data => { setCorridor(data); setLoading(false); })
      .catch(() => {
        // Fallback for hardcoded corridors
        setCorridor(fallbackCorridors[id] || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!corridor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Corridor Not Found</h1>
          <p className="text-gray-500 mb-6">The growth corridor you are looking for does not exist.</p>
          <Link href="/growth-corridors" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium">← Back to Growth Corridors</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Full-width image */}
      <div className="w-full h-[300px] md:h-[450px] relative overflow-hidden">
        <img
          src={corridor.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80'}
          alt={corridor.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <span className="text-blue-300 text-sm font-medium mb-2 block">{corridor.city}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">{corridor.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">{corridor.content}</p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/growth-corridors" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-200">
            ← All Corridors
          </Link>
          <Link href={`/properties?search=${encodeURIComponent(corridor.title)}`} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-blue-700">
            Browse Properties in {corridor.title} →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
