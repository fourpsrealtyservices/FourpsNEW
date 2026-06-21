import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/75"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">About FourPs Realty</h1>
          <p className="text-blue-100 text-lg">Redefining commercial real estate with precision, partnership, and performance.</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              FourPs Realty is a premier commercial real estate advisory firm based in Hyderabad. We specialize in helping businesses find the right spaces — whether it&apos;s a retail showroom on a high street, a Grade A office in HITEC City, or a co-working hub for a growing startup.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Founded with a mission to simplify commercial leasing and sales, we bring together deep market knowledge, a curated inventory of verified properties, and a client-first approach that prioritizes your business needs above all.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">The 4 Ps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '🎯', title: 'Precision', desc: 'Every property we recommend is hand-picked based on your exact requirements — location, budget, size, and configuration.' },
                { icon: '💎', title: 'Premium', desc: 'We deal exclusively in quality commercial properties — Grade A buildings, prime locations, and verified listings.' },
                { icon: '🤝', title: 'Partnership', desc: 'We don\'t just close deals — we build long-term relationships. Your growth is our growth.' },
                { icon: '⚡', title: 'Performance', desc: 'Speed, transparency, and results. We aim to close the right deal in the shortest time with zero ambiguity.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Our Expertise</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Retail spaces — high streets, malls, standalone showrooms</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Office spaces — furnished, unfurnished, Grade A buildings</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Co-working spaces — flexible desks, private cabins, managed offices</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Commercial plots and warehouses</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Investment advisory — pre-leased assets, REITs</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
