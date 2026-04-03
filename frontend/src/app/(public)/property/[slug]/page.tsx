import { getProperties } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BedDouble, Users, Bath, Clock, Check, Star, Quote } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getImages(uuid: string): Promise<string[]> {
  try {
    const res = await fetch(`${apiUrl}/api/v1/public/hospitable/properties/${uuid}/images`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.images || [];
  } catch (error) {
    console.error('Failed to fetch images from backend:', error);
    return [];
  }
}

async function getReviews(uuid: string): Promise<any[]> {
  try {
    const res = await fetch(`${apiUrl}/api/v1/public/hospitable/properties/${uuid}/reviews`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.reviews || [];
  } catch (error) {
    console.error('Failed to fetch reviews from backend:', error);
    return [];
  }
}

async function getSavedGalleryData(slug: string) {
  try {
    const res = await fetch(`${apiUrl}/api/v1/public/galleries/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.images || [];
  } catch(e) {
    return [];
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const properties = await getProperties();
  const property = properties[slug];

  if (!property) {
    notFound();
  }

  const reviews = await getReviews(property.id);

  const savedImages = await getSavedGalleryData(slug);

  let imagesToDisplay = property.images || [];
  if (savedImages && savedImages.length > 0) {
    imagesToDisplay = savedImages;
  } else {
    const apiImages = await getImages(property.id);
    if (apiImages.length > 0) {
      imagesToDisplay = apiImages;
    }
  }

  return (
    <main className="flex-grow pt-[84px] bg-brand-light">
      {/* IMAGE GALLERY */}
      <ImageGallery images={imagesToDisplay} title={property.title} />

      {/* HEADER INFO */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-dark mb-2">{property.title}</h1>
          <p className="text-gray-500 tracking-widest uppercase text-sm mb-6">{property.location}</p>
          <p className="font-serif italic text-xl text-gray-600">"{property.summary}"</p>
        </div>
      </div>
      
      {/* QUICK INFO BAR */}
      <div className="bg-brand-light border-b border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-gray-600 tracking-widest uppercase items-center">
          <span className="flex items-center gap-2"><BedDouble size={18} className="text-brand-gold"/> {property.capacity.bedrooms} Bedrooms</span>
          <span className="flex items-center gap-2"><Users size={18} className="text-brand-gold"/> up to {property.capacity.guests} Guests</span>
          <span className="flex items-center gap-2"><Bath size={18} className="text-brand-gold"/> {property.capacity.bathrooms} Baths</span>
          <span className="flex items-center gap-2"><Clock size={18} className="text-brand-gold"/> Check-in: {property.checkin}</span>
        </div>
      </div>

      {/* STICKY NAV */}
      <div className="bg-brand-light sticky top-[84px] z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-8 md:space-x-16 py-4 text-xs tracking-[0.2em] font-medium text-gray-500">
          <a href="#overview" className="hover:text-brand-dark">OVERVIEW</a>
          <a href="#amenities" className="hover:text-brand-dark">AMENITIES</a>
          <a href="#details" className="hover:text-brand-dark">DETAILS</a>
          <a href="#rules" className="hover:text-brand-dark">HOUSE RULES</a>
          <a href="#reviews" className="hover:text-brand-dark">REVIEWS</a>
        </div>
      </div>

      {/* MAIN SPLIT CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* LEFT COLUMN */}
          <div className="col-span-1 lg:col-span-2 space-y-16">
            
            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-[180px]">
              <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-gray-200 text-brand-dark">Overview</h2>
              <p className="text-gray-600 font-light leading-relaxed mb-8">{property.overview}</p>
              
              <h3 className="font-serif text-xl mb-4 text-brand-dark">What You'll Love</h3>
              <ul className="space-y-3">
                {property.space_overview.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-gray-600 font-light">
                    <span className="text-brand-gold shrink-0 translate-y-1">■</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* AMENITIES */}
            <section id="amenities" className="scroll-mt-[180px]">
              <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-gray-200 text-brand-dark">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600 font-light">
                    <Check size={18} className="text-brand-gold" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* DETAILS */}
            <section id="details" className="scroll-mt-[180px]">
              <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-gray-200 text-brand-dark">Details</h2>
              
              <div className="mb-0">
                <h3 className="font-serif text-xl mb-4 text-brand-dark">Bedroom Details</h3>
                <div className="grid gap-3">
                  {property.rooms.map((room: any, i: number) => (
                    <div key={i} className="flex justify-between border-b border-gray-100 pb-2 text-gray-600 font-light">
                      <span>{room.name}</span>
                      <span className="text-gray-400">{room.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* HOUSE RULES */}
            <section id="rules" className="scroll-mt-[180px]">
              <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-gray-200 text-brand-dark">House Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.rules.map((rule: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-gray-600 font-light">
                    <Check size={18} className="text-brand-gold shrink-0 mt-1" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* REVIEWS */}
            {reviews.length > 0 && (
              <section id="reviews" className="scroll-mt-[180px]">
                <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-gray-200 text-brand-dark">Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reviews.slice(0, 3).map((review: any) => {
                    const stayDate = review.stay_date ? new Date(review.stay_date) : null;
                    const monthYear = stayDate
                      ? stayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : null;

                    return (
                      <div key={review.id} className="bg-white p-5 shadow-sm border border-gray-100 rounded-sm flex flex-col">
                        <div className="mb-3">
                          <div className="flex space-x-0.5 text-brand-gold mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} fill="currentColor" />
                            ))}
                          </div>
                          <span className="font-bold tracking-widest uppercase text-xs text-gray-800">
                            {review.guest_first_name || 'Guest'}
                          </span>
                          {monthYear && (
                            <span className="text-gray-400 text-xs ml-2">
                              &mdash; {monthYear}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 font-light leading-relaxed italic text-sm flex-grow">
                          &ldquo;{review.review}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-1 relative">
            {property.iframeSrc && (
              <iframe
                id="booking-iframe"
                sandbox="allow-top-navigation allow-scripts allow-same-origin"
                style={{ width: '100%', height: '900px' }}
                frameBorder="0"
                src={property.iframeSrc}
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
