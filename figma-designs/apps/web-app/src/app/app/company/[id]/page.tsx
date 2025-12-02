'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  GlobeAltIcon,
  UsersIcon,
  CalendarIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
  SparklesIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Company {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  headquartersLocation?: string;
  locations?: string[];
  companyCulture?: string;
  values?: string[];
  benefits?: string[];
  techStack?: string[];
  verificationStatus?: string;
  employeeCount?: number;
  fundingStage?: string;
  glassdoorRating?: number;
  opportunities?: Array<{
    id: string;
    title: string;
    status: string;
    industry?: string;
    location?: string;
  }>;
}

const companySizeLabels: Record<string, string> = {
  startup: '1-50 employees',
  small: '51-200 employees',
  mid_market: '201-1000 employees',
  enterprise: '1000+ employees',
};

export default function CompanyProfilePage() {
  const params = useParams();
  const companyId = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const response = await fetch(`/api/companies/${companyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company');
      }
      return response.json();
    },
    enabled: !!companyId,
  });

  const company: Company | null = data?.company;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-bg-surface p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <BuildingOffice2Icon className="h-8 w-8 text-text-tertiary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Company Not Found</h1>
          <p className="text-text-secondary mb-6">
            The company you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/app/eoi"
            className="btn-primary min-h-12 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Interest Received
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-surface">
      <div className="max-w-5xl mx-auto p-6">
        {/* Back Navigation */}
        <Link
          href="/app/eoi"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-navy transition-colors mb-6 min-h-12"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Interest Received
        </Link>

        {/* Company Header */}
        <div className="bg-bg-elevated rounded-xl border border-border overflow-hidden mb-6">
          {/* Cover Image or Gradient */}
          <div className="h-32 bg-gradient-to-r from-navy to-navy-dark" />

          <div className="px-6 pb-6">
            {/* Logo and Name */}
            <div className="flex items-end gap-4 -mt-10">
              <div className="w-20 h-20 bg-white rounded-xl border-4 border-white shadow-md flex items-center justify-center flex-shrink-0">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <BuildingOffice2Icon className="h-10 w-10 text-navy" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-text-primary">{company.name}</h1>
                  {company.verificationStatus === 'verified' && (
                    <CheckBadgeIcon className="h-6 w-6 text-success" title="Verified Company" />
                  )}
                </div>
                <p className="text-text-secondary">{company.industry}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              {company.headquartersLocation && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Headquarters</p>
                    <p className="text-sm font-medium text-text-primary">{company.headquartersLocation}</p>
                  </div>
                </div>
              )}
              {(company.companySize || company.employeeCount) && (
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Company Size</p>
                    <p className="text-sm font-medium text-text-primary">
                      {company.employeeCount
                        ? `${company.employeeCount.toLocaleString()} employees`
                        : companySizeLabels[company.companySize || ''] || company.companySize}
                    </p>
                  </div>
                </div>
              )}
              {company.foundedYear && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Founded</p>
                    <p className="text-sm font-medium text-text-primary">{company.foundedYear}</p>
                  </div>
                </div>
              )}
              {company.fundingStage && (
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Funding</p>
                    <p className="text-sm font-medium text-text-primary">{company.fundingStage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Website Link */}
            {company.websiteUrl && (
              <div className="mt-4">
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-navy hover:text-navy-dark transition-colors min-h-12"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  Visit website
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {company.description && (
              <div className="bg-bg-elevated rounded-xl border border-border p-6">
                <h2 className="text-lg font-bold text-text-primary mb-4">About {company.name}</h2>
                <p className="text-text-secondary whitespace-pre-wrap">{company.description}</p>
              </div>
            )}

            {/* Culture */}
            {company.companyCulture && (
              <div className="bg-bg-elevated rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-bold text-text-primary">Culture</h2>
                </div>
                <p className="text-text-secondary">{company.companyCulture}</p>
              </div>
            )}

            {/* Values */}
            {company.values && company.values.length > 0 && (
              <div className="bg-bg-elevated rounded-xl border border-border p-6">
                <h2 className="text-lg font-bold text-text-primary mb-4">Our Values</h2>
                <div className="flex flex-wrap gap-2">
                  {company.values.map((value, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-navy-50 text-navy rounded-full text-sm font-medium"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Active Opportunities */}
            {company.opportunities && company.opportunities.length > 0 && (
              <div className="bg-bg-elevated rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BriefcaseIcon className="w-5 h-5 text-navy" />
                  <h2 className="text-lg font-bold text-text-primary">Active Opportunities</h2>
                </div>
                <div className="space-y-3">
                  {company.opportunities.map((opp) => (
                    <Link
                      key={opp.id}
                      href={`/app/opportunities/${opp.id}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-navy hover:bg-bg-alt transition-all group min-h-[72px]"
                    >
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-navy transition-colors">
                          {opp.title}
                        </h3>
                        {opp.location && (
                          <p className="text-sm text-text-secondary">{opp.location}</p>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-success-light text-success rounded-full text-sm font-medium">
                        Active
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="bg-bg-elevated rounded-xl border border-border p-6">
                <h3 className="text-base font-bold text-text-primary mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {company.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 bg-success rounded-full mt-1.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            {company.techStack && company.techStack.length > 0 && (
              <div className="bg-bg-elevated rounded-xl border border-border p-6">
                <h3 className="text-base font-bold text-text-primary mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {company.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-bg-alt text-text-secondary rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-bg-elevated rounded-xl border border-border p-6">
              <h3 className="text-base font-bold text-text-primary mb-2">Interested?</h3>
              <p className="text-sm text-text-secondary mb-4">
                If you&apos;re interested in opportunities at {company.name}, accept their expression of interest to start a conversation.
              </p>
              <Link href="/app/eoi" className="btn-primary w-full min-h-12 flex items-center justify-center">
                View Expressions of Interest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
