'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Simplified to 4 essential FAQs
const faqs = [
  {
    question: 'Is it really confidential?',
    answer: 'Yes. You control your visibility—anonymous, selective, or public. Only verified companies can view anonymous profiles, and all conversations are NDA-protected.',
  },
  {
    question: 'Is it free?',
    answer: 'Completely free for teams. No sign-up fee, no charges to create a profile, no cost to connect with companies. You pay nothing—ever.',
  },
  {
    question: 'Are companies actually hiring teams?',
    answer: 'Yes. Microsoft paid $650M for Inflection AI\'s team. Google paid $2.7B for Character.AI\'s founders. Top law firms hire entire practice groups regularly. This happens—there just wasn\'t a platform for it until now.',
  },
  {
    question: 'What kind of teams is this for?',
    answer: 'Teams with rare chemistry who feel constrained where they are: engineering squads, law partners, consulting units, research teams, creative groups—any team that performs better together than apart.',
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
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Practical UI: left-aligned section header */}
        <h2
          id="faq-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Common questions
        </h2>

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
                className="w-full flex items-center justify-between p-5 text-left hover:bg-bg-elevated/50 transition-colors duration-200"
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
                <div className="px-5 pb-5 pt-0">
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact link */}
        <p className={`mt-8 text-center text-text-secondary transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          More questions?{' '}
          <Link href="/contact" className="text-[#4C1D95] underline underline-offset-4 hover:text-[#3b1578]">
            Get in touch
          </Link>
        </p>
      </div>
    </section>
  );
}
