'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const reviews = [
  {
    id: 1,
    author: "Renee",
    property: "Windy City Condo",
    text: "Great place! Lots of space for family of 6. Close to all Chicago things! Secure parking also a plus!"
  },
  {
    id: 2,
    author: "Brian",
    property: "Windy City Condo",
    text: "Great stay. Lots of spacious bedrooms to fit large family. Great open kitchen/living communal area to relax together. Was able to walk everywhere..."
  },
  {
    id: 3,
    author: "Andrea",
    property: "Navy Pier Condo",
    text: "Great stay! Location is awesome, close to the heart of the city but far away enough that the area feels more local and less overwhelming."
  },
  {
    id: 4,
    author: "Jordan",
    property: "Navy Pier Condo",
    text: "Had an excellent stay at Ketan’s place. Great location, well-cleaned, incredibly spacious... He went the extra mile to make sure we had an excellent trip!"
  }
];

export default function ReviewsCarousel({ totalReviews }: { totalReviews?: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.review-header', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });
      gsap.from('.review-card', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));

  return (
    <div ref={sectionRef} className="bg-brand-light py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="review-header text-center mb-16">
          <h2 className="font-serif text-4xl text-brand-dark mb-4">Loved by <span className="text-brand-gold italic">Guests</span></h2>
          <p className="text-gray-600 mb-6 font-medium tracking-wide">5 star experiences from {totalReviews || reviews.length} guests and counting</p>
          <div className="w-16 h-[2px] bg-brand-gold mx-auto"></div>
        </div>

        <div className="review-card relative bg-white p-12 lg:p-16 shadow-lg border border-gray-50 flex flex-col items-center text-center mx-auto max-w-4xl">
          <Quote className="text-brand-gold/20 absolute top-8 left-8" size={64} />
          
          <div className="flex space-x-1 mb-6 text-brand-gold">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={20} fill="currentColor" /> )}
          </div>
          
          <p className="font-serif text-xl sm:text-2xl text-brand-dark leading-relaxed mb-8 z-10 relative">
            "{reviews[currentIndex].text}"
          </p>
          
          <div className="mt-auto">
            <h5 className="font-bold tracking-widest uppercase text-sm text-gray-800">{reviews[currentIndex].author}</h5>
            <p className="text-brand-gold text-sm italic mt-1">{reviews[currentIndex].property}</p>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 sm:-mx-12 sm:w-[calc(100%+6rem)] left-0 sm:-left-12">
            <button onClick={prev} className="p-3 bg-white shadow-md border border-gray-100 rounded-full text-brand-dark hover:text-brand-gold hover:scale-110 transition-all">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="p-3 bg-white shadow-md border border-gray-100 rounded-full text-brand-dark hover:text-brand-gold hover:scale-110 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
