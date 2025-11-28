'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  BuildingOfficeIcon,
  GlobeAltIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function CompanyProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Company Overview', icon: BuildingOfficeIcon },
    { id: 'culture', name: 'Culture & Values', icon: UsersIcon },
    { id: 'liftout-history', name: 'Liftout History', icon: ChartBarIcon },
    { id: 'requirements', name: 'Team Requirements', icon: GlobeAltIcon },
  ];

  if (session?.user?.userType !== 'company') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Access Denied</h1>
          <p className="mt-2 text-text-secondary">This page is only available to company users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-text-primary">Company Profile</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Manage your company information and liftout requirements
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-text-secondary bg-white hover:bg-bg-alt focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-text-primary hover:bg-bg-alt'
                } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-primary-500' : 'text-text-tertiary'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {activeTab === 'overview' && <CompanyOverview isEditing={isEditing} />}
          {activeTab === 'culture' && <CultureValues isEditing={isEditing} />}
          {activeTab === 'liftout-history' && <LiftoutHistory />}
          {activeTab === 'requirements' && <TeamRequirements isEditing={isEditing} />}
        </div>
      </div>
    </div>
  );
}

function CompanyOverview({ isEditing }: { isEditing: boolean }) {
  const [formData, setFormData] = useState({
    name: 'TechVenture Capital',
    industry: 'Venture Capital & Private Equity',
    size: '500-1000',
    founded: '2015',
    headquarters: 'New York, NY',
    website: 'https://techventure.capital',
    description: 'Leading venture capital firm focused on early-stage technology companies with transformative potential.',
    revenue: '$500M - $1B',
    funding: 'Series C',
    stage: 'Growth Stage'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Company profile updated:', formData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{formData.name}</h2>
              <p className="text-text-secondary">{formData.industry}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3">
              <UsersIcon className="h-5 w-5 text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Company Size</p>
                <p className="text-sm text-text-secondary">{formData.size} employees</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Headquarters</p>
                <p className="text-sm text-text-secondary">{formData.headquarters}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="h-5 w-5 text-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Website</p>
                <a href={formData.website} className="text-sm text-primary-600 hover:text-primary-500">
                  {formData.website}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-text-primary mb-2">About</h3>
            <p className="text-text-secondary">{formData.description}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Company Metrics</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-light rounded-full mb-2">
                <CurrencyDollarIcon className="h-6 w-6 text-success" />
              </div>
              <p className="text-sm font-medium text-text-primary">Annual Revenue</p>
              <p className="text-lg font-bold text-text-primary">{formData.revenue}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-navy-50 rounded-full mb-2">
                <ChartBarIcon className="h-6 w-6 text-navy" />
              </div>
              <p className="text-sm font-medium text-text-primary">Funding Stage</p>
              <p className="text-lg font-bold text-text-primary">{formData.funding}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-navy-50 rounded-full mb-2">
                <BuildingOfficeIcon className="h-6 w-6 text-navy" />
              </div>
              <p className="text-sm font-medium text-text-primary">Company Stage</p>
              <p className="text-lg font-bold text-text-primary">{formData.stage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Company Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Company Size</label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500-1000">500-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Founded</label>
            <input
              type="text"
              value={formData.founded}
              onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Headquarters</label>
            <input
              type="text"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-text-secondary">Company Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-border rounded-md"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

function CultureValues({ isEditing }: { isEditing: boolean }) {
  const [cultureData, setCultureData] = useState({
    values: ['Innovation', 'Collaboration', 'Integrity', 'Excellence'],
    workStyle: 'Hybrid',
    benefits: ['Equity Participation', 'Unlimited PTO', 'Remote Work', 'Professional Development'],
    cultureDescription: 'We foster an environment of innovation and collaboration where the best ideas win.'
  });

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Company Culture</h3>
          <p className="text-text-secondary mb-6">{cultureData.cultureDescription}</p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-base font-medium text-text-primary mb-2">Core Values</h4>
              <div className="flex flex-wrap gap-2">
                {cultureData.values.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-base font-medium text-text-primary mb-2">Work Style</h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-light text-success-dark">
                {cultureData.workStyle}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-base font-medium text-text-primary mb-2">Benefits & Perks</h4>
            <div className="grid grid-cols-2 gap-2">
              {cultureData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 bg-primary-500 rounded-full mr-2"></div>
                  <span className="text-sm text-text-secondary">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editing mode would be similar to overview editing
  return <div>Culture editing form would go here...</div>;
}

function LiftoutHistory() {
  const liftoutHistory = [
    {
      id: 1,
      team: 'FinTech Analytics Team',
      fromCompany: 'Goldman Sachs',
      date: '2024-08-15',
      size: 8,
      outcome: 'Successful',
      impact: 'Launched new quantitative trading division',
    },
    {
      id: 2,
      team: 'Healthcare AI Research Team',
      fromCompany: 'Johns Hopkins',
      date: '2024-06-20',
      size: 6,
      outcome: 'Successful',
      impact: 'Accelerated medical imaging product development',
    },
    {
      id: 3,
      team: 'European Expansion Team',
      fromCompany: 'McKinsey & Company',
      date: '2024-03-10',
      size: 5,
      outcome: 'In Progress',
      impact: 'Currently establishing London office',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Liftout History</h3>
        
        <div className="space-y-4">
          {liftoutHistory.map((liftout) => (
            <div key={liftout.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-medium text-text-primary">{liftout.team}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  liftout.outcome === 'Successful' 
                    ? 'bg-success-light text-success-dark'
                    : 'bg-gold-100 text-gold-800'
                }`}>
                  {liftout.outcome}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-2">
                From {liftout.fromCompany} • {liftout.size} team members • {liftout.date}
              </p>
              <p className="text-sm text-text-primary">{liftout.impact}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Liftout Success Metrics</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-text-primary">19</p>
            <p className="text-sm text-text-secondary">Total Liftouts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">89%</p>
            <p className="text-sm text-text-secondary">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">156</p>
            <p className="text-sm text-text-secondary">Team Members Acquired</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamRequirements({ isEditing }: { isEditing: boolean }) {
  const [requirements, setRequirements] = useState({
    targetIndustries: ['Financial Services', 'Technology', 'Healthcare'],
    teamSizes: ['5-10 members', '10-20 members'],
    geographicPreference: 'North America, Europe',
    experienceLevel: 'Senior (5+ years)',
    specializations: ['Quantitative Analysis', 'AI/ML', 'Strategic Consulting'],
    budget: '$2M - $5M per liftout',
    timeline: '3-6 months'
  });

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Ideal Team Profile</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-base font-medium text-text-primary mb-2">Target Industries</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.targetIndustries.map((industry, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-800"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-text-primary mb-2">Preferred Team Sizes</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.teamSizes.map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-light text-success-dark"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-text-primary mb-2">Geographic Preference</h4>
            <p className="text-sm text-text-secondary">{requirements.geographicPreference}</p>
          </div>

          <div>
            <h4 className="text-base font-medium text-text-primary mb-2">Experience Level</h4>
            <p className="text-sm text-text-secondary">{requirements.experienceLevel}</p>
          </div>

          <div>
            <h4 className="text-base font-medium text-text-primary mb-2">Key Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-700"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-text-primary mb-2">Budget Range</h4>
            <p className="text-sm text-text-secondary">{requirements.budget}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Integration Approach</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium text-text-primary">Onboarding Timeline</h4>
            <p className="text-sm text-text-secondary">{requirements.timeline}</p>
          </div>
          <div>
            <h4 className="text-base font-medium text-text-primary">Integration Philosophy</h4>
            <p className="text-sm text-text-secondary">
              Preserve team dynamics while providing resources for accelerated growth. 
              Maintain team autonomy with strategic alignment to company objectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}