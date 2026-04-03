import { getProperties } from '@/lib/data';
import { notFound } from 'next/navigation';
import GalleryManager2 from './GalleryManager2';

import { createClient } from '@/utils/supabase/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getHospitableImages(uuid: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) return [];
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/admin/hospitable/properties/${uuid}/images`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.images || [];
  } catch (error) {
    console.error('Failed to fetch admin images from backend:', error);
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

export default async function Admin2GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const properties = await getProperties();
  const property = properties[slug];

  if (!property) {
    notFound();
  }

  const apiImages = await getHospitableImages(property.id);
  const availableImages = apiImages.length > 0 ? apiImages : property.images;

  const savedImages = await getSavedGalleryData(slug);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h4 className="text-[1.375rem] font-medium text-[#566a7f] mb-2">{property.title} Settings</h4>
        <p className="text-[#a1acb8] text-[0.9375rem]">
          Curate the image gallery for this listing. Only officially synced images from the Hospitable API are allowed. The first item in your selection will automatically be used as the primary Hero Image.
        </p>
      </div>

      <GalleryManager2 
        slug={slug} 
        availableImages={availableImages} 
        initialSavedImages={savedImages} 
      />
    </div>
  );
}
