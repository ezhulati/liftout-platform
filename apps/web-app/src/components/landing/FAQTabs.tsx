'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, EnvelopeIcon, BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const teamFaqs = [
  {
    question: 'Is Liftout confidential?',
    answer: 'Yes. Your current employer is automatically blocked from seeing your profile. You control which companies can view you, and all conversations are NDA-protected. We\'ve had zero confidentiality breaches since founding.',
  },
  {
    question: 'Is Liftout free for teams?',
    answer: 'Completely free. No sign-up fee, no charges to create a profile, no cost to connect with companies. You pay nothing—ever. The only investment is your talent.',
  },
  {
    question: 'How is this different from job boards?',
    answer: 'Traditional job sites focus on individuals posting resumes. Liftout enables entire teams to explore opportunities together, confidentially. Companies here are specifically seeking proven teams that can hit the ground running—not just individuals.',
  },
  {
    question: 'Who is Liftout for?',
    answer: 'Teams who\'ve built rare chemistry together but feel constrained in their current roles. Partners at law firms, specialized engineering squads, research units, creative teams—any group that performs better together than apart.',
  },
  {
    question: 'How do I get started?',
    answer: 'Create your team profile highlighting your collective skills, track record, and readiness for new opportunities. Companies actively searching for teams like yours will reach out when they see potential.',
  },
  {
    question: 'Are companies actually looking for teams?',
    answer: 'Yes. 500+ registered firms across law, banking, consulting, advertising, and technology—from startups to Fortune 500—are actively seeking intact teams that can make an immediate impact.',
  },
];

const companyFaqs = [
  {
    question: 'How much does it cost?',
    answer: 'Browsing and initial exploration is free. We charge a success fee only when an acquisition is completed—you pay nothing until you find the right fit. No credit card required to start.',
  },
  {
    question: 'How are teams verified?',
    answer: 'Every team goes through background checks, reference validation, track record documentation, and performance history review. We verify team composition, tenure working together, and documented achievements. 100% of teams on our platform are verified.',
  },
  {
    question: 'What does the process look like?',
    answer: 'Three stages: Discovery & matching (1-2 weeks), confidential conversations & due diligence (2-4 weeks), and negotiation & integration planning (2-4 weeks). We provide dedicated support throughout the entire process.',
  },
  {
    question: 'What industries do you cover?',
    answer: 'Financial Services, Technology, Healthcare, Consulting, Legal, and Private Equity. Our strongest coverage is professional services teams with quantifiable track records across 12 industries.',
  },
  {
    question: 'What if an acquisition doesn\'t work out?',
    answer: 'We track integration success for 12 months. With a 92% retention rate after 2 years, issues are rare. If significant problems arise within 90 days, we work with both parties to find solutions.',
  },
  {
    question: 'Is the process confidential?',
    answer: 'Absolutely. Both companies and teams explore discreetly. Information is never shared without explicit consent, and all conversations are NDA-protected.',
  },
];

type TabId = 'teams' | 'companies';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'teams', label: 'For Teams', icon: UserGroupIcon },
  { id: 'companies', label: 'For Companies', icon: BuildingOffice2Icon },
];

export function FAQTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('teams');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const faqs = activeTab === 'teams' ? teamFaqs : companyFaqs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setOpenIndex(0); // Reset to first FAQ open when switching tabs
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
          {/* Left column - Header, tabs, and support options */}
          <div className="lg:col-span-1">
            <div className={`lg:sticky lg:top-32 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="font-semibold text-base mb-3 text-[#4C1D95]">
                Common questions
              </p>
              <h2
                id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
              >
                Frequently asked questions
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Everything you need to know about Liftout. Select your perspective below.
              </p>

              {/* Tabs */}
              <div className="mb-8">
                <div
                  role="tablist"
                  className="flex bg-bg-elevated rounded-lg p-1 gap-1"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md min-h-12
                          font-medium text-base transition-all duration-fast
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 focus-visible:ring-offset-2
                          ${isActive
                            ? 'bg-bg-surface text-[#4C1D95] shadow-sm'
                            : 'text-text-tertiary hover:text-text-primary'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.id === 'teams' ? 'Teams' : 'Companies'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Support option */}
              <Link
                href="/contact"
                className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-border-hover hover:shadow-sm transition-all group min-h-12"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-[#4C1D95] transition-colors" style={{ backgroundColor: 'hsl(270, 70%, 35%, 0.1)' }}>
                  <EnvelopeIcon className="w-6 h-6 text-[#4C1D95] group-hover:text-on-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-base">Still have questions?</p>
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
                  key={`${activeTab}-${index}`}
                  className={`bg-bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-900/20 ${
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
                    aria-controls={`faq-answer-${activeTab}-${index}`}
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
                    id={`faq-answer-${activeTab}-${index}`}
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
                <span className="font-semibold text-text-primary">Need help with something specific?</span>
                {' '}Our team has helped 150+ companies and teams navigate the process.
                We're happy to answer any questions before you commit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
