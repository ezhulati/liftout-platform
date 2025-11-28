'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    question: 'How are teams verified?',
    answer: 'Every team goes through a comprehensive verification process including background checks, reference validation, track record documentation, and performance history review. We verify team composition, tenure working together, and documented achievements.',
  },
  {
    question: 'What does the acquisition process look like?',
    answer: 'The process typically involves three stages: discovery and matching (1-2 weeks), confidential conversations and due diligence (2-4 weeks), and negotiation and integration planning (2-4 weeks). We provide support throughout each stage.',
  },
  {
    question: 'Is exploration confidential?',
    answer: 'Absolutely. Confidentiality is core to our platform. Teams can explore opportunities without their current employers knowing. All conversations are NDA-protected, and we never share information without explicit consent.',
  },
  {
    question: 'What industries do you cover?',
    answer: 'We focus on professional services and knowledge work including Financial Services, Technology, Healthcare, Consulting, Legal, and Private Equity. Our strongest coverage is in teams with quantifiable track records.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Browsing and initial exploration is free for both companies and teams. We charge a success fee only when an acquisition is completed. Contact us for specific pricing based on your situation.',
  },
  {
    question: 'What if an acquisition does not work out?',
    answer: 'We track integration success for 12 months post-acquisition. While rare (85% retention rate after 2 years), if significant issues arise within the first 90 days, we work with both parties to find solutions or provide partial fee refunds.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="faq"
      className="py-20 lg:py-28 bg-bg scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-4">
            Common questions
          </p>
          <h2
            id="faq-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Frequently asked questions
          </h2>
          <p className="font-body text-text-secondary leading-relaxed">
            Everything you need to know about team acquisition on Liftout.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-bg-surface border border-border rounded-xl overflow-hidden transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 75}ms` : '0ms' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 lg:p-6 text-left hover:bg-bg-elevated/50 transition-colors duration-fast"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-text-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform duration-base ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-base ease-out-quart ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className={`mt-12 text-center transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-text-secondary mb-2">
            Still have questions?
          </p>
          <a
            href="mailto:support@liftout.io"
            className="text-navy font-semibold hover:text-gold-700 transition-colors duration-fast underline underline-offset-4"
          >
            Contact our team
          </a>
        </div>
      </div>
    </section>
  );
}
