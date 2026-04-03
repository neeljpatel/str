import { getProperties } from '@/lib/data';
import Image from 'next/image';
import { Calendar, User, Home } from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

async function getReservationsForProperty(uuid: string, fromDateStr: string, toDateStr: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) return [];
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/admin/hospitable/reservations?start_date=${fromDateStr}&end_date=${toDateStr}&properties=${uuid}&include=guest,financials`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.reservations || [];
  } catch (error) {
    console.error('Failed to fetch reservations from backend:', error);
    return [];
  }
}

export default async function Admin2Dashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Fetch from 30 days in the past to ensure we include any current reservations that haven't checked out yet
  const pastDate = new Date(today);
  pastDate.setDate(pastDate.getDate() - 30);
  const fromDateStr = pastDate.toISOString().split('T')[0];

  const toDate = new Date(today);
  toDate.setDate(toDate.getDate() + 90); // fetch 90 days out for reservations table
  const toDateStr = toDate.toISOString().split('T')[0];

  const properties = await getProperties();
  const propertyList = Object.keys(properties).map((slug) => ({
    slug,
    ...properties[slug]
  }));

  // Fetch reservations per property
  const allReservations: any[] = [];
  for (const prop of propertyList) {
    const resList = await getReservationsForProperty(prop.id, fromDateStr, toDateStr);
    resList.forEach((r: any) => {
      r._property = prop;
    });
    
    // Filter out reservations that have already checked out
    const activeAndUpcoming = resList.filter((r: any) => {
      const checkOut = new Date(r.departure_date || r.check_out);
      checkOut.setHours(0, 0, 0, 0);
      return checkOut.getTime() >= today.getTime();
    });
    
    allReservations.push(...activeAndUpcoming);
  }

  // Sort upcoming reservations by checkin date
  allReservations.sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());

  // Upcoming Week Dates (now 14 days)
  const next14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getStartOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayDate = getStartOfDay(new Date());
  
  // Safe timezone-agnostic day difference
  const diffDays = (d1: Date, d2: Date) => Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

  const formatTableDate = (dString: string) => {
    if (!dString) return 'N/A';
    return new Date(dString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getUnitAbbr = (title: string) => {
    if (title.includes('Windy City')) return '2W';
    if (title.includes('Navy Pier')) return '3W';
    return '';
  };

  const getPlatformLabel = (platformCode: string) => {
    if (!platformCode) return 'Direct Booking';
    const lower = platformCode.toLowerCase();
    if (lower === 'manual' || lower === 'direct') return 'Direct Booking';
    if (lower === 'homeaway' || lower === 'vrbo') return 'VRBO';
    if (lower === 'airbnb') return 'Airbnb';
    return platformCode;
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="mb-4">
        <h1 className="text-[1.5rem] font-bold text-[#566a7f] mb-1 tracking-tight">Dashboard Overview</h1>
        <p className="text-[#a1acb8] text-[0.9375rem]">Monitor your 14-day availability and incoming reservations across all units.</p>
      </div>

      {/* Widget 1: Upcoming 14 Days Timeline */}
      <section className="bg-white rounded-[0.5rem] border border-[#eceef1] shadow-[0_0.25rem_1rem_rgba(161,172,184,0.15)] overflow-hidden overflow-x-auto">
        <div className="px-6 py-5 border-b border-[#eceef1]">
          <h4 className="text-[1.125rem] font-medium text-[#566a7f] m-0">Upcoming 14 Days</h4>
        </div>
        <div className="min-w-[900px]">
          {/* Header Row (Days) */}
          <div className="flex border-b border-[#eceef1] bg-[#fcfdfd]">
            <div className="w-[180px] shrink-0 border-r border-[#eceef1] flex items-center justify-center p-4">
              <span className="text-[0.875rem] font-semibold text-[#a1acb8] uppercase tracking-wider">Unit</span>
            </div>
            <div className="flex-1 flex">
              {next14Days.map((day, i) => (
                <div key={i} className={`flex-1 flex flex-col items-center justify-center py-3 border-r border-[#eceef1] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfd]'}`}>
                  <span className="text-[1.125rem] font-bold text-[#566a7f] leading-none mb-1">{day.getDate()}</span>
                  <span className="text-[0.8125rem] font-medium text-[#a1acb8] uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Properties Rows */}
          {propertyList.map((prop, idx) => {
            const propsReservations = allReservations.filter(r => r._property.id === prop.id && r.status !== 'cancelled' && r.status !== 'declined');
            
            return (
              <div key={prop.slug} className={`flex ${idx !== propertyList.length - 1 ? 'border-b border-[#eceef1]' : ''}`}>
                {/* Property Name Sidebar */}
                <div className="w-[180px] shrink-0 border-r border-[#eceef1] p-4 flex flex-col justify-center bg-white z-10">
                  <span className="font-semibold text-[#566a7f] text-[0.9375rem] leading-tight flex items-center gap-2">
                     <Home size={16} className="text-[#696cff] shrink-0"/> {prop.title}
                  </span>
                  <span className="text-[#a1acb8] text-[0.8125rem] mt-1 font-medium">({getUnitAbbr(prop.title)})</span>
                </div>

                {/* Timeline Grid */}
                <div className="flex-1 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNy4xNDI4JSIgaGVpZ2h0PSIxMDAlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIi8+PGxpbmUgeDE9IjAlIiB5MT0iMCIgeDI9IjAlIiB5Mj0iMTAwJSIgc3Ryb2tlPSIjZWNlZWYxIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]">
                  
                  {/* Grid divisions mapped correctly */}
                  <div className="absolute inset-0 flex">
                    {Array.from({length: 14}).map((_, i) => (
                      <div key={i} className="flex-1 border-r border-[#eceef1] h-[72px]"></div>
                    ))}
                  </div>

                  {/* Reservation Pills */}
                  <div className="absolute inset-0 h-[72px]">
                    {propsReservations.map((res: any) => {
                      const checkIn = getStartOfDay(new Date(res.arrival_date || res.check_in));
                      const checkOut = getStartOfDay(new Date(res.departure_date || res.check_out));
                      
                      const startIdx = Math.max(0, diffDays(todayDate, checkIn));
                      const endIdx = Math.min(14, diffDays(todayDate, checkOut));
                      
                      if (endIdx <= 0 || startIdx >= 14) return null;
                      
                      const colspan = Math.max(0.5, endIdx - startIdx);
                      const isAirbnb = res.platform === 'airbnb';
                      const bgColor = isAirbnb ? 'bg-[#00a699]' : 'bg-[#2a5bbf]'; // teal or vrbo blue
                      return (
                        <div 
                          key={res.id} 
                          className="absolute top-2 bottom-2 z-20 group"
                          style={{
                             left: `calc( ${startIdx} * (100% / 14) + 6px )`,
                             width: `calc( ${colspan} * (100% / 14) - 12px )`
                          }}
                        >
                           {/* Skewed Container for the pill look */}
                           <div className={`w-full h-full ${bgColor} rounded-[0.25rem] -skew-x-[12deg] shadow-sm border border-black/10 flex items-center overflow-hidden pr-3 pl-4`}>
                             {/* Unskewed Content Wrapper */}
                             <div className="flex items-center w-full h-full skew-x-[12deg]">
                               {res.guest?.profile_picture && (
                                 // eslint-disable-next-line @next/next/no-img-element
                                 <img src={res.guest?.profile_picture} className="w-[1.875rem] h-[1.875rem] rounded-full border-2 border-white/50 mr-2 shrink-0 object-cover shadow-sm bg-black/10" />
                               )}
                               <span className="font-semibold text-[0.875rem] text-white truncate drop-shadow-sm">
                                 {res.guest?.first_name} {res.guest?.last_name?.[0]}
                               </span>
                             </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Widget 2: Upcoming Reservations Table */}
      <section className="bg-white rounded-[0.5rem] border border-[#eceef1] shadow-[0_0.25rem_1rem_rgba(161,172,184,0.15)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#eceef1] flex justify-between items-center bg-white z-10 sticky top-0">
          <h4 className="text-[1.125rem] font-medium text-[#566a7f] m-0">Upcoming Reservations</h4>
          <span className="bg-[#e7e7ff] text-[#696cff] text-xs font-semibold px-2.5 py-1 rounded">
            {allReservations.length} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eceef1] bg-[#fcfdfd]">
                <th className="px-6 py-3.5 text-[0.75rem] font-semibold text-[#a1acb8] uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3.5 text-[0.75rem] font-semibold text-[#a1acb8] uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3.5 text-[0.75rem] font-semibold text-[#a1acb8] uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3.5 text-[0.75rem] font-semibold text-[#a1acb8] uppercase tracking-wider">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef1]">
              {allReservations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#a1acb8] text-[0.9375rem]">
                    No upcoming reservations found.
                  </td>
                </tr>
              )}
              {allReservations.map((res) => {
                const guestName = res.guest?.first_name ? `${res.guest.first_name} ${res.guest.last_name || ''}` : 'Unknown Guest';
                const guestPic = res.guest?.profile_picture || null;
                let payout = res.nights * 150; // Fallback estimate
                if (res.financials?.host?.revenue?.amount) {
                  payout = res.financials.host.revenue.amount / 100;
                }
                const platformLabel = getPlatformLabel(res.platform);
                
                return (
                  <tr key={res.id} className="hover:bg-[#fcfdfd] transition-colors group cursor-default">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#eceef1] flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-[#d9dee3]/50">
                          {guestPic ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={guestPic} alt={guestName} className="w-full h-full object-cover" />
                          ) : (
                            <User size={18} className="text-[#a1acb8]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[0.9375rem] font-medium text-[#566a7f] m-0 group-hover:text-[#696cff] transition-colors">{guestName}</p>
                          <p className="text-[0.75rem] font-bold text-[#a1acb8] m-0 mt-0.5">{platformLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[0.9375rem] tracking-tight font-medium text-[#697a8d] flex items-center gap-2">
                        <Calendar size={15} className="text-[#a1acb8]" />
                        {formatTableDate(res.check_in)} - {formatTableDate(res.check_out)}
                      </div>
                      <p className="text-[0.75rem] font-medium text-[#a1acb8] m-0 ml-[1.4rem] mt-0.5 tracking-tight">{res.nights} nights</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#f5f5f9] text-[#697a8d] text-[0.8125rem] font-medium border border-[#d9dee3]">
                        {res._property.title} <strong className="ml-1 opacity-70">({getUnitAbbr(res._property.title)})</strong>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[0.9375rem] font-semibold text-[#566a7f]">
                        {typeof payout === 'number' ? `$${payout.toFixed(2)}` : (payout ? `$${payout}` : 'TBD')}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
