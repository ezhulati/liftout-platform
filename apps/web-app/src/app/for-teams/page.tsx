import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { TeamHero } from '@/components/landing/TeamHero';
import { HowItWorksTeams } from '@/components/landing/HowItWorksTeams';
import { TeamFeatures } from '@/components/landing/TeamFeatures';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { FAQTeams } from '@/components/landing/FAQTeams';
import { TeamCTA } from '@/components/landing/TeamCTA';

export const metadata = {
  title: 'For Teams - Move Together as a Unit | Liftout',
  description: 'Ready for a new challenge together? Move as a unit, keep what works, and access companies actively seeking proven teams like yours.',
};

// JSON-LD for Teams Service Page
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Team Placement Services',
  description: 'Help intact teams find new opportunities together. Preserve team chemistry while accessing better resources and challenges.',
  provider: {
    '@type': 'Organization',
    name: 'Liftout',
    url: 'https://liftout.com',
  },
  serviceType: 'Career Services',
  audience: {
    '@type': 'Audience',
    audienceType: 'High-performing teams seeking new opportunities',
  },
};

export default function ForTeamsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <LandingHeader />
      <main id="main-content" tabIndex={-1} className="bg-bg outline-none">
        <TeamHero />
        <HowItWorksTeams />
        <TeamFeatures />
        <TrustIndicators />
        <FAQTeams />
        <TeamCTA />
      </main>
      <LandingFooter />
    </>
  );
}
