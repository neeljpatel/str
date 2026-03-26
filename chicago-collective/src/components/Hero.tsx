'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { Users, Briefcase, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const properties = [
  {
    id: 'windy-city',
    title: 'Windy City Condo',
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-46838034/original/3cecf53f-9757-49c6-8d4c-8437ddb37c5c.jpeg',
    info: '3 Bedrooms • 2 Baths • Up to 10 Guests • 2 Parking Spots',
    link: '/property/windy-city'
  },
  {
    id: 'navy-pier',
    title: 'Navy Pier Condo',
    image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NDg2NzM4OTc%3D/original/61d84765-c9dd-47ce-8101-40364b024c4a.jpeg',
    info: '3 Bedrooms • 2 Baths • Up to 10 Guests • Free Onsite Parking',
    link: '/property/navy-pier'
  }
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2
      });
      
      gsap.from('.property-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cards-container',
          start: 'top 80%',
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const videoOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      start: 585,
      vq: 'small' // attempt to force 240p
    },
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    event.target.setPlaybackQuality('small');
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Hero Header Section with Video */}
      <div className="relative pt-40 pb-32 lg:pt-52 lg:pb-48 min-h-[70vh] flex items-center w-full overflow-hidden bg-brand-dark">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
          <YouTube
            videoId="bMQI8ZG1ysU"
            opts={videoOptions}
            onReady={onPlayerReady}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] opacity-60"
            iframeClassName="w-full h-full pointer-events-none"
          />
          {/* Overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-brand-dark/50 z-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Headline & 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text */}
            <div className="text-left text-white max-w-2xl px-4 lg:px-0">
              <h1 className="hero-text font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 drop-shadow-md">
                Your Premier Chicago <span className="text-brand-gold italic">Retreat</span>
              </h1>
              <p className="hero-text text-lg md:text-xl text-gray-200 font-light drop-shadow-sm">
                Stay in the Heart of the City with Room for Everyone.
              </p>
            </div>

            {/* Right Column: Perfect for your group */}
            <div className="hero-text px-4 lg:px-0">
              <h3 className="font-serif text-2xl lg:text-3xl text-white mb-8 drop-shadow-sm">Perfect For Your Group</h3>
              <div className="flex flex-col gap-8">
                
                {/* Families */}
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6c38] flex shrink-0 items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white w-8 h-8" />
                  </div>
                  <span className="font-bold text-white text-lg tracking-wide uppercase drop-shadow-md">Family Gatherings</span>
                </div>
                
                {/* Conferences */}
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6c38] flex shrink-0 items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="text-white w-8 h-8" />
                  </div>
                  <span className="font-bold text-white text-lg tracking-wide uppercase drop-shadow-md">Conferences</span>
                </div>
                
                {/* Bachelor & Bachelorettes */}
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6c38] flex shrink-0 items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="text-white w-8 h-8" />
                  </div>
                  <span className="font-bold text-white text-lg tracking-wide uppercase drop-shadow-md leading-tight">Bachelor & <br className="sm:hidden" />Bachelorettes</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Cards Section */}
      <div className="py-24 bg-brand-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl text-brand-dark mb-4">
              Explore Our <span className="text-brand-gold italic">Condos</span>
            </h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
          </div>

          <div className="cards-container grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {properties.map((prop) => (
              <Link href={prop.link} key={prop.id} className="property-card group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden mb-6 shadow-xl">
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-w-768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-serif text-3xl text-white mb-2">{prop.title}</h3>
                    <div className="text-white/90 text-sm tracking-widest uppercase font-semibold">
                      Explore Property &rarr;
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 uppercase tracking-[0.15em] text-sm mb-2 font-medium">
                    {prop.info}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
