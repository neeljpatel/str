import Hero from '@/components/Hero';
import BrandIntro from '@/components/BrandIntro';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { getTotalReviewsCount } from '@/lib/hospitable';
import { getProperties } from '@/lib/data';

export default async function Home() {
  const totalReviews = await getTotalReviewsCount();
  const propertiesData = await getProperties();
  
  const propertyList = Object.values(propertiesData);

  return (
    <main className="flex-grow">
      <Hero properties={propertyList} />
      <BrandIntro />
      <ReviewsCarousel totalReviews={totalReviews} />
    </main>
  );
}
