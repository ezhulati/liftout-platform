import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CompanyHero } from '@/components/landing/CompanyHero';
import { CompanyFeatures } from '@/components/landing/CompanyFeatures';
import { CompanyCTA } from '@/components/landing/CompanyCTA';

export const metadata = {
  title: 'For Companies - Acquire Proven Teams | Liftout',
  description: 'Acquire intact, high-performing teams that hit the ground running. Zero team-building phase, verified track records, immediate productivity.',
};

export default function ForCompaniesPage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        <CompanyHero />
        <CompanyFeatures />
        <CompanyCTA />
      </main>
      <LandingFooter />
    </>
  );
}
