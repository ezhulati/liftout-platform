import { LandingHero } from '@/components/landing/LandingHero';
import { LandingExplainer } from '@/components/landing/LandingExplainer';
import { HBRInsight } from '@/components/landing/HBRInsight';
import { HowItWorksTabs } from '@/components/landing/HowItWorksTabs';
import { ProductPreview } from '@/components/landing/ProductPreview';
import { LandingFlip } from '@/components/landing/LandingFlip';
import { LandingElephant } from '@/components/landing/LandingElephant';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingQuote } from '@/components/landing/LandingQuote';
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

/**
 * Homepage with Unified Story Flow
 *
 * The narrative arc:
 * 1. Hero - Emotional hook + solution
 * 2. Problem - The lonely desert (why this matters)
 * 3. Explainer - What is a liftout? (definition + 2024 examples)
 * 4. Authority - HBR research + historical success stories
 * 5. How It Works - Simple 3-step process
 * 6. Flip - Solo resume vs Team profile (transformation)
 * 7. Elephant - Address the #1 objection directly
 * 8. Features - Benefits framed as outcomes
 * 9. Quote - Gallup research on team relationships
 * 10. FAQ - Practical questions (objections moved up)
 * 11. CTA - Final invitation with transformation vision
 */
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
        {/* 1. HOOK: Emotional headline + solution */}
        <LandingHero />

        {/* 2. DEFINITION: What is a liftout? + 2024 examples */}
        <LandingExplainer />

        {/* 4. AUTHORITY: HBR research + historical success stories */}
        <HBRInsight />

        {/* 5. PLAN: How it works - simple 3 steps */}
        <HowItWorksTabs />

        {/* 6. PREVIEW: See the actual product */}
        <ProductPreview />

        {/* 7. TRANSFORMATION: Solo resume vs Team profile */}
        <LandingFlip />

        {/* 8. OBJECTION: Address "won't they leave together?" */}
        <LandingElephant />

        {/* 9. BENEFITS: Features framed as outcomes */}
        <LandingFeatures />

        {/* 10. PROOF: Gallup research on team relationships */}
        <LandingQuote />

        {/* 11. FAQ: Practical questions */}
        <FAQTabs />

        {/* 12. CTA: Final invitation */}
        <LandingCTA />
      </main>
      <LandingFooter />
    </>
  );
}
