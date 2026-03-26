export async function getTotalReviewsCount(): Promise<number> {
  const token = process.env.HOSPITABLE_ACCESS_TOKEN;
  if (!token) return 0;
  
  try {
    const res = await fetch('https://public.api.hospitable.com/v2/properties', {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return 0;
    
    const json = await res.json();
    const propertyIds = json.data.map((p: any) => p.id);
    
    let totalReviews = 0;
    for (const propId of propertyIds) {
      const revRes = await fetch(`https://public.api.hospitable.com/v2/properties/${propId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 }
      });
      if (revRes.ok) {
        const revJson = await revRes.json();
        totalReviews += revJson.meta?.total || 0;
      }
    }
    return totalReviews;
  } catch (error) {
    console.error('Failed to fetch total reviews count:', error);
    return 0;
  }
}
