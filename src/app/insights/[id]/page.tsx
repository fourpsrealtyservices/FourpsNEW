'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Insight { _id: string; title: string; tag: string; content: string; imageUrl: string; createdAt: string; }

export default function InsightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/insights/${id}`).then(r => r.json()).then(d => {
      if (d && !d.error) setInsight(d);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  if (!insight) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Insight Not Found</h2>
        <p className="text-gray-500 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/insights" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">View All Insights</Link>
      </div>
      <Footer />
    </div>
  );

  const date = new Date(insight.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });

  // Parse content into blocks
  const blocks = insight.content.split('\n').filter(line => line.trim());

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Image */}
      {insight.imageUrl && (
        <div className="w-full h-64 md:h-80 relative">
          <img src={insight.imageUrl} alt={insight.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white bg-blue-600 px-2.5 py-1 rounded">{insight.tag}</span>
              <span className="text-xs text-gray-200">{date}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">{insight.title}</h1>
          </div>
        </div>
      )}

      {!insight.imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">{insight.tag}</span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">{insight.title}</h1>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
          <div className="prose prose-gray max-w-none">
            {blocks.map((block, i) => {
              if (block.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{block.replace('## ', '')}</h2>;
              }
              if (block.includes('**')) {
                return (
                  <div key={i} className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {block.split(/(\*\*.*?\*\*)/).map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="text-gray-800">{part.slice(2, -2)}</strong>;
                      }
                      return <span key={j}>{part}</span>;
                    })}
                  </div>
                );
              }
              return <p key={i} className="text-gray-600 text-sm leading-relaxed mb-4">{block}</p>;
            })}
          </div>
        </div>

        {/* Back link & CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/insights" className="text-blue-600 font-semibold text-sm hover:text-blue-700">← Back to All Insights</Link>
          <Link href="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all">
            Browse Properties →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
