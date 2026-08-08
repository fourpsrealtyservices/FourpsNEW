'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Insight { _id: string; title: string; tag: string; content: string; imageUrl: string; }

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/public/insights').then(r => r.json()).then(d => { if (Array.isArray(d)) setInsights(d); setLoading(false); }); }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Insights & Market Updates</h1>
        <p className="text-gray-500 mb-10">Stay informed about the commercial real estate market</p>

        {insights.length === 0 && <p className="text-center text-gray-400 py-12">No insights published yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <Link key={insight._id} href={`/insights/${insight._id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-48 overflow-hidden bg-gray-100">
                {insight.imageUrl ? (
                  <img src={insight.imageUrl} alt={insight.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📰</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{insight.tag}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-blue-600 transition-colors mb-2">{insight.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{insight.content.substring(0, 120)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
