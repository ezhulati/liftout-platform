'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// FAQs specifically for teams - ordered by what matters most to them
// Enhanced with research-backed data points
const faqs = [
  {
    question: 'Is my exploration completely confidential?',
    answer: 'Yes—confidentiality is core to our platform. Your current employer is automatically blocked and will never see your profile. You control exactly which companies can view you, and all conversations are NDA-protected from the first interaction.',
  },
  {
    question: 'Is Liftout free for teams?',
    answer: 'Completely free. No sign-up fee, no charges to create a profile, no cost to connect with companies. You pay nothing—ever. The only investment is your talent and time.',
  },
  {
    question: 'Why would a company want to hire our entire team?',
    answer: 'The research is compelling: Google\'s Project Aristotle found that psychological safety accounts for 43% of team performance—and it takes years to build. New hires take 12 months to reach peak performance (Gallup). When companies hire your intact team, they get immediate productivity, skip the team-formation phase, and avoid the $240K average cost of bad hires (SHRM). Your chemistry is genuinely valuable.',
  },
  {
    question: 'How is this different from traditional job sites?',
    answer: 'Traditional job sites focus on individuals posting resumes and competing for the same roles. Liftout flips this: entire teams showcase their collective strengths and let opportunities come to them. Companies here are specifically seeking proven teams that can hit the ground running—not just individuals who might work well together.',
  },
  {
    question: 'Who is Liftout for?',
    answer: 'Teams who\'ve built rare chemistry together but feel constrained in their current roles. This includes AI/ML engineering squads, partners at law firms, consulting units, research teams, creative groups, and any team that performs better together than apart. In 2024, Paul Hastings hired an 8-partner, 25-lawyer finance team from Vinson & Elkins—the largest practice group move in Texas history. If your team has that kind of cohesion, Liftout is for you.',
  },
  {
    question: 'How do I get started?',
    answer: 'Three simple steps: (1) Create your team profile highlighting your collective skills, experience, and what makes you work well together. (2) Companies searching for teams like yours will discover your profile. (3) When a company sees potential, they\'ll reach out to start a confidential conversation.',
  },
  {
    question: 'Are companies actually looking for teams?',
    answer: 'Yes—and at massive scale. In 2024: Microsoft paid $650M to hire Inflection AI\'s team. Google paid $2.7B for Character.AI\'s founders. Top 50 law firms hired 900+ partners laterally. Polsinelli hired 47 lawyers from Holland & Knight in a single move. Liftouts happen across tech, law, finance, consulting, and healthcare wherever team expertise and relationships drive value.',
  },
  {
    question: 'What opportunities can I expect?',
    answer: 'Companies post strategic opportunities where team chemistry matters: AI/ML buildouts, market expansion, new practice areas, capability building, and transformation initiatives. Rather than the traditional apply-and-hope approach, your team profile puts you in front of companies specifically seeking what you offer.',
  },
  {
    question: 'How are teams verified?',
    answer: 'To protect companies and maintain platform quality, we verify team composition, tenure working together, and documented achievements. This verification process actually helps your team stand out—89% of hiring failures are due to poor culture fit (LinkedIn), and team chemistry is something we can actually verify.',
  },
];

export function FAQTeams() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="faq"
      className="py-24 lg:py-32 bg-bg scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left column - Header and support options */}
          <div className="lg:col-span-1">
            <div className={`lg:sticky lg:top-32 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="font-semibold text-base mb-3 text-[#4C1D95]">
                Questions from teams
              </p>
              <h2
                id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
              >
                Everything you need to know
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Common questions from teams exploring opportunities together. Can't find your answer? We're here to help.
              </p>

              {/* Support option */}
              <Link
                href="/contact"
                className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-border-hover hover:shadow-sm transition-all group min-h-12"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-[#4C1D95] transition-colors" style={{ backgroundColor: 'hsl(270, 70%, 35%, 0.1)' }}>
                  <EnvelopeIcon className="w-6 h-6 text-[#4C1D95] group-hover:text-on-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-base">Contact us</p>
                  <p className="text-text-secondary text-base">We respond within 24 hours</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right column - FAQ accordion */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-bg-surface border border-border rounded-xl overflow-hidden transition-all duration-500 hover:border-purple-900/20 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: isVisible ? `${(index + 1) * 75}ms` : '0ms' }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-elevated/50 transition-colors duration-200"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-semibold text-text-primary pr-4 text-lg">
                      {faq.question}
                    </span>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-text-secondary text-lg leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional help text */}
            <div className={`mt-8 p-6 rounded-xl transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ backgroundColor: 'hsl(270, 70%, 35%, 0.05)' }}>
              <p className="text-text-secondary text-lg leading-relaxed">
                <span className="font-semibold text-text-primary">Your team chemistry is an asset.</span>
                {' '}Stanford found collaborative workers focus 64% longer on tasks. Companies promoting collaboration are 5x more likely to be high-performing (i4cp). Creating your team profile is free and confidential—your current employer will never know.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
