import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { TeamHero } from '@/components/landing/TeamHero';
import { HowItWorksTeams } from '@/components/landing/HowItWorksTeams';
import { TeamFeatures } from '@/components/landing/TeamFeatures';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { FAQ } from '@/components/landing/FAQ';
import { TeamCTA } from '@/components/landing/TeamCTA';

export const metadata = {
  title: 'For Teams - Move Together as a Unit | Liftout',
  description: 'Ready for a new challenge together? Move as a unit, keep what works, and access companies actively seeking proven teams like yours.',
};

export default function ForTeamsPage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        <TeamHero />
        <HowItWorksTeams />
        <TeamFeatures />
        <TrustIndicators />
        <FAQ />
        <TeamCTA />
      </main>
      <LandingFooter />
    </>
  );
}
