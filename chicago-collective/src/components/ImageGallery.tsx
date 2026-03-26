'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const child = current.children[0] as HTMLElement;
      if (child) {
        const scrollAmount = child.offsetWidth + 16;
        current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
    setTimeout(() => {
      if (fullscreenContainerRef.current) {
        const { current } = fullscreenContainerRef;
        const child = current.children[index] as HTMLElement;
        if (child) {
          current.scrollTo({ left: child.offsetLeft, behavior: 'instant' as ScrollBehavior });
        }
      }
    }, 10);
  };

  return (
    <>
      <div className="w-full relative bg-brand-light pb-4 md:pb-8 group">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-[5vw] md:px-[15vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img, i) => (
            <div 
              key={i} 
              className="flex-[0_0_90vw] md:flex-[0_0_70vw] h-[50vh] md:h-[70vh] snap-center relative cursor-pointer group/item overflow-hidden"
              onClick={() => openFullscreen(i)}
            >
              <Image 
                src={img} 
                alt={`${title} image ${i + 1}`} 
                fill 
                className="object-cover transition-transform duration-700 group-hover/item:scale-105" 
                priority={i === 0} 
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-300 pointer-events-none group-hover/item:bg-transparent" />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-4 md:left-8 top-[25vh] md:top-[35vh] -translate-y-1/2 bg-white/80 text-brand-dark p-3 rounded-full hover:bg-white shadow-lg backdrop-blur-sm transition-all z-10 hidden md:flex opacity-0 group-hover:opacity-100 items-center justify-center transform -translate-x-4 group-hover:translate-x-0"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-4 md:right-8 top-[25vh] md:top-[35vh] -translate-y-1/2 bg-white/80 text-brand-dark p-3 rounded-full hover:bg-white shadow-lg backdrop-blur-sm transition-all z-10 hidden md:flex opacity-0 group-hover:opacity-100 items-center justify-center transform translate-x-4 group-hover:translate-x-0"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* View Fullscreen Button */}
        <button 
          onClick={() => openFullscreen(0)} 
          className="absolute top-4 right-[5vw] md:top-6 md:right-[15vw] md:-translate-x-4 bg-brand-dark/90 text-white px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-sm font-medium tracking-widest uppercase hover:bg-black backdrop-blur-md transition-all z-10 pointer-events-auto border border-white/10 shadow-lg flex items-center gap-2"
        >
          View Fullscreen
        </button>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-300">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-sm md:text-base tracking-widest pointer-events-auto px-4 py-2 rounded-full font-serif">
              {fullscreenIndex + 1} / {images.length}
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="p-3 hover:bg-white/10 rounded-full transition-colors pointer-events-auto flex items-center gap-2 text-sm tracking-widest uppercase"
            >
              <span className="hidden md:inline mr-2">Close</span>
              <X size={24} />
            </button>
          </div>

          {/* Scroll Container */}
          <div 
            ref={fullscreenContainerRef}
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              const index = Math.round(target.scrollLeft / target.offsetWidth);
              setFullscreenIndex(index);
            }}
            className="flex-grow flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {images.map((img, i) => (
              <div key={i} className="min-w-full h-full snap-center flex items-center justify-center relative px-0 md:px-20 py-20 select-none">
                <Image 
                  src={img} 
                  alt={`${title} fullscreen ${i + 1}`} 
                  fill 
                  className="object-contain" 
                  priority={Math.abs(i - fullscreenIndex) <= 1}
                  quality={100}
                />
              </div>
            ))}
          </div>

          {/* Nav Buttons */}
          <button 
            onClick={() => {
              const target = fullscreenContainerRef.current;
              if (target) {
                target.scrollBy({ left: -target.offsetWidth, behavior: 'smooth' });
              }
            }} 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 hover:bg-white/10 rounded-full transition-colors z-20 hidden md:block"
          >
            <ChevronLeft size={48} className="opacity-70 hover:opacity-100" />
          </button>
          <button 
            onClick={() => {
              const target = fullscreenContainerRef.current;
              if (target) {
                target.scrollBy({ left: target.offsetWidth, behavior: 'smooth' });
              }
            }} 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 hover:bg-white/10 rounded-full transition-colors z-20 hidden md:block"
          >
            <ChevronRight size={48} className="opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}
    </>
  );
}
