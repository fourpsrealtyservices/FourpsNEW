'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/growth-corridors', label: 'Growth Corridors' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="FourPs Realty" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold tracking-wide transition-colors ${
                isActive(link.href)
                  ? 'text-blue-700 border-b-2 border-blue-600 pb-0.5'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/agent/login"
            className="ml-2 text-blue-600 border-2 border-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
          >
            Agent Login
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 text-xl active:scale-95 transition-transform"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                isActive(link.href)
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-700 active:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/agent/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-blue-600 font-bold bg-blue-50 text-center mt-2"
          >
            Agent Login
          </Link>
        </div>
      )}
    </header>
  );
}
