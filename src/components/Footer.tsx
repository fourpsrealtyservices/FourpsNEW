import Link from 'next/link';

const WHATSAPP_NUMBER = '919059909675';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 pt-10 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.webp" alt="FourPs Realty" className="h-8 w-auto" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">India&apos;s premium commercial real estate platform. Retail, Office, Co-working &amp; Investment spaces.</p>
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
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} FourPs Realty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
