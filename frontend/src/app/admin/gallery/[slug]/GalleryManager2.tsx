'use client';

import { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, X, GripVertical, Loader2 } from 'lucide-react';

interface SortableItemProps {
  id: string;
  url: string;
  isHero?: boolean;
  onRemove: (url: string) => void;
}

function SortableItem({ id, url, isHero, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group bg-white rounded-[0.5rem] overflow-hidden border transition-all ${
        isDragging ? 'border-[#696cff] shadow-xl scale-105' : 'border-[#eceef1] hover:border-[#d9dee3]'
      } ${isHero ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
    >
      <div className="w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Gallery image" className="w-full h-full object-cover absolute inset-0" />
      </div>

      {isHero && (
        <div className="absolute top-3 left-3 bg-[#696cff] text-white text-[0.75rem] font-semibold px-2.5 py-1 rounded-[0.375rem] shadow-sm flex items-center gap-1.5 z-10">
          <Check size={14} /> Hero Image
        </div>
      )}

      {/* Overlay Actions */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(67,89,113,0.8)] to-transparent pt-12 pb-3 px-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          type="button"
          {...attributes} 
          {...listeners} 
          className="bg-white/90 hover:bg-white text-[#566a7f] p-1.5 rounded-[0.375rem] shadow-sm transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <button 
          type="button"
          onClick={() => onRemove(url)} 
          className="bg-[#ff3e1d] hover:bg-[#e03112] p-1.5 rounded-[0.375rem] text-white shadow-sm transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function GalleryManager2({
  slug,
  availableImages,
  initialSavedImages
}: {
  slug: string;
  availableImages: string[];
  initialSavedImages?: string[] | null;
}) {
  const [selectedImages, setSelectedImages] = useState<string[]>(
    initialSavedImages && initialSavedImages.length > 0 ? initialSavedImages : availableImages
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const unselectedImages = availableImages.filter(img => !selectedImages.includes(img));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const performSave = useCallback(async (imagesToSave: string[]) => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      
      const res = await fetch(`${apiUrl}/api/v1/admin/galleries/${slug}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ [slug]: imagesToSave })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Saved' });
      } else {
        setMessage({ type: 'error', text: 'Error' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  }, [slug]);

  const updateImages = (newImages: string[]) => {
    setSelectedImages(newImages);
    performSave(newImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = selectedImages.indexOf(active.id as string);
      const newIndex = selectedImages.indexOf(over.id as string);
      const newArray = arrayMove(selectedImages, oldIndex, newIndex);
      updateImages(newArray);
    }
  };

  const handleRemove = (url: string) => updateImages(selectedImages.filter(img => img !== url));
  const handleAdd = (url: string) => updateImages([...selectedImages, url]);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[0.5rem] border border-[#eceef1] shadow-[0_0.125rem_0.25rem_rgba(161,172,184,0.075)]">
        <div>
          <h2 className="text-[1.125rem] font-medium text-[#566a7f] flex items-center gap-2">
            Selected Images <span className="bg-[#e7e7ff] text-[#696cff] text-xs py-0.5 px-2 rounded font-semibold">{selectedImages.length}</span>
          </h2>
          <p className="text-[#a1acb8] text-[0.875rem] mt-1">Drag to reorder. Changes are saved automatically.</p>
        </div>
        <div className="flex items-center gap-3">
          {isSaving && <span className="text-[#a1acb8] text-[0.9375rem] flex items-center gap-2 font-medium"><Loader2 className="animate-spin" size={16}/> Saving...</span>}
          {!isSaving && message.text && (
            <span className={`text-[0.9375rem] font-medium ${message.type === 'success' ? 'text-[#71dd37]' : 'text-[#ff3e1d]'}`}>
              {message.text}
            </span>
          )}
        </div>
      </div>

      {/* Selected Images Grid */}
      <div className="bg-white p-6 rounded-[0.5rem] border border-[#eceef1] relative z-10 shadow-[0_0.125rem_0.25rem_rgba(161,172,184,0.075)]">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selectedImages} strategy={rectSortingStrategy}>
             {/* Denser grid with fixed row height to make Hero exactly 2x size */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[160px] gap-4">
              {selectedImages.map((url, index) => (
                <SortableItem key={url} id={url} url={url} isHero={index === 0} onRemove={handleRemove} />
              ))}
              {selectedImages.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-[#eceef1] rounded-[0.5rem]">
                  <p className="text-[#a1acb8]">No images selected. Add some from the available list below.</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Available Images */}
      {unselectedImages.length > 0 && (
        <div className="bg-white p-6 rounded-[0.5rem] border border-[#eceef1] shadow-[0_0.125rem_0.25rem_rgba(161,172,184,0.075)]">
          <div className="mb-6">
            <h2 className="text-[1.125rem] font-medium text-[#566a7f] flex items-center gap-2">
              Available from Hospitable <span className="bg-[#eceef1] text-[#566a7f] text-xs py-0.5 px-2 rounded font-semibold">{unselectedImages.length}</span>
            </h2>
            <p className="text-[#a1acb8] text-[0.875rem] mt-1">Click to add these back to your listing.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {unselectedImages.map((url) => (
              <div key={url} className="relative group rounded-[0.5rem] overflow-hidden border border-[#eceef1] bg-[#f5f5f9] aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Available" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300" />
                
                <div className="absolute inset-0 bg-[#435971]/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleAdd(url)}
                    className="bg-white text-[#566a7f] font-semibold px-4 py-2 rounded-[0.375rem] text-[0.875rem] shadow-sm transform scale-95 group-hover:scale-100 transition-transform"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
