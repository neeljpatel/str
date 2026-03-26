import { properties } from '@/lib/data';
import { notFound } from 'next/navigation';
import GalleryManager2 from './GalleryManager2';
import fs from 'fs/promises';
import path from 'path';

async function getHospitableImages(uuid: string) {
  const token = process.env.HOSPITABLE_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(`https://public.api.hospitable.com/v2/properties/${uuid}/images`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((img: any) => img.url);
  } catch (error) {
    return [];
  }
}

async function getSavedGalleryData() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'gallery.json');
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch(e) {
    return {};
  }
}

export default async function Admin2GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties[slug];

  if (!property) {
    notFound();
  }

  const apiImages = await getHospitableImages(property.id);
  const availableImages = apiImages.length > 0 ? apiImages : property.images;

  const savedData = await getSavedGalleryData();
  const savedImages = savedData[slug] || null;

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
