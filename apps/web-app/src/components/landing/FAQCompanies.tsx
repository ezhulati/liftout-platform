'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// FAQs specifically for companies - ordered by what matters most to them
const faqs = [
  {
    question: 'How much does it cost?',
    answer: 'Browsing teams and initial exploration is completely free. We charge a success fee only when an acquisition is completed—you pay nothing until you find the right fit. No credit card required to get started.',
  },
  {
    question: 'How are teams verified?',
    answer: 'Every team on our platform goes through a comprehensive verification process: background checks, reference validation, track record documentation, and performance history review. We verify team composition, tenure working together, and documented achievements. 100% of teams on Liftout are verified.',
  },
  {
    question: 'What does the acquisition process look like?',
    answer: 'Three stages: (1) Discovery & matching—define your needs and browse verified teams (1-2 weeks). (2) Confidential conversations & due diligence—evaluate fit, check references, assess culture alignment (2-4 weeks). (3) Negotiation & integration planning—finalize terms and prepare for onboarding (2-4 weeks). We provide dedicated support throughout.',
  },
  {
    question: 'What industries do you cover?',
    answer: 'Financial Services, Technology, Healthcare, Consulting, Legal, and Private Equity. Our strongest coverage is professional services teams with quantifiable track records. We currently support team acquisition across 12 industries.',
  },
  {
    question: 'What if an acquisition doesn\'t work out?',
    answer: 'We track integration success for 12 months post-acquisition. While rare (92% retention rate after 2 years), if significant issues arise within the first 90 days, we work with both parties to find solutions and provide integration support.',
  },
  {
    question: 'Is the process confidential?',
    answer: 'Absolutely. Companies can explore teams discreetly without competitors knowing. Information is never shared without explicit consent, and all conversations are NDA-protected from the first interaction.',
  },
  {
    question: 'Why acquire a team instead of hiring individuals?',
    answer: 'Intact teams offer immediate productivity—no team-building phase, no ramp-up time. You get proven chemistry, established workflows, and documented results. It\'s lower risk than M&A with faster time-to-value than building a team from scratch.',
  },
  {
    question: 'What types of teams are available?',
    answer: 'Teams range from 2-person partnerships to 20+ person departments. Common profiles include: investment banking groups, law firm practice teams, consulting units, engineering squads, research teams, and creative groups. All have documented track records and verified tenure working together.',
  },
];

export function FAQCompanies() {
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
              <p className="font-semibold text-base mb-3 text-navy">
                Questions from companies
              </p>
              <h2
                id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
              >
                Everything you need to know
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Common questions from companies exploring team acquisition. Can't find your answer? Our team is ready to help.
              </p>

              {/* Support option */}
              <Link
                href="/contact"
                className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-border-hover hover:shadow-sm transition-all group min-h-12"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-navy transition-colors" style={{ backgroundColor: 'hsl(220, 70%, 50%, 0.1)' }}>
                  <EnvelopeIcon className="w-6 h-6 text-navy group-hover:text-on-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-base">Contact us</p>
                  <p className="text-text-secondary text-base">We respond within 2 hours</p>
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
                  className={`bg-bg-surface border border-border rounded-xl overflow-hidden transition-all duration-500 hover:border-navy/20 ${
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
            <div className={`mt-8 p-6 rounded-xl transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ backgroundColor: 'hsl(220, 70%, 50%, 0.05)' }}>
              <p className="text-text-secondary text-lg leading-relaxed">
                <span className="font-semibold text-text-primary">Ready to explore?</span>
                {' '}Our team has helped 150+ companies find and integrate high-performing teams.
                We're happy to walk you through the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
