'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, EnvelopeIcon, BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const teamFaqs = [
  {
    question: 'Is Liftout confidential?',
    answer: 'Yes. You control your visibility: go fully anonymous, selective, or public. Only verified companies can view anonymous profiles, and all conversations are NDA-protected from the first interaction.',
  },
  {
    question: 'Is Liftout free for teams?',
    answer: 'Completely free. No sign-up fee, no charges to create a profile, no cost to connect with companies. You pay nothing—ever. The only investment is your talent.',
  },
  {
    question: 'How is this different from job boards?',
    answer: 'Job boards are for individuals. Liftout is the first platform built for teams. Think of it as a team board—you post a profile together, and companies who want to hire intact teams find you. This didn\'t exist before.',
  },
  {
    question: 'What if only some of us want to move?',
    answer: 'That\'s okay. Teams can be as small as two people. Moving with even one trusted colleague transforms a lonely process into a shared adventure. Start with whoever\'s ready.',
  },
  {
    question: 'Why put this online instead of doing it quietly?',
    answer: 'Scale. Behind closed doors, you\'re limited to who you know. Online, your team reaches companies you\'d never meet through back channels—more offers, better terms, the right fit. Liftouts have always happened for the well-connected. We\'re just making it accessible to everyone.',
  },
  {
    question: 'Isn\'t it disloyal to leave as a team?',
    answer: 'Loyalty is earned, not owed. If your whole team is looking together, that says more about where you are than where you\'re going. Teams don\'t leave companies they love.',
  },
  {
    question: 'Who is Liftout for?',
    answer: 'Teams who\'ve developed a unique blend of specialized complementary skills, cohesive dynamics, and strong client relationships—but feel constrained from reaching their full potential together. Partners at law firms, specialized engineering squads, research units, creative teams—any group that performs better together than apart.',
  },
  {
    question: 'How do I get started?',
    answer: 'Create your team profile highlighting your collective skills, track record, and readiness for new opportunities. Companies actively searching for teams like yours will reach out when they see potential.',
  },
  {
    question: 'Are companies actually looking for teams?',
    answer: 'Yes. Liftouts have been common practice in law, investment banking, and consulting for decades—Harvard Business Review has written about them since 2006. But there was never a platform for it. We built one.',
  },
];

const companyFaqs = [
  {
    question: 'Does hiring teams actually work better than hiring individuals?',
    answer: 'Harvard professor Boris Groysberg studied 1,000+ Wall Street analysts over nine years. His finding: when star performers move companies alone, their performance declines 46% and stays depressed for years. The exception? Liftouts. When teams move together, they bring their relationships and support systems with them—and maintain their exceptional performance. The book is called "Chasing Stars" if you want to dig deeper.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Browsing and initial exploration is free. We charge a success fee only when an acquisition is completed—you pay nothing until you find the right fit. No credit card required to start.',
  },
  {
    question: 'How are teams verified?',
    answer: 'Every team goes through background checks, reference validation, track record documentation, and performance history review. We verify team composition, tenure working together, and documented achievements before they can connect with companies.',
  },
  {
    question: 'What if we only need some of the team?',
    answer: 'Teams understand that not every member may fit every opportunity. What matters is preserving the core chemistry. Discuss openly during conversations—most teams are flexible about composition.',
  },
  {
    question: 'What about the company losing the team?',
    answer: 'If an entire team wants to leave, that\'s not a platform problem—it\'s a signal. Teams don\'t leave places where they\'re valued, paid well, and growing. Liftout doesn\'t cause departures. It organizes them.',
  },
  {
    question: 'Doesn\'t this just make poaching easier?',
    answer: 'Talent mobility is healthy for markets. Stagnant teams don\'t innovate. The companies that thrive are the ones people want to join—and those same companies use Liftout to attract proven teams. If you\'re a great place to work, this helps you too.',
  },
  {
    question: 'What does the process look like?',
    answer: 'Three stages: Discovery & matching (1-2 weeks), confidential conversations & due diligence (2-4 weeks), and negotiation & integration planning (2-4 weeks). We provide dedicated support throughout the entire process.',
  },
  {
    question: 'What industries do you cover?',
    answer: 'Financial Services, Technology, Healthcare, Consulting, Legal, and Private Equity. We\'re starting with professional services—the same industries where liftouts have happened for decades. We\'re just making them accessible to everyone.',
  },
  {
    question: 'What if an acquisition doesn\'t work out?',
    answer: 'We track integration success for 12 months post-acquisition. Research shows intact teams integrate faster because they skip the team-formation phase. If issues arise within the first 90 days, we work with both parties to find solutions.',
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
              <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
                Common questions
              </p>
              <h2
                id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
              >
                Frequently asked questions
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                We&apos;re building something new. Here&apos;s what you need to know.
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
                          font-medium text-base transition-all duration-fast whitespace-nowrap
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 focus-visible:ring-offset-2
                          ${isActive
                            ? 'bg-bg-surface text-[#4C1D95] shadow-sm'
                            : 'text-text-tertiary hover:text-text-primary'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        <span>{tab.label}</span>
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
                {' '}We're happy to answer any questions and walk you through the process before you commit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
