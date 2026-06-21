import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ServicesPage() {
  const services = [
    { icon: '🏪', title: 'Retail Leasing & Sales', desc: 'High street shops, mall spaces, standalone showrooms — we help retailers find locations that maximize footfall and visibility.' },
    { icon: '🏢', title: 'Office Space Advisory', desc: 'From plug-and-play furnished offices to bare shell spaces, we match your team size, budget, and growth plans to the right office.' },
    { icon: '👥', title: 'Co-working & Managed Offices', desc: 'Flexible seating, private cabins, and dedicated floors in premium co-working hubs across the city.' },
    { icon: '🏭', title: 'Warehousing & Industrial', desc: 'Commercial plots, warehouses, and logistics-ready spaces for businesses that need operational real estate.' },
    { icon: '📈', title: 'Investment Advisory', desc: 'Pre-leased assets, under-construction opportunities, and REIT guidance for investors seeking stable commercial returns.' },
    { icon: '📋', title: 'Transaction Management', desc: 'End-to-end deal support — from shortlisting to negotiation, documentation to possession. We handle the entire lifecycle.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/75"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Our Services</h1>
          <p className="text-blue-100 text-lg">Comprehensive commercial real estate solutions for every business need</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <span className="text-4xl block mb-4">{s.icon}</span>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to find your perfect space?</h2>
          <p className="text-blue-100 mb-6">Get in touch and let us handle the rest.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 shadow-lg">Browse Properties</Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`} target="_blank" className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-600 shadow-lg">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}
