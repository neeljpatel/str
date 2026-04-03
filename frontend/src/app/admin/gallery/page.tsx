import Link from 'next/link';
import { getProperties } from '@/lib/data';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

export default async function Admin2GalleryHome() {
  const properties = await getProperties();
  const propertyList = Object.keys(properties).map((slug) => ({
    slug,
    title: properties[slug].title,
    location: properties[slug].location,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h4 className="text-[1.375rem] font-medium text-[#566a7f] mb-2">Image Gallery Management</h4>
        <p className="text-[#a1acb8] text-[0.9375rem]">Select a property below to curate its image gallery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyList.map((prop) => (
          <div key={prop.slug} className="bg-white rounded-[0.5rem] shadow-[0_0.25rem_1rem_rgba(161,172,184,0.15)] flex flex-col hover:shadow-[0_0.25rem_1.5rem_rgba(161,172,184,0.25)] transition-shadow">
            <div className="p-6 flex-grow">
              <div className="w-12 h-12 bg-[#e7e7ff] text-[#696cff] rounded-[0.5rem] flex items-center justify-center mb-4">
                <ImageIcon size={24} />
              </div>
              <h5 className="text-[1.125rem] font-medium text-[#566a7f] mb-1">{prop.title}</h5>
              <p className="text-[#a1acb8] text-[0.9375rem] mb-6">{prop.location}</p>
            </div>
            <div className="px-6 py-4 border-t border-[#eceef1] bg-[#fcfdfd] rounded-b-[0.5rem]">
              <Link 
                href={`/admin/gallery/${prop.slug}`}
                className="inline-flex items-center gap-2 text-[#696cff] hover:text-[#5f61e6] font-medium text-[0.9375rem] transition-colors"
              >
                Manage Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
