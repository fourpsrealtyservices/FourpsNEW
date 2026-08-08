import Link from 'next/link';

const WHATSAPP_NUMBER = '919059909675';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.webp" alt="4Ps Realty Services" className="h-8 w-auto" />
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">Your trusted partner for commercial real estate. Retail, Office, Co-working &amp; Investment spaces.</p>
            <div className="flex gap-2.5 mt-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors text-white" aria-label="WhatsApp">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </a>
              <a href="https://www.instagram.com/4psrealty/" target="_blank" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600" aria-label="Instagram">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/4p-s-realty-services" target="_blank" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/properties" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">All Properties</Link></li>
              <li><Link href="/growth-corridors" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">Growth Corridors</Link></li>
              <li><Link href="/about" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">Services</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800 mb-3">Property Types</h4>
            <ul className="space-y-2">
              <li><Link href="/properties?category=retail" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">Retail Spaces</Link></li>
              <li><Link href="/properties?category=office" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">Office Spaces</Link></li>
              <li><Link href="/properties?category=coworking" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">Co-working</Link></li>
              <li><Link href="/properties?transactionType=sale&category=investment" className="text-gray-500 text-xs hover:text-blue-600 transition-colors">Investment</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800 mb-3">Contact</h4>
            <div className="space-y-2.5">
              <a href="tel:9059909675" className="flex items-center gap-2 text-gray-500 text-xs hover:text-blue-600 transition-colors">
                📞 9059909675
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="flex items-center gap-2 text-gray-500 text-xs hover:text-green-600 transition-colors">
                💬 Chat on WhatsApp
              </a>
              <a href="mailto:contact@fourps.in" className="flex items-center gap-2 text-gray-500 text-xs hover:text-blue-600 transition-colors">
                ✉️ contact@fourps.in
              </a>
              <p className="flex items-start gap-2 text-gray-500 text-xs">
                📍 Cokarma, Pranava Business Park, Kondapur, Hyderabad
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} 4Ps Realty Services. All rights reserved.</p>
          <p className="text-gray-400 text-xs">Commercial Real Estate Made Simple</p>
        </div>
      </div>
    </footer>
  );
}
