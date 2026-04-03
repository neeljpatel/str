import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] text-white pt-16 pb-8 border-t-[6px] border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="font-serif text-3xl mb-2">CHICAGO AVE <span className="text-brand-gold italic">Collective</span></h2>
            <p className="text-gray-400 font-light max-w-sm text-sm">
              The ultimate Chicago hub for large groups, centrally located to everything.
            </p>
          </div>
          <div className="flex space-x-8 text-sm tracking-widest text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <Link href="/property/windy-city" className="hover:text-white transition-colors">WINDY CITY</Link>
            <Link href="/property/navy-pier" className="hover:text-white transition-colors">NAVY PIER</Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Chicago Ave Collective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
