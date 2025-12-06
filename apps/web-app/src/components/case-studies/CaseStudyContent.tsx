'use client';

import Link from 'next/link';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export interface CaseStudy {
  slug: string;
  year: string;
  acquirer: string;
  target: string;
  headline: string;
  subheadline: string;
  dealValue: string;
  teamSize: string;
  industry: string;
  summary: string;
  background: string[];
  theMove: string[];
  keyPlayers: { name: string; role: string; context: string }[];
  whyItWorked: string[];
  challenges: string[];
  outcome: string[];
  lessonsLearned: string[];
  sources: { title: string; url: string; publication: string; date: string }[];
}

interface CaseStudyContentProps {
  caseStudy: CaseStudy;
  otherStudies: CaseStudy[];
}

export function CaseStudyContent({ caseStudy, otherStudies }: CaseStudyContentProps) {
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const detailsRef = useScrollAnimation({ threshold: 0.1 });
  const playersRef = useScrollAnimation({ threshold: 0.1 });
  const analysisRef = useScrollAnimation({ threshold: 0.1 });
  const sourcesRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        {/* Hero Section */}
        <section
          ref={heroRef.ref as React.RefObject<HTMLElement>}
          className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-bg-elevated border-b border-border"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/#liftouts"
              className={`inline-flex items-center gap-2 text-purple-700 hover:text-purple-600 font-medium mb-8 transition-all duration-500 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to examples
            </Link>

            {/* Meta info */}
            <div
              className={`flex flex-wrap items-center gap-4 mb-6 transition-all duration-500 delay-75 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-base font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                {caseStudy.year}
              </span>
              <span className="text-base text-text-secondary">
                {caseStudy.industry}
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-4 transition-all duration-500 delay-100 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {caseStudy.acquirer} ← {caseStudy.target}
            </h1>

            <h2
              className={`text-xl lg:text-2xl text-text-secondary leading-relaxed mb-8 transition-all duration-500 delay-150 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {caseStudy.headline}
            </h2>

            <p
              className={`text-lg text-text-tertiary leading-relaxed mb-8 transition-all duration-500 delay-200 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {caseStudy.subheadline}
            </p>

            {/* Key stats */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-500 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="bg-bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-purple-700" />
                  <div>
                    <p className="text-sm text-text-tertiary">Deal Value</p>
                    <p className="font-bold text-text-primary">{caseStudy.dealValue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-5 h-5 text-purple-700" />
                  <div>
                    <p className="text-sm text-text-tertiary">Team Size</p>
                    <p className="font-bold text-text-primary">{caseStudy.teamSize}</p>
                  </div>
                </div>
              </div>
              <div className="bg-bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-purple-700" />
                  <div>
                    <p className="text-sm text-text-tertiary">Industry</p>
                    <p className="font-bold text-text-primary">{caseStudy.industry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary and Background */}
        <section
          ref={detailsRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {/* Summary */}
            <div
              className={`mb-12 transition-all duration-500 ${
                detailsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-xl text-text-primary leading-relaxed">
                {caseStudy.summary}
              </p>
            </div>

            {/* Background */}
            <div
              className={`mb-12 transition-all duration-500 delay-100 ${
                detailsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h3 className="text-2xl font-bold text-text-primary mb-6">Background</h3>
              <div className="space-y-4">
                {caseStudy.background.map((paragraph, index) => (
                  <p key={index} className="text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* The Move */}
            <div
              className={`mb-12 transition-all duration-500 delay-150 ${
                detailsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h3 className="text-2xl font-bold text-text-primary mb-6">The Move</h3>
              <div className="space-y-4">
                {caseStudy.theMove.map((paragraph, index) => (
                  <p key={index} className="text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Players */}
        <section
          ref={playersRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 bg-bg-elevated"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h3
              className={`text-2xl font-bold text-text-primary mb-8 transition-all duration-500 ${
                playersRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Key Players
            </h3>
            <div className="grid gap-6">
              {caseStudy.keyPlayers.map((player, index) => (
                <div
                  key={player.name}
                  className={`bg-bg-surface rounded-xl p-6 border border-border transition-all duration-500 ${
                    playersRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: playersRef.isVisible ? `${100 + index * 75}ms` : '0ms' }}
                >
                  <h4 className="text-lg font-bold text-text-primary mb-1">{player.name}</h4>
                  <p className="text-purple-700 font-medium mb-3">{player.role}</p>
                  <p className="text-text-secondary">{player.context}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysis */}
        <section
          ref={analysisRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid gap-12">
              {/* Why It Worked */}
              <div
                className={`transition-all duration-500 ${
                  analysisRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">Why It Worked</h3>
                </div>
                <ul className="space-y-3">
                  {caseStudy.whyItWorked.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-text-secondary">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div
                className={`transition-all duration-500 delay-100 ${
                  analysisRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">Challenges</h3>
                </div>
                <ul className="space-y-3">
                  {caseStudy.challenges.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-amber-600 mt-1">•</span>
                      <span className="text-text-secondary">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcome */}
              <div
                className={`transition-all duration-500 delay-150 ${
                  analysisRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ArrowRightIcon className="w-5 h-5 text-purple-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">Outcome</h3>
                </div>
                <ul className="space-y-3">
                  {caseStudy.outcome.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-purple-600 mt-1">•</span>
                      <span className="text-text-secondary">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lessons Learned */}
              <div
                className={`bg-purple-50 rounded-xl p-8 border border-purple-200 transition-all duration-500 delay-200 ${
                  analysisRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                    <LightBulbIcon className="w-5 h-5 text-purple-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">Lessons for Other Liftouts</h3>
                </div>
                <ul className="space-y-3">
                  {caseStudy.lessonsLearned.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-purple-700 mt-1 font-bold">{index + 1}.</span>
                      <span className="text-text-primary font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section
          ref={sourcesRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 bg-bg-elevated"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">Sources</h3>
            </div>
            <div className="space-y-4">
              {caseStudy.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-bg-surface rounded-xl p-5 border border-border hover:border-purple-200 hover:shadow-md transition-all duration-300 ${
                    sourcesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: sourcesRef.isVisible ? `${index * 50}ms` : '0ms' }}
                >
                  <p className="font-medium text-text-primary mb-1 hover:text-purple-700">
                    {source.title}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-text-tertiary">
                    <span>{source.publication}</span>
                    <span>•</span>
                    <span>{source.date}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Other Case Studies */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-text-primary mb-8">More Case Studies</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherStudies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="bg-bg-surface rounded-xl p-6 border border-border hover:border-purple-200 hover:shadow-md transition-all group"
                >
                  <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-full">
                    {study.year}
                  </span>
                  <h4 className="text-lg font-bold text-text-primary mt-3 mb-2 group-hover:text-purple-700 transition-colors">
                    {study.acquirer} ← {study.target}
                  </h4>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {study.headline}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-bg-elevated border-t border-border">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Ready to explore your own liftout?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Whether you&apos;re a team considering a move or a company looking to acquire proven talent, we can help.
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
                href="/what-is-a-liftout"
                className="btn-outline min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center"
              >
                Learn more about liftouts
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
