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
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

// Modern 2024 examples
const modernExamples = [
  {
    year: '2024',
    company: 'Microsoft',
    target: 'Inflection AI',
    deal: '$650M',
    description: 'Paid to "license" tech and hire the entire AI team including CEO Mustafa Suleyman',
    outcome: 'Suleyman became EVP & CEO of Microsoft AI. Instant world-class AI leadership.',
    source: 'https://wise.com/gb/blog/acqui-hires',
  },
  {
    year: '2024',
    company: 'Google',
    target: 'Character.AI',
    deal: '$2.7B',
    description: 'Brought back founders Noam Shazeer and Daniel De Freitas—who originally created transformer architecture at Google',
    outcome: 'Regained the inventors of the technology powering modern AI.',
    source: 'https://ff.co/ai-acquihires/',
  },
  {
    year: '2024',
    company: 'Polsinelli',
    target: 'Holland & Knight',
    deal: '47 lawyers',
    description: 'Largest law firm group move of 2024—30 partners moved as a cohesive unit',
    outcome: 'Instant market presence and client relationships.',
    source: 'https://news.bloomberglaw.com/business-and-practice/standout-big-law-moves-in-2024-amid-robust-lateral-hiring',
  },
  {
    year: '2024',
    company: 'Paul Hastings',
    target: 'Vinson & Elkins',
    deal: '25 lawyers',
    description: '8 partners and their full finance team in Dallas/Houston—largest practice group move in Texas history',
    outcome: 'Became a Texas powerhouse overnight.',
    source: 'https://www.legal.io/articles/5508483/Group-Lateral-Hires-The-Goldilocks-Solution-for-Law-Firm-Growth',
  },
];

// Research-backed stats
const dataPoints = [
  {
    stat: '12 months',
    label: 'Time for new hires to reach peak performance',
    source: 'Gallup',
    insight: 'Teams that move together skip this entirely.',
  },
  {
    stat: '64%',
    label: 'Longer focus time for collaborative workers',
    source: 'Stanford',
    insight: 'Pre-existing trust enables deeper work.',
  },
  {
    stat: '43%',
    label: 'Of team performance tied to psychological safety',
    source: 'Google Project Aristotle',
    insight: 'Built over years, preserved in a liftout.',
  },
  {
    stat: '$240K',
    label: 'Average cost of a bad hire',
    source: 'SHRM',
    insight: 'Teams have a proven track record.',
  },
];

// Why individuals fail
const individualHiringProblems = [
  {
    stat: '75%',
    label: 'of employers admit to hiring the wrong person',
    source: 'SHRM',
  },
  {
    stat: '46%',
    label: 'of new hires fail within 18 months',
    source: 'Leadership IQ',
  },
  {
    stat: '89%',
    label: 'of hiring failures are due to poor culture fit, not skills',
    source: 'LinkedIn',
  },
  {
    stat: '60%',
    label: 'of new ventures fail because of team issues',
    source: 'Harvard Business Review',
  },
];

// Tuckman's stages - why teams skip this
const tuckmanStages = [
  { name: 'Forming', description: 'Getting acquainted, uncertain', status: 'skip' },
  { name: 'Storming', description: 'Conflict, competition, decreased productivity', status: 'skip' },
  { name: 'Norming', description: 'Establishing shared values and trust', status: 'skip' },
  { name: 'Performing', description: 'True interdependence, high productivity', status: 'start' },
];

// The Four Stages from HBR
const fourStages = [
  {
    number: 1,
    title: 'Courtship',
    subtitle: 'Before the move',
    Icon: ChatBubbleLeftRightIcon,
    description: 'Team leader and company align on opportunity, goals, and strategy. The team leader begins confidential conversations with team members.',
    keyInsight: 'Most liftouts fail here—from misaligned expectations, not integration issues.',
  },
  {
    number: 2,
    title: 'Leadership Integration',
    subtitle: 'First weeks',
    Icon: UserGroupIcon,
    description: 'Team leader builds relationships with new company leadership and secures access to decision-makers.',
    keyInsight: 'Access to senior executives is the #1 factor cited for liftout success.',
  },
  {
    number: 3,
    title: 'Operational Integration',
    subtitle: 'First months',
    Icon: CogIcon,
    description: 'Team secures resources, maintains client relationships, and establishes autonomy within the new environment.',
    keyInsight: 'Give clear goals but latitude in execution—don\'t micromanage what already works.',
  },
  {
    number: 4,
    title: 'Cultural Integration',
    subtitle: 'Ongoing',
    Icon: HeartIcon,
    description: 'Through demonstrated results, the team earns credibility and becomes part of the broader organization.',
    keyInsight: 'Credibility isn\'t transferred—it\'s re-earned through performance.',
  },
];

// Industries with examples
const industries = [
  {
    name: 'Technology & AI',
    Icon: ComputerDesktopIcon,
    example: 'Microsoft paid $650M for Inflection AI\'s team',
    trend: 'AI talent wars driving $1-2M per engineer valuations',
  },
  {
    name: 'Law Firms',
    Icon: ScaleIcon,
    example: 'Top 50 firms hired 900+ partners laterally in 2024',
    trend: 'Group moves up 13.9% year-over-year',
  },
  {
    name: 'Investment Banking',
    Icon: BuildingOfficeIcon,
    example: 'Lehman\'s lifted team went from #8 to #1 in rankings',
    trend: 'Teams bring portable client relationships',
  },
  {
    name: 'Management Consulting',
    Icon: BriefcaseIcon,
    example: 'Practice groups move with methodologies intact',
    trend: 'Industry expertise travels with the team',
  },
  {
    name: 'Healthcare',
    Icon: BeakerIcon,
    example: 'Surgical teams move to perform complex procedures',
    trend: 'Trust is life-or-death—literally',
  },
  {
    name: 'Private Equity',
    Icon: ChartBarIcon,
    example: 'Deal teams move with sector knowledge and networks',
    trend: 'Relationships are the entire business',
  },
];

// Benefits reframed with data
const benefits = [
  {
    title: 'Skip 12 months of ramp-up',
    Icon: ClockIcon,
    description: 'New hires take a year to reach peak performance. Teams that move together are productive from day one.',
    data: 'Gallup research',
  },
  {
    title: 'Preserve psychological safety',
    Icon: ShieldCheckIcon,
    description: 'Google\'s Project Aristotle found this is the #1 factor in team performance. It takes years to build—seconds to lose.',
    data: '43% of performance variance',
  },
  {
    title: 'Avoid $240K bad hire costs',
    Icon: CurrencyDollarIcon,
    description: '75% of employers admit to hiring the wrong person. Teams have a track record you can verify.',
    data: 'SHRM research',
  },
  {
    title: 'Transfer client relationships',
    Icon: UserGroupIcon,
    description: 'In professional services, relationships are the business. Teams bring their networks with them.',
    data: 'Why law firm laterals work',
  },
  {
    title: 'Skip forming-storming-norming',
    Icon: RocketLaunchIcon,
    description: 'New teams spend months in conflict before becoming productive. Liftout teams start in the performing stage.',
    data: 'Tuckman\'s model',
  },
  {
    title: '5x more likely to be high-performing',
    Icon: LightBulbIcon,
    description: 'Companies promoting collaboration are five times more likely to be considered high-performing.',
    data: 'i4cp research',
  },
];

export default function WhatIsALiftoutPage() {
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const problemRef = useScrollAnimation({ threshold: 0.1 });
  const dataRef = useScrollAnimation({ threshold: 0.1 });
  const examplesRef = useScrollAnimation({ threshold: 0.1 });
  const tuckmanRef = useScrollAnimation({ threshold: 0.1 });
  const benefitsRef = useScrollAnimation({ threshold: 0.1 });
  const stagesRef = useScrollAnimation({ threshold: 0.1 });
  const industriesRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        {/* Hero Section */}
        <section
          ref={heroRef.ref as React.RefObject<HTMLElement>}
          className="pt-32 pb-16 lg:pt-40 lg:pb-24"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p
                className={`text-sm font-semibold text-purple-700 uppercase tracking-wider mb-4 transition-all duration-500 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                The definitive guide
              </p>
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6 transition-all duration-500 delay-75 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                What Is a Liftout?
              </h1>
              <p
                className={`text-xl lg:text-2xl text-text-secondary leading-relaxed mb-8 transition-all duration-500 delay-100 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                A <strong className="text-text-primary">liftout</strong> is hiring an entire high-performing team from another company—not just individuals who used to work together, but the whole team with their trust, chemistry, and track record intact.
              </p>
              <p
                className={`text-lg text-text-secondary leading-relaxed mb-8 transition-all duration-500 delay-150 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                In 2024, Microsoft paid $650M for Inflection AI&apos;s team. Google paid $2.7B for Character.AI&apos;s founders. Polsinelli hired 47 lawyers from Holland &amp; Knight in a single move. These aren&apos;t acquisitions—they&apos;re liftouts.
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-200 ${
                  heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Link
                  href="/for-companies"
                  className="btn-primary min-h-12 px-6 py-3 text-lg inline-flex items-center justify-center gap-2"
                >
                  I&apos;m hiring teams
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/for-teams"
                  className="btn-outline min-h-12 px-6 py-3 text-lg inline-flex items-center justify-center"
                >
                  My team is ready to move
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Lonely Desert - Why job searching feels isolating */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-bg border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
                Job searching alone is a lonely desert
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                You&apos;ve felt it. Updating your resume in secret. Interviewing while pretending everything&apos;s fine. Not being able to talk to anyone about the biggest decision in your professional life. The uncertainty. The isolation. The fear of the unknown.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">Going alone</h3>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">×</span>
                      <span>Navigating interviews in isolation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">×</span>
                      <span>Unknown team dynamics at new company</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">×</span>
                      <span>Starting from scratch building trust</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">×</span>
                      <span>No one to confide in during the process</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 text-left">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <UserGroupIcon className="w-5 h-5 text-purple-700" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">Moving together</h3>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>A known in an unknown process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>People you trust from day one</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Strength in numbers when negotiating</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Friends who understand exactly what you&apos;re going through</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-10 text-lg text-purple-700 font-medium">
                There&apos;s a better way. Take that journey with the people who&apos;ve helped you succeed.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem with Individual Hiring */}
        <section
          ref={problemRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 bg-red-50 border-y border-red-100"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2
                  className={`text-2xl sm:text-3xl font-bold text-text-primary mb-2 transition-all duration-500 ${
                    problemRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  The problem with hiring individuals
                </h2>
                <p
                  className={`text-lg text-text-secondary transition-all duration-500 delay-100 ${
                    problemRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  When you hire individuals, you&apos;re gambling they&apos;ll work well together. The data says that&apos;s a bad bet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {individualHiringProblems.map((problem, index) => (
                <div
                  key={problem.label}
                  className={`bg-white rounded-xl p-6 border border-red-100 transition-all duration-500 ${
                    problemRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: problemRef.isVisible ? `${150 + index * 75}ms` : '0ms' }}
                >
                  <p className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">{problem.stat}</p>
                  <p className="text-sm text-text-secondary mb-2">{problem.label}</p>
                  <p className="text-xs text-text-tertiary">{problem.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Points - Why Teams Win */}
        <section
          ref={dataRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold text-text-primary mb-4 transition-all duration-500 ${
                dataRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Why teams outperform individuals
            </h2>
            <p
              className={`text-lg text-text-secondary mb-12 max-w-2xl transition-all duration-500 delay-100 ${
                dataRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              It&apos;s not opinion—it&apos;s research. Here&apos;s what the data says.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataPoints.map((point, index) => (
                <div
                  key={point.label}
                  className={`bg-bg-surface rounded-xl p-6 border border-border transition-all duration-500 ${
                    dataRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: dataRef.isVisible ? `${150 + index * 75}ms` : '0ms' }}
                >
                  <p className="text-3xl sm:text-4xl font-bold text-purple-700 mb-2">{point.stat}</p>
                  <p className="text-sm font-medium text-text-primary mb-1">{point.label}</p>
                  <p className="text-xs text-text-tertiary mb-3">{point.source}</p>
                  <p className="text-sm text-purple-700 font-medium">{point.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modern Examples - 2024 */}
        <section
          ref={examplesRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 bg-bg-elevated"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
              <div>
                <p
                  className={`text-sm font-semibold text-purple-700 uppercase tracking-wider mb-2 transition-all duration-500 ${
                    examplesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  2024 Examples
                </p>
                <h2
                  className={`text-2xl sm:text-3xl font-bold text-text-primary transition-all duration-500 delay-75 ${
                    examplesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Liftouts happening right now
                </h2>
              </div>
              <p
                className={`text-text-secondary max-w-md transition-all duration-500 delay-100 ${
                  examplesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Not ancient history—these deals happened this year.
              </p>
            </div>

            <div className="space-y-6">
              {modernExamples.map((example, index) => (
                <article
                  key={example.company + example.target}
                  className={`bg-bg-surface rounded-xl p-6 lg:p-8 border border-border transition-all duration-500 ${
                    examplesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: examplesRef.isVisible ? `${150 + index * 100}ms` : '0ms' }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                    <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                      <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                        {example.year}
                      </span>
                      <span className="text-2xl font-bold text-text-primary">{example.deal}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {example.company} <span className="text-text-tertiary font-normal">←</span> {example.target}
                      </h3>
                      <p className="text-text-secondary mb-2">{example.description}</p>
                      <p className="text-sm font-medium text-green-700">{example.outcome}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Tuckman's Stages - Skip the Drama */}
        <section
          ref={tuckmanRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2
                className={`text-2xl sm:text-3xl font-bold text-text-primary mb-4 transition-all duration-500 ${
                  tuckmanRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Skip forming, storming, and norming
              </h2>
              <p
                className={`text-lg text-text-secondary transition-all duration-500 delay-100 ${
                  tuckmanRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Psychologist Bruce Tuckman identified four stages every team goes through. New teams spend months in conflict before becoming productive. Liftout teams skip straight to performing.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {tuckmanStages.map((stage, index) => (
                <div
                  key={stage.name}
                  className={`relative rounded-xl p-6 border-2 transition-all duration-500 ${
                    stage.status === 'skip'
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-green-50 border-green-300'
                  } ${
                    tuckmanRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: tuckmanRef.isVisible ? `${150 + index * 75}ms` : '0ms',
                    opacity: tuckmanRef.isVisible ? (stage.status === 'skip' ? 0.6 : 1) : 0
                  }}
                >
                  {stage.status === 'skip' && (
                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SKIP
                    </div>
                  )}
                  {stage.status === 'start' && (
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      START HERE
                    </div>
                  )}
                  <h3 className={`text-lg font-bold mb-1 ${stage.status === 'skip' ? 'text-gray-500 line-through' : 'text-green-700'}`}>
                    {stage.name}
                  </h3>
                  <p className={`text-sm ${stage.status === 'skip' ? 'text-gray-400' : 'text-green-600'}`}>
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>

            <p
              className={`mt-8 text-sm text-text-tertiary text-center transition-all duration-500 delay-500 ${
                tuckmanRef.isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Source: Tuckman, B.W. (1965). &quot;Developmental Sequence in Small Groups&quot;
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section
          ref={benefitsRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 dark-section"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold text-white mb-4 transition-all duration-500 ${
                benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              The liftout advantage
            </h2>
            <p
              className={`text-lg text-white/80 mb-12 max-w-2xl transition-all duration-500 delay-100 ${
                benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Every benefit is backed by research—not marketing speak.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 transition-all duration-500 ${
                    benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: benefitsRef.isVisible ? `${150 + index * 75}ms` : '0ms' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <benefit.Icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{benefit.description}</p>
                  <p className="text-xs text-purple-300 font-medium">{benefit.data}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Stages - HBR Framework */}
        <section
          ref={stagesRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <p
                className={`text-sm font-semibold text-purple-700 uppercase tracking-wider mb-2 transition-all duration-500 ${
                  stagesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                The Framework
              </p>
              <h2
                className={`text-2xl sm:text-3xl font-bold text-text-primary mb-4 transition-all duration-500 delay-75 ${
                  stagesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                The four stages of a successful liftout
              </h2>
              <p
                className={`text-lg text-text-secondary transition-all duration-500 delay-100 ${
                  stagesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Harvard Business Review research identified four stages that determine whether a liftout succeeds or fails.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fourStages.map((stage, index) => (
                <article
                  key={stage.title}
                  className={`bg-bg-surface rounded-xl p-6 lg:p-8 border border-border transition-all duration-500 ${
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

                  <p className="text-text-secondary mb-4">{stage.description}</p>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm font-medium text-purple-800">
                      <span className="font-bold">Key insight:</span> {stage.keyInsight}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <p
              className={`mt-8 text-sm text-text-tertiary text-center transition-all duration-500 delay-500 ${
                stagesRef.isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Source: Groysberg, B. &amp; Abrahams, R. &quot;Lift Outs: How to Acquire a High-Functioning Team.&quot; Harvard Business Review, December 2006.
            </p>
          </div>
        </section>

        {/* Industries */}
        <section
          ref={industriesRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 bg-bg-elevated"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold text-text-primary mb-4 transition-all duration-500 ${
                industriesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Industries where liftouts thrive
            </h2>
            <p
              className={`text-lg text-text-secondary mb-12 max-w-2xl transition-all duration-500 delay-100 ${
                industriesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Anywhere relationships and team expertise drive value, liftouts happen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <div
                  key={industry.name}
                  className={`bg-bg-surface rounded-xl p-6 border border-border transition-all duration-500 ${
                    industriesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: industriesRef.isVisible ? `${150 + index * 75}ms` : '0ms' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                    <industry.Icon className="w-6 h-6 text-purple-700" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{industry.name}</h3>
                  <p className="text-sm text-text-secondary mb-3">{industry.example}</p>
                  <p className="text-xs text-purple-700 font-medium">{industry.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-purple-700 uppercase tracking-wider mb-4">
                The platform for team-based hiring
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Until now, liftouts happened through backchannels
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                We built the first platform where teams can signal they&apos;re open to opportunities—confidentially—and companies can find proven teams instead of gambling on individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="btn-primary min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-2"
                >
                  Get started free
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/for-companies"
                  className="btn-outline min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sources Footer */}
        <section className="py-12 border-t border-border bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Sources &amp; Further Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary">Academic Research</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <a href="https://hbr.org/2006/12/lift-outs-how-to-acquire-a-high-functioning-team" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 underline underline-offset-2">
                      HBR: Lift Outs (2006)
                    </a>
                  </li>
                  <li>
                    <a href="https://rework.withgoogle.com/guides/understanding-team-effectiveness" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 underline underline-offset-2">
                      Google: Project Aristotle
                    </a>
                  </li>
                  <li>Tuckman, B.W. (1965). Developmental Sequence in Small Groups</li>
                  <li>Gallup: State of the American Workplace</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary">2024 Market Data</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <a href="https://news.bloomberglaw.com/business-and-practice/standout-big-law-moves-in-2024-amid-robust-lateral-hiring" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 underline underline-offset-2">
                      Bloomberg Law: 2024 Lateral Moves
                    </a>
                  </li>
                  <li>
                    <a href="https://ff.co/ai-acquihires/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 underline underline-offset-2">
                      Founders Forum: AI Acquihires
                    </a>
                  </li>
                  <li>
                    <a href="https://wise.com/gb/blog/acqui-hires" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 underline underline-offset-2">
                      Wise: Acqui-hires Explained
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary">Hiring &amp; Onboarding</p>
                <ul className="mt-2 space-y-1">
                  <li>SHRM: Cost of a Bad Hire</li>
                  <li>Leadership IQ: New Hire Failure Rates</li>
                  <li>LinkedIn: Culture Fit Research</li>
                  <li>i4cp: High-Performing Organizations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
