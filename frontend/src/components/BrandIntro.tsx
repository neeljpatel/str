'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MapPin, Users, Car, HeartHandshake, CheckCircle2, Wifi, Utensils, Shirt, Tv, Baby, Coffee, Wind, BedDouble } from 'lucide-react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CENTER = { lat: 41.8967, lng: -87.6373 }; // Orleans & Chicago intersection

const POIS = [
  { name: 'Navy Pier', position: { lat: 41.892654, lng: -87.604202 } },
  { name: 'Magnificent Mile', position: { lat: 41.8988, lng: -87.6245 } },
  { name: 'West Loop', position: { lat: 41.8842, lng: -87.6475 } },
  { name: 'Soldier Field', position: { lat: 41.8623, lng: -87.6167 } },
  { name: 'United Center', position: { lat: 41.8807, lng: -87.6742 } },
  { name: 'Lincoln Park Zoo', position: { lat: 41.9211, lng: -87.6340 } },
  { name: 'Wrigley Field', position: { lat: 41.9484, lng: -87.6553 } },
];

const pinSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
  <path fill="#1a1a1a" stroke="#fff" stroke-width="2" d="M16 2C9.37 2 4 7.37 4 14c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
  <circle cx="16" cy="14" r="5" fill="#c5a059"/>
</svg>
`);
const pinIcon = `data:image/svg+xml;charset=UTF-8,${pinSvg}`;



export default function BrandIntro() {
  const introRef = useRef<HTMLDivElement>(null);

  const [hoveredPoi, setHoveredPoi] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro-content', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 75%',
        }
      });
      gsap.from('.map-container', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 75%',
        }
      });
    }, introRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={introRef} className="bg-white py-24 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 intro-content">
          <h2 className="font-serif text-4xl lg:text-5xl text-brand-dark leading-snug">
            Why Stay With <span className="text-brand-gold italic">Us?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          <div className="space-y-10 flex flex-col justify-center">
            
            <div className="intro-content">
              <h3 className="font-serif text-3xl text-brand-dark mb-8">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-brand-gold shrink-0 mt-1" size={32} />
                  <div>
                    <h4 className="font-semibold text-brand-dark text-lg">Central Location</h4>
                    <p className="text-sm text-gray-600 mt-1">Steps away from top attractions, dining, and transit.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="text-brand-gold shrink-0 mt-1" size={32} />
                  <div>
                    <h4 className="font-semibold text-brand-dark text-lg">Large Groups</h4>
                    <p className="text-sm text-gray-600 mt-1">Expansive layouts to comfortably fit your whole party.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Car className="text-brand-gold shrink-0 mt-1" size={32} />
                  <div>
                    <h4 className="font-semibold text-brand-dark text-lg">Dedicated Parking</h4>
                    <p className="text-sm text-gray-600 mt-1">Hassle-free, guaranteed parking at the property.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <HeartHandshake className="text-brand-gold shrink-0 mt-1" size={32} />
                  <div>
                    <h4 className="font-semibold text-brand-dark text-lg">Impeccable Service</h4>
                    <p className="text-sm text-gray-600 mt-1">24/7 dedicated support and seamless check-in.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-content border-t border-gray-100 pt-8 mt-8">
              <h3 className="font-serif text-2xl text-brand-dark mb-6">Shared Amenities</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  <Wifi className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">Fast WiFi</span>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">Equipped Kitchen</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shirt className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">In-Unit Laundry</span>
                </div>
                <div className="flex items-center gap-3">
                  <Tv className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">Smart TVs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Baby className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">Pack 'n Play / High Chair</span>
                </div>
                <div className="flex items-center gap-3">
                  <Coffee className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">Free Coffee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wind className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">AC & Heating</span>
                </div>
                <div className="flex items-center gap-3">
                  <BedDouble className="text-gray-400 shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">Fresh Linens</span>
                </div>
              </div>
            </div>

          </div>

          <div className="map-container relative h-[500px] lg:h-auto min-h-[500px] rounded-sm overflow-hidden border-2 border-brand-gold/20 shadow-xl bg-gray-50">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
              <Map
                defaultCenter={CENTER}
                defaultZoom={11.5}
                disableDefaultUI={true}
                styles={[
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                  }
                ]}
                className="w-full h-full"
              >
                {/* Center Area Radius - using a Vector Path so it anchors at perfectly (0,0) */}
                <Marker 
                  position={CENTER} 
                  icon={{
                    path: 'M -45, 0 A 45,45 0 1,1 45,0 A 45,45 0 1,1 -45,0',
                    fillColor: '#c5a059',
                    fillOpacity: 0.3,
                    strokeColor: '#c5a059',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    scale: 1,
                  }} 
                />

                {/* POI Markers */}
                {POIS.map((poi, idx) => (
                  <Marker 
                    key={idx} 
                    position={poi.position} 
                    icon={pinIcon} 
                    onMouseOver={() => setHoveredPoi(poi.name)}
                    onMouseOut={() => setHoveredPoi(null)}
                  />
                ))}

                {hoveredPoi && (
                  <InfoWindow
                    position={POIS.find(p => p.name === hoveredPoi)?.position}
                    disableAutoPan={true}
                    headerDisabled={true}
                  >
                    <div className="px-2 py-1 text-center">
                      <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">{hoveredPoi}</span>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>

        </div>
      </div>
    </div>
  );
}
