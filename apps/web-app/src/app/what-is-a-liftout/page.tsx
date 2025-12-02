'use client';

import Link from 'next/link';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  HeartIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  ScaleIcon,
  BriefcaseIcon,
  MegaphoneIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

// The Four Stages from HBR
const fourStages = [
  {
    number: 1,
    title: 'Courtship',
    subtitle: 'Pre-lift out',
    Icon: ChatBubbleLeftRightIcon,
    description: 'Team leader and company hold conversations to achieve clarity on market opportunity, business goals, and strategy.',
    points: [
      'Confirm the market opportunity exists',
      'Define shared business goals and strategies',
      'Examine assumptions about external relationships',
      'Team leader begins conversations with team members',
    ],
  },
  {
    number: 2,
    title: 'Leadership Integration',
    subtitle: 'Post-lift out',
    Icon: UserGroupIcon,
    description: 'Team leader works to ensure cultural fit with leadership of the hiring firm and continued access to resources.',
    points: [
      'Secure access to senior executives',
      'Ensure cultural compatibility',
      'Establish clear communication channels',
      'Build relationships with key stakeholders',
    ],
    quote: '"Access to senior executives was most often cited as the factor responsible for the success of a lifted-out team."',
  },
  {
    number: 3,
    title: 'Operational Integration',
    subtitle: 'Getting to work',
    Icon: CogIcon,
    description: 'Team leader secures vital operational resources so members can do their day-to-day work in the new environment.',
    points: [
      'Secure all necessary resources from day one',
      'Maintain continuity with clients and vendors',
      'Preserve team autonomy while integrating',
      'Set clear goals with latitude in execution',
    ],
  },
  {
    number: 4,
    title: 'Full Cultural Integration',
    subtitle: 'Earning credibility',
    Icon: HeartIcon,
    description: 'Having established credibility through operational success, the team achieves full cultural integration.',
    points: [
      'Re-earn credibility through results',
      'Build relationships with new colleagues',
      'Become culturally socialized in new firm',
      'Contribute to the broader organization',
    ],
    quote: '"You don\'t always start with huge credibility. You have to earn it."',
  },
];

// Success Stories
const successStories = [
  {
    year: '1946',
    title: 'The Whiz Kids',
    Icon: SparklesIcon,
    description: 'Air Force colonel Charles B. "Tex" Thornton brought nine other members of his elite statistical-control unit to the ailing Ford Motor Company. There, the team revolutionized, rationalized, and quantified the business much as it had done for the military.',
    outcome: 'Considered by many scholars to be the founders of modern strategic management.',
    color: 'purple',
  },
  {
    year: '1999',
    title: 'Beth Israel Liver Transplant Team',
    Icon: BeakerIcon,
    description: 'A liver transplant team moved from Beth Israel Deaconess Medical Center to the Lahey Clinic, then was called on to perform an unprecedented joint liver-kidney transplant just months later.',
    outcome: 'The surgery required a level of skill and teamwork unlikely to be found in any newly assembled group.',
    color: 'green',
  },
  {
    year: '2000',
    title: 'Lehman Brothers Editorial Team',
    Icon: ChartBarIcon,
    description: 'Steve Hash hired the entire editorial and production department from Deutsche Bank, led by Cheryl Tortoriello. The two leaders shared a clear vision to revive the best practices of the Rivkin era.',
    outcome: 'Research department rose from #8 to #1 with the largest margin of victory for any front-runner in 20 years.',
    color: 'blue',
  },
  {
    year: '1990',
    title: 'Smith Barney Restructuring Team',
    Icon: ArrowTrendingUpIcon,
    description: 'Smith Barney brought on a corporate-restructuring team of about 15 people from Drexel Burnham Lambert. The group\'s external relationships were so strong and fertile that many ventures were described as "Drexel alumni bashes."',
    outcome: 'Grew from 2 assignments in 1988 to 39 in 1991—becoming a powerhouse almost overnight.',
    color: 'amber',
  },
];

// Industries
const industries = [
  { name: 'Investment Banking', Icon: BuildingOfficeIcon },
  { name: 'Law Firms', Icon: ScaleIcon },
  { name: 'Management Consulting', Icon: BriefcaseIcon },
  { name: 'Advertising', Icon: MegaphoneIcon },
  { name: 'Medicine', Icon: BeakerIcon },
  { name: 'Technology', Icon: ComputerDesktopIcon },
];

// Benefits
const benefits = [
  {
    title: 'Skip the team-building phase',
    description: 'No need for team members to get acquainted or establish shared values, mutual accountability, or group norms.',
  },
  {
    title: 'Hit the ground running',
    description: 'Teams can make an impact much faster than could a group of people brought together for the first time.',
  },
  {
    title: 'Preserve relationships and trust',
    description: 'Long-standing relationships and trust help an experienced team succeed in their new environment.',
  },
  {
    title: 'Transfer external relationships',
    description: 'Acquire not only cohesive talent but also valuable client relationships and industry connections.',
  },
  {
    title: 'Lower risk than M&A',
    description: 'Quickly gain capacity without all the headaches of a merger or acquisition—and at a fraction of the cost.',
  },
  {
    title: 'Learning opportunities',
    description: 'Existing staff benefit from working alongside proven performers with different experiences.',
  },
];

export default function WhatIsALiftoutPage() {
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const timelineRef = useScrollAnimation({ threshold: 0.1 });
  const stagesRef = useScrollAnimation({ threshold: 0.1 });
  const benefitsRef = useScrollAnimation({ threshold: 0.1 });
  const industriesRef = useScrollAnimation({ threshold: 0.1 });
  const storiesRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        {/* Hero Section */}
        <section
          ref={heroRef.ref as React.RefObject<HTMLElement>}
          className="pt-32 pb-20 lg:pt-40 lg:pb-28"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p
                className={`text-sm font-semibold text-purple-700 uppercase tracking-wider mb-4 transition-all duration-500 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                The Research Behind Team Hiring
              </p>
              <h1
                className={`text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-6 transition-all duration-500 delay-100 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                What Is a Liftout?
              </h1>
              <p
                className={`text-xl text-text-secondary leading-relaxed mb-8 transition-all duration-500 delay-150 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                A <strong>lift out</strong> is the practice of hiring a high-functioning group of people from the same company who have worked well together and can quickly come up to speed in a new environment.
              </p>
              <blockquote
                className={`border-l-4 border-purple-700 pl-6 py-2 text-lg text-text-secondary italic transition-all duration-500 delay-200 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                &ldquo;By hiring away whole teams from a competitor, companies can quickly gain capacity without all the headaches of a merger or acquisition. It&apos;s a high-risk, high-reward move.&rdquo;
                <footer className="mt-2 text-sm text-text-tertiary not-italic">
                  — Harvard Business Review, December 2006
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section
          ref={timelineRef.ref as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28 bg-bg-elevated"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold text-text-primary mb-12 transition-all duration-500 ${
                timelineRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              A Brief History
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { year: '1946', title: 'The First Liftout', description: 'The "Whiz Kids" move from the Air Force to Ford Motor Company, considered the first high-profile team move in corporate America.' },
                { year: '2006', title: 'HBR Landmark Research', description: 'Harvard Business School professors Boris Groysberg and Robin Abrahams publish definitive research on how to execute successful lift outs.' },
                { year: 'Today', title: 'Liftout Platform', description: 'We make team hiring accessible to every company, connecting verified teams with opportunities that match their expertise.' },
              ].map((item, index) => (
                <div
                  key={item.year}
                  className={`relative transition-all duration-500 ${
                    timelineRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: timelineRef.isVisible ? `${index * 150}ms` : '0ms' }}
                >
                  <div className="text-4xl font-bold text-purple-700 mb-3">{item.year}</div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-lg text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Stages Section */}
        <section
          ref={stagesRef.ref as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2
                className={`text-3xl sm:text-4xl font-bold text-text-primary mb-4 transition-all duration-500 ${
                  stagesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                The Four Stages of a Successful Liftout
              </h2>
              <p
                className={`text-lg text-text-secondary transition-all duration-500 delay-100 ${
                  stagesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                According to HBR research, a successful lift out unfolds over four consecutive, interdependent stages that must be meticulously managed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {fourStages.map((stage, index) => (
                <article
                  key={stage.title}
                  className={`bg-bg-surface rounded-xl p-8 border border-border transition-all duration-500 ${
                    stagesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: stagesRef.isVisible ? `${150 + index * 100}ms` : '0ms' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-purple-700">{stage.number}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">{stage.title}</h3>
                      <p className="text-sm text-purple-700 font-medium">{stage.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-lg text-text-secondary mb-4">{stage.description}</p>

                  <ul className="space-y-2 mb-4">
                    {stage.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-base text-text-secondary">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {stage.quote && (
                    <blockquote className="border-l-2 border-purple-200 pl-4 text-sm text-text-tertiary italic">
                      {stage.quote}
                    </blockquote>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why Teams Outperform Section */}
        <section
          ref={benefitsRef.ref as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28 dark-section"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2
                className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-500 ${
                  benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Why Teams Outperform Individuals
              </h2>
              <p
                className={`text-lg text-white/80 transition-all duration-500 delay-100 ${
                  benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Research shows that star performers who moved in teams were more successful in their new companies than those who moved alone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`transition-all duration-500 ${
                    benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: benefitsRef.isVisible ? `${150 + index * 75}ms` : '0ms' }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-lg text-white/70 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section
          ref={industriesRef.ref as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold text-text-primary mb-4 transition-all duration-500 ${
                industriesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Industries Using Liftouts
            </h2>
            <p
              className={`text-lg text-text-secondary mb-12 max-w-2xl transition-all duration-500 delay-100 ${
                industriesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Lift outs are increasingly common in many professional-services industries where team expertise and relationships drive success.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {industries.map((industry, index) => (
                <div
                  key={industry.name}
                  className={`text-center transition-all duration-500 ${
                    industriesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: industriesRef.isVisible ? `${150 + index * 50}ms` : '0ms' }}
                >
                  <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <industry.Icon className="w-8 h-8 text-purple-700" />
                  </div>
                  <p className="font-semibold text-text-primary">{industry.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section
          ref={storiesRef.ref as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28 bg-bg-elevated"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold text-text-primary mb-4 transition-all duration-500 ${
                storiesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Documented Success Stories
            </h2>
            <p
              className={`text-lg text-text-secondary mb-12 max-w-2xl transition-all duration-500 delay-100 ${
                storiesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              From the Harvard Business Review research, these are some of the most notable lift outs in corporate history.
            </p>

            <div className="space-y-8">
              {successStories.map((story, index) => (
                <article
                  key={story.title}
                  className={`bg-bg-surface rounded-xl p-8 border border-border transition-all duration-500 ${
                    storiesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: storiesRef.isVisible ? `${150 + index * 100}ms` : '0ms' }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex items-center gap-4 lg:w-48 flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <story.Icon className="w-6 h-6 text-purple-700" />
                      </div>
                      <span className="text-2xl font-bold text-purple-700">{story.year}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-3">{story.title}</h3>
                      <p className="text-lg text-text-secondary mb-4 leading-relaxed">{story.description}</p>
                      <p className="text-base font-semibold text-purple-700 bg-purple-50 px-4 py-2 rounded-lg inline-block">
                        {story.outcome}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Ready to hire a team that works from day one?
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                Join companies who&apos;ve discovered a smarter alternative to individual hiring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="btn-primary min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-2"
                >
                  Browse verified teams
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-outline min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center"
                >
                  List your team
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Citation Footer */}
        <section className="py-12 border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-text-tertiary mb-1">Research Source</p>
                <p className="text-base text-text-secondary">
                  Groysberg, Boris and Robin Abrahams. &ldquo;Lift Outs: How to Acquire a High-Functioning Team.&rdquo;
                  <br className="hidden sm:block" />
                  <span className="italic">Harvard Business Review</span>, December 2006.
                </p>
              </div>
              <a
                href="https://hbr.org/2006/12/lift-outs-how-to-acquire-a-high-functioning-team"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 hover:text-purple-600 font-semibold underline underline-offset-4 min-h-12 inline-flex items-center gap-2"
              >
                Read the original article
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
