import Hero from '@/components/Hero';
import BrandIntro from '@/components/BrandIntro';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { getTotalReviewsCount } from '@/lib/hospitable';

export default async function Home() {
  const totalReviews = await getTotalReviewsCount();

  return (
    <main className="flex-grow">
      <Hero />
      <BrandIntro />
      <ReviewsCarousel totalReviews={totalReviews} />
    </main>
  );
}
