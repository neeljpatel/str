const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function getProperties() {
  try {
    const res = await fetch(`${apiUrl}/api/v1/public/properties`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return {};
    
    const propsList = await res.json();
    
    // Convert array back to record map for frontend compatibility
    const propertiesMap: Record<string, any> = {};
    for (const prop of propsList) {
      propertiesMap[prop.slug] = prop;
    }
    return propertiesMap;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return {};
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    const res = await fetch(`${apiUrl}/api/v1/public/properties/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch property ${slug}:`, error);
    return null;
  }
}
