import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorksTabs } from '@/components/landing/HowItWorksTabs';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { HBRInsight } from '@/components/landing/HBRInsight';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQTabs } from '@/components/landing/FAQTabs';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';

// JSON-LD Structured Data for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Liftout',
  description: 'Team hiring marketplace connecting companies with intact, high-performing teams',
  url: 'https://liftout.com',
  logo: 'https://liftout.com/logo-256.png',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://liftout.com/contact',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Liftout',
  description: 'Hire entire teams, not just individuals. Connect with verified, intact teams who already work well together.',
  url: 'https://liftout.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://liftout.com/app/teams?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Team Hiring Marketplace',
  description: 'Connect companies seeking high-performing teams with intact teams ready for new opportunities. Skip the 6-month team-building phase.',
  provider: {
    '@type': 'Organization',
    name: 'Liftout',
  },
  serviceType: 'Recruitment Platform',
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <LandingHeader />
      <main id="main-content" tabIndex={-1} className="bg-bg outline-none">
        <LandingHero />
        <HowItWorksTabs />
        <LandingFeatures />
        <TrustIndicators />
        <HBRInsight />
        <Testimonials />
        <FAQTabs />
        <LandingCTA />
      </main>
      <LandingFooter />
    </>
  );
}
