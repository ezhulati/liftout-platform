import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { TeamHero } from '@/components/landing/TeamHero';
import { TeamProblem } from '@/components/landing/TeamProblem';
import { TeamFlip } from '@/components/landing/TeamFlip';
import { HowItWorksTeams } from '@/components/landing/HowItWorksTeams';
import { TeamElephant } from '@/components/landing/TeamElephant';
import { TeamLegalReality } from '@/components/landing/TeamLegalReality';
import { TeamFeatures } from '@/components/landing/TeamFeatures';
import { FAQTeams } from '@/components/landing/FAQTeams';
import { TeamCTA } from '@/components/landing/TeamCTA';

export const metadata = {
  title: 'For Teams - Find Your Next Opportunity Together | Liftout',
  description: 'The job market is a lonely desert between two places that preach teamwork. Why cross it alone? Find your next opportunity with the people who helped you succeed.',
};

// JSON-LD for Teams Service Page
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Team Career Services',
  description: 'The first platform for teams to find new opportunities together. Post a team profile, stay confidential, and let companies find you.',
  provider: {
    '@type': 'Organization',
    name: 'Liftout',
    url: 'https://liftout.com',
  },
  serviceType: 'Career Services',
  audience: {
    '@type': 'Audience',
    audienceType: 'High-performing teams seeking new opportunities together',
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
        {/* 1. Hero - Emotional hook */}
        <TeamHero />

        {/* 2. Problem - Agitation */}
        <TeamProblem />

        {/* 3. The Flip - "What if" moment */}
        <TeamFlip />

        {/* 4. How it works - Simple 4 steps */}
        <HowItWorksTeams />

        {/* 5. Elephant in the room - Address objection */}
        <TeamElephant />

        {/* 6. Legal reality - Non-competes dying */}
        <TeamLegalReality />

        {/* 7. Features - Light touch, 4 bullets */}
        <TeamFeatures />

        {/* 8. FAQ - Simplified, 3-4 questions */}
        <FAQTeams />

        {/* 9. CTA - Emotional close */}
        <TeamCTA />
      </main>
      <LandingFooter />
    </>
  );
}
