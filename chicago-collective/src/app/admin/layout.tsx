'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Image as ImageIcon, BarChart3, Tag, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { properties } from '@/lib/data';
import { useState } from 'react';

export default function Admin2Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [galleryOpen, setGalleryOpen] = useState(true);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const propertyList = Object.keys(properties).map(slug => ({
    slug,
    title: properties[slug].title
  }));

  const handleLogout = () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/admin/login');
  };

  return (
    <div className="flex bg-[#f5f5f9] min-h-screen font-sans text-[#566a7f]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white flex flex-col shrink-0 border-r border-[#eceef1] shadow-[0_0.125rem_0.375rem_0_rgba(161,172,184,0.12)] z-20">
        
        {/* Logo / Brand */}
        <div className="h-[76px] flex items-center justify-center border-b border-[#eceef1] shrink-0">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-[#566a7f] tracking-tight">CAC Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {/* Section: Image Gallery (Top Level) */}
          <div className="mb-2">
            <button 
              onClick={() => setGalleryOpen(!galleryOpen)}
              className={`w-full flex items-center justify-between px-4 py-[0.5625rem] rounded-md text-[0.9375rem] font-medium transition-colors ${
                pathname?.startsWith('/admin/gallery') 
                 ? 'bg-[rgba(105,108,255,0.16)] text-[#696cff]' 
                 : 'text-[#697a8d] hover:bg-[#f5f5f9] hover:text-[#566a7f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="shrink-0" />
                Image Gallery
              </div>
              {galleryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {galleryOpen && (
              <div className="mt-1 ml-6 pl-3 border-l-2 border-[#eceef1] space-y-1">
                {propertyList.map((p) => {
                  const href = `/admin/gallery/${p.slug}`;
                  const active = pathname === href;
                  return (
                    <Link
                      key={p.slug}
                      href={href}
                      className={`block py-1.5 px-3 rounded-md text-[0.875rem] transition-colors ${
                        active 
                          ? 'text-[#696cff] font-medium bg-[rgba(105,108,255,0.08)]' 
                          : 'text-[#697a8d] hover:text-[#566a7f] hover:bg-[#f5f5f9]'
                      }`}
                    >
                      {p.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Marketing */}
          <div className="mb-2 mt-4">
            <NavItem 
              href="/admin/promotions" 
              icon={BarChart3} 
              label="Marketing" 
              active={false} 
              disabled 
            />
          </div>

          {/* Section: Pricing */}
          <div className="mb-2">
            <NavItem 
              href="/admin/rates" 
              icon={Tag} 
              label="Pricing" 
              active={false} 
              disabled 
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#eceef1] space-y-2">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-[0.5625rem] rounded-md text-[0.9375rem] text-[#697a8d] hover:bg-[#f5f5f9] hover:text-[#566a7f] transition-colors font-medium"
          >
            <Home size={18} className="shrink-0" />
            Public Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-[0.5625rem] rounded-md text-[0.9375rem] text-[#ff3e1d] hover:bg-[#ffe2db] transition-colors font-medium"
          >
            <LogOut size={18} className="shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active, disabled = false }: any) {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 px-4 py-[0.5625rem] rounded-md text-[0.9375rem] font-medium text-[#c0c6cc] cursor-not-allowed">
        <Icon size={20} className="shrink-0" />
        {label} 
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-[0.5625rem] rounded-md text-[0.9375rem] transition-all duration-200 ${
        active 
          ? 'bg-[rgba(105,108,255,0.16)] text-[#696cff] font-semibold shadow-sm' 
          : 'text-[#697a8d] font-medium hover:bg-[rgba(67,89,113,0.04)] hover:text-[#566a7f]'
      }`}
    >
      <Icon size={20} className="shrink-0" />
      {label}
    </Link>
  );
}
