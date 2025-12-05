import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { TeamHero } from '@/components/landing/TeamHero';
import { TeamProblem } from '@/components/landing/TeamProblem';
import { TeamFlip } from '@/components/landing/TeamFlip';
import { HowItWorksTeams } from '@/components/landing/HowItWorksTeams';
import { TeamsProductPreview } from '@/components/landing/TeamsProductPreview';
import { TeamElephant } from '@/components/landing/TeamElephant';
import { TeamLegalReality } from '@/components/landing/TeamLegalReality';
import { TeamFeatures } from '@/components/landing/TeamFeatures';
import { FAQTeams } from '@/components/landing/FAQTeams';
import { TeamCTA } from '@/components/landing/TeamCTA';

export const metadata = {
  title: 'For Teams - Find Your Next Opportunity Together | Liftout',
  description: 'You love your team but you\'ve outgrown the company. Don\'t leave them behind. Find opportunities that want all of you.',
};

// JSON-LD for Teams Service Page
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Team Career Services',
  description: 'The first platform for teams to move together. Create a team profile, stay confidential, and find companies looking for proven chemistry.',
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

        {/* 5. Preview - See the actual product */}
        <TeamsProductPreview />

        {/* 6. Elephant in the room - Address objection */}
        <TeamElephant />

        {/* 7. Legal reality - Non-competes dying */}
        <TeamLegalReality />

        {/* 8. Features - Light touch, 4 bullets */}
        <TeamFeatures />

        {/* 9. FAQ - Simplified, 3-4 questions */}
        <FAQTeams />

        {/* 10. CTA - Emotional close */}
        <TeamCTA />
      </main>
      <LandingFooter />
    </>
  );
}
