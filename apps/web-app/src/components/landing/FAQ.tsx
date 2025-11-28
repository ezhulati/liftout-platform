'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// FAQs ordered by popularity/importance - most asked first (#30)
// Pre-sale questions prioritized (#12)
const faqs = [
  {
    question: 'How much does it cost?',
    answer: 'Browsing and initial exploration is completely free for both companies and teams. We only charge a success fee when an acquisition is completed - you pay nothing until you find the right fit. No credit card required to start.',
    category: 'pricing',
  },
  {
    question: 'Is my exploration confidential?',
    answer: 'Absolutely. Confidentiality is core to our platform. Teams can explore opportunities without their current employers knowing. All conversations are NDA-protected, and we never share information without explicit consent. Zero confidentiality breaches since founding.',
    category: 'trust',
  },
  {
    question: 'How are teams verified?',
    answer: 'Every team goes through a comprehensive verification process: background checks, reference validation, track record documentation, and performance history review. We verify team composition, tenure working together, and documented achievements. 100% of teams on our platform are verified.',
    category: 'trust',
  },
  {
    question: 'What does the acquisition process look like?',
    answer: 'Three stages: discovery and matching (1-2 weeks), confidential conversations and due diligence (2-4 weeks), and negotiation and integration planning (2-4 weeks). We provide dedicated support throughout the entire process.',
    category: 'process',
  },
  {
    question: 'What industries do you cover?',
    answer: 'We focus on professional services and knowledge work: Financial Services, Technology, Healthcare, Consulting, Legal, and Private Equity. Our strongest coverage is teams with quantifiable track records across 12 industries.',
    category: 'general',
  },
  {
    question: 'What if an acquisition does not work out?',
    answer: 'We track integration success for 12 months post-acquisition. While rare (92% retention rate after 2 years), if significant issues arise within the first 90 days, we work with both parties to find solutions and provide integration support.',
    category: 'trust',
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
      className="py-24 lg:py-32 bg-bg scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left column - Header and support options */}
          <div className="lg:col-span-1">
            <div className={`lg:sticky lg:top-32 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-navy font-semibold text-base mb-3">
                Common questions
              </p>
              <h2
                id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
              >
                Frequently asked questions
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                Everything you need to know about team acquisition. Can't find what you're looking for? Our team is here to help.
              </p>

              {/* Support options (#12, #62) */}
              <div className="space-y-4">
                <Link
                  href="/contact"
                  className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-navy/20 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center group-hover:bg-navy transition-colors">
                    <EnvelopeIcon className="w-5 h-5 text-navy group-hover:text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Contact us</p>
                    <p className="text-text-secondary text-sm">Send us a message</p>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-navy/20 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center group-hover:bg-navy transition-colors">
                    <PhoneIcon className="w-5 h-5 text-navy group-hover:text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Schedule a call</p>
                    <p className="text-text-secondary text-sm">Talk to our team</p>
                  </div>
                </Link>

                <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-success" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Response time</p>
                    <p className="text-success text-sm font-medium">Usually within 2 hours</p>
                  </div>
                </div>
              </div>
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
                      <p className="text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional help text */}
            <div className={`mt-8 p-6 bg-navy/5 rounded-xl transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-text-secondary">
                <span className="font-semibold text-text-primary">Need help with something specific?</span>
                {' '}Our team has helped 150+ companies and teams navigate the acquisition process.
                We're happy to answer any questions before you commit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
