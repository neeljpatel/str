export async function getTotalReviewsCount(): Promise<number> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/public/hospitable/reviews/total`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return 0;
    
    const json = await res.json();
    return json.total_reviews || 0;
  } catch (error) {
    console.error('Failed to fetch total reviews count from backend:', error);
    return 0;
  }
}
