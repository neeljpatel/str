'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-black/5 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-white py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl tracking-wide text-brand-dark flex-shrink-0 flex items-center">
            <span>CHICAGO AVE <span className="text-brand-gold italic">Collective</span></span>
            <span className="hidden sm:inline-block text-gray-600 font-sans text-base ml-3 tracking-wider font-light uppercase">
              | Urban Vacation Rentals
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-12 items-center">
            <Link href="/property/windy-city" className="text-sm tracking-[0.1em] text-gray-600 hover:text-brand-gold transition-colors">
              WINDY CITY CONDO
            </Link>
            <Link href="/property/navy-pier" className="text-sm tracking-[0.1em] text-gray-600 hover:text-brand-gold transition-colors">
              NAVY PIER CONDO
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-brand-dark focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full pb-6 pt-4 px-4 shadow-lg flex flex-col space-y-4 text-center">
          <Link 
            href="/property/windy-city" 
            className="text-sm tracking-[0.1em] text-gray-600 py-2 border-b border-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            WINDY CITY CONDO
          </Link>
          <Link 
            href="/property/navy-pier" 
            className="text-sm tracking-[0.1em] text-gray-600 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            NAVY PIER CONDO
          </Link>
        </div>
      )}
    </nav>
  );
}
