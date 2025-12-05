import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CompanyHero } from '@/components/landing/CompanyHero';
import { CompanyProblem } from '@/components/landing/CompanyProblem';
import { HowItWorksCompanies } from '@/components/landing/HowItWorksCompanies';
import { CompanyFeatures } from '@/components/landing/CompanyFeatures';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { FAQCompanies } from '@/components/landing/FAQCompanies';
import { CompanyCTA } from '@/components/landing/CompanyCTA';

export const metadata = {
  title: 'For Companies - Hire Teams That Already Work | Liftout',
  description: 'Stop hoping new hires will gel. Acquire intact teams with proven chemistry, verified track records, and day-one productivity.',
};

// JSON-LD for Company Services Page
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Team Acquisition Services',
  description: 'Acquire intact, high-performing teams that hit the ground running. Zero team-building phase, verified track records.',
  provider: {
    '@type': 'Organization',
    name: 'Liftout',
    url: 'https://liftout.com',
  },
  serviceType: 'Recruitment Platform',
  audience: {
    '@type': 'Audience',
    audienceType: 'Companies seeking to acquire proven teams',
  },
};

export default function ForCompaniesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <LandingHeader />
      <main id="main-content" tabIndex={-1} className="bg-bg outline-none">
        {/* 1. Hero - Hook */}
        <CompanyHero />

        {/* 2. Problem - Agitation with stats */}
        <CompanyProblem />

        {/* 3. How it works - The plan */}
        <HowItWorksCompanies />
        <CompanyFeatures />
        <TrustIndicators />
        <FAQCompanies />
        <CompanyCTA />
      </main>
      <LandingFooter />
    </>
  );
}
