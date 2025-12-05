'use client';

import {
  EnvelopeIcon,
  ClockIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';

const contactOptions = [
  {
    title: 'For companies',
    description: 'Looking to acquire a high-performing team? Our enterprise team will help you find the perfect match.',
    cta: 'Contact enterprise team',
    icon: BuildingOffice2Icon,
    responseTime: 'Same-day response',
    inquiryType: 'company',
  },
  {
    title: 'For teams',
    description: 'Ready to explore new opportunities together? We\'ll guide you through the liftout process.',
    cta: 'Talk to team advisors',
    icon: UserGroupIcon,
    responseTime: 'Same-day response',
    inquiryType: 'team',
  },
  {
    title: 'General inquiries',
    description: 'Have questions about how Liftout works? Our support team is here to help.',
    cta: 'Send us a message',
    icon: QuestionMarkCircleIcon,
    responseTime: 'Within 24 hours',
    inquiryType: 'general',
  },
  {
    title: 'Press & media',
    description: 'For press inquiries, interview requests, or media-related questions.',
    cta: 'Contact PR team',
    icon: NewspaperIcon,
    responseTime: 'Within 48 hours',
    inquiryType: 'press',
  },
];

export function ContactOptions() {
  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactOptions.map((option) => (
            <button
              key={option.title}
              onClick={scrollToForm}
              className="group bg-bg-surface border border-border rounded-xl p-6 hover:border-navy/30 hover:shadow-sm transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors">
                  <option.icon className="w-6 h-6 text-navy group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-lg mb-1">
                    {option.title}
                  </h3>
                  <p className="text-text-secondary text-base mb-3 leading-relaxed">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-navy font-semibold text-base group-hover:underline">
                      <EnvelopeIcon className="w-4 h-4" />
                      {option.cta}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-text-tertiary text-base">
                      <ClockIcon className="w-4 h-4" />
                      {option.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
