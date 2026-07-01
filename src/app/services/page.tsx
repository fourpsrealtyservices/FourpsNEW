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

        <div className="mt-14 relative rounded-2xl p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gray-900/80"></div>
          </div>
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white mb-3">Ready to find your perfect space?</h2>
            <p className="text-gray-300 mb-6">Get in touch and let us handle the rest.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties" className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 shadow-lg">Browse Properties</Link>
              <a href="https://wa.me/919059909675" target="_blank" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg">Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-900 pt-10 pb-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.webp" alt="FourPs Realty" className="h-8 w-auto" />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">India&apos;s premium commercial real estate platform. Retail, Office, Co-working & Investment spaces.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <p><Link href="/properties" className="text-gray-600 hover:text-blue-600">All Properties</Link></p>
                <p><Link href="/growth-corridors" className="text-gray-600 hover:text-blue-600">Growth Corridors</Link></p>
                <p><Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></p>
                <p><Link href="/services" className="text-gray-600 hover:text-blue-600">Services</Link></p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">Contact</h4>
              <a href="https://wa.me/919059909675" target="_blank" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-10 pt-6 text-center">
            <p className="text-gray-500 text-xs">© {new Date().getFullYear()} FourPs Realty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
