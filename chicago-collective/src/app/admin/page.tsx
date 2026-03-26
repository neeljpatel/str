import { properties } from '@/lib/data';
import Image from 'next/image';
import { Calendar, User, Home } from 'lucide-react';

async function getReservationsForProperty(uuid: string, fromDateStr: string, toDateStr: string) {
  const token = process.env.HOSPITABLE_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(`https://public.api.hospitable.com/v2/reservations?start_date=${fromDateStr}&end_date=${toDateStr}&properties[]=${uuid}&include=guest,financials`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Admin2Dashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const fromDateStr = today.toISOString().split('T')[0];
  const toDate = new Date(today);
  toDate.setDate(toDate.getDate() + 90); // fetch 90 days out for reservations table
  const toDateStr = toDate.toISOString().split('T')[0];

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
    allReservations.push(...resList);
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
                      // Simple SVG icons for Airbnb vs VRBO
                      const PlatformIcon = isAirbnb 
                        ? <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M16 1.636c4.634 0 9.872 1.604 13.91 4.341l.24.168.188.136c.217.164.444.337.68.523l.119.098c.574.484 1.393 1.258 2.062 2.217.854 1.222 1.343 2.502 1.442 3.791l.011.233c.01.218.01.44 0 .666l-.014.22c-.106 1.285-.595 2.56-1.44 3.782-.676.968-1.503 1.748-2.083 2.238l-.116.096c-.235.186-.46.357-.674.519L30.15 20.8l-.241.168C25.872 23.705 20.634 25.31 16 25.31c-4.634 0-9.872-1.604-13.91-4.341l-.24-.168-.188-.136c-.217-.164-.444-.337-.68-.523l-.119-.098c-.574-.484-1.393-1.258-2.062-2.217C-.053 16.605-.542 15.325-.641 14.036L-.652 13.803c-.01-.218-.01-.44 0-.666l.014-.22c.106-1.285.595-2.56 1.44-3.782.676-.968 1.503-1.748 2.083-2.238l.116-.096c.235-.186.46-.357.674-.519L3.85 6.142l.241-.168C8.128 3.24 13.366 1.635 16 1.635zm0 2.217C11.964 3.853 7.352 5.253 3.65 7.636l-.21.139-.168.115c-.173.12-.359.255-.55.405l-.095.076c-.454.37-1.077.945-1.574 1.63-.615.849-.966 1.76-1.037 2.652l-.008.145c-.007.13-.007.262 0 .393l.01.135c.074.887.426 1.795 1.04 2.641.5.688 1.129 1.268 1.589 1.642l.092.074c.189.148.373.283.544.402l.169.117.21.139C7.352 21.693 11.964 23.093 16 23.093c4.036 0 8.648-1.4 12.35-3.783l.21-.139.168-.115c.173-.12.359-.255.55-.405l.095-.076c.454-.37 1.077-.945 1.574-1.63.615-.849.966-1.76 1.037-2.652l.008-.145c.007-.13.007-.262 0-.393l-.01-.135c-.074-.887-.426-1.795-1.04-2.641-.5-.688-1.129-1.268-1.589-1.642l-.092-.074c-.189-.148-.373-.283-.544-.402l-.169-.117-.21-.139C24.648 5.253 20.036 3.853 16 3.853zm0 4.385c2.618 0 4.197 2.308 4.197 5.093 0 2.784-1.58 5.092-4.197 5.092-2.618 0-4.197-2.308-4.197-5.092 0-2.785 1.58-5.093 4.197-5.093zm0 2.217c-1.393 0-1.98 1.298-1.98 2.876s.587 2.875 1.98 2.875c1.393 0 1.98-1.297 1.98-2.875s-.587-2.876-1.98-2.876z"/></svg> 
                        : <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>;

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
                               <span className="font-semibold text-[0.875rem] text-white truncate mr-auto drop-shadow-sm">
                                 {res.guest?.first_name} {res.guest?.last_name?.[0]}
                               </span>
                               <span className="text-white/80 shrink-0 ml-2 drop-shadow-sm">
                                  {PlatformIcon}
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
