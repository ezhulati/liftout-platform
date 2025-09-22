import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingCTA } from '@/components/landing/LandingCTA';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </main>
  );
}