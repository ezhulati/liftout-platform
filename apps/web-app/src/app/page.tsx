import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorksTabs } from '@/components/landing/HowItWorksTabs';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        <LandingHero />
        <HowItWorksTabs />
        <LandingFeatures />
        <TrustIndicators />
        <Testimonials />
        <FAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </>
  );
}
