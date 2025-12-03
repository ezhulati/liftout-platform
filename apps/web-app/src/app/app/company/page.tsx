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
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <BuildingOfficeIcon className="h-8 w-8 text-text-tertiary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Access denied</h1>
          <p className="mt-2 text-base font-normal text-text-secondary leading-relaxed">This page is only available to company users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header - Practical UI: bold headings, 48px touch targets */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">Company profile</h1>
            <p className="mt-2 text-base font-normal text-text-secondary leading-relaxed">
              Manage your company information and liftout requirements
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-outline min-h-12"
            >
              {isEditing ? 'Cancel' : 'Edit profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar - Practical UI: 48px touch targets */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-navy-50 border-navy text-navy-800'
                    : 'border-transparent text-text-primary hover:bg-bg-alt hover:border-border'
                } group border-l-4 px-4 py-3 flex items-center text-base font-bold w-full min-h-12 rounded-r-lg transition-colors duration-fast`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-navy' : 'text-text-tertiary'
                  } flex-shrink-0 mr-3 h-5 w-5`}
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
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Company Header Card - Practical UI: rounded-xl, proper spacing */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-navy" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{formData.name}</h2>
              <p className="text-base font-normal text-text-secondary">{formData.industry}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <UsersIcon className="h-5 w-5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-text-primary">Company size</p>
                <p className="text-sm font-normal text-text-secondary">{formData.size} employees</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-5 w-5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-text-primary">Headquarters</p>
                <p className="text-sm font-normal text-text-secondary">{formData.headquarters}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GlobeAltIcon className="h-5 w-5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-text-primary">Website</p>
                <a href={formData.website} className="text-sm font-normal text-navy hover:text-navy-600 underline underline-offset-4 transition-colors duration-fast">
                  {formData.website}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-bold text-text-primary mb-2">About</h3>
            <p className="text-base font-normal text-text-secondary leading-relaxed">{formData.description}</p>
          </div>
        </div>

        {/* Company Metrics Card */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-6">Company metrics</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-light rounded-xl mb-3">
                <CurrencyDollarIcon className="h-6 w-6 text-success" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-text-secondary">Annual revenue</p>
              <p className="text-lg font-bold text-text-primary mt-1">{formData.revenue}</p>
            </div>
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-navy-50 rounded-xl mb-3">
                <ChartBarIcon className="h-6 w-6 text-navy" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-text-secondary">Funding stage</p>
              <p className="text-lg font-bold text-text-primary mt-1">{formData.funding}</p>
            </div>
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-navy-50 rounded-xl mb-3">
                <BuildingOfficeIcon className="h-6 w-6 text-navy" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-text-secondary">Company stage</p>
              <p className="text-lg font-bold text-text-primary mt-1">{formData.stage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Edit Form - Practical UI: labels on top, single column layout */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Basic information</h3>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-base font-bold text-text-primary mb-2">Company name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-primary mb-2">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-primary mb-2">Company size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="input-field"
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
              <label className="block text-base font-bold text-text-primary mb-2">Founded</label>
              <input
                type="text"
                value={formData.founded}
                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-primary mb-2">Headquarters</label>
              <input
                type="text"
                value={formData.headquarters}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-primary mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-text-primary mb-2">Company description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Practical UI: Primary button left */}
        <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
          <button
            type="submit"
            className="btn-primary min-h-12"
          >
            Save changes
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
        {/* Culture Card - Practical UI styling */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Company culture</h3>
          <p className="text-base font-normal text-text-secondary leading-relaxed mb-6">{cultureData.cultureDescription}</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-base font-bold text-text-primary mb-3">Core values</h4>
              <div className="flex flex-wrap gap-2">
                {cultureData.values.map((value, index) => (
                  <span
                    key={index}
                    className="badge badge-primary text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary mb-3">Work style</h4>
              <span className="badge badge-success text-sm">
                {cultureData.workStyle}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-base font-bold text-text-primary mb-3">Benefits & perks</h4>
            <div className="grid grid-cols-2 gap-3">
              {cultureData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 bg-navy rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm font-normal text-text-secondary">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editing mode - form for updating culture values
  const [newValue, setNewValue] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const handleAddValue = () => {
    if (newValue.trim() && !cultureData.values.includes(newValue.trim())) {
      setCultureData({ ...cultureData, values: [...cultureData.values, newValue.trim()] });
      setNewValue('');
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    setCultureData({ ...cultureData, values: cultureData.values.filter(v => v !== valueToRemove) });
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !cultureData.benefits.includes(newBenefit.trim())) {
      setCultureData({ ...cultureData, benefits: [...cultureData.benefits, newBenefit.trim()] });
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove: string) => {
    setCultureData({ ...cultureData, benefits: cultureData.benefits.filter(b => b !== benefitToRemove) });
  };

  const handleSave = async () => {
    // TODO: Save to API when endpoint is ready
    console.log('Saving culture data:', cultureData);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      <div className="card p-6 space-y-6">
        <h3 className="text-lg font-bold text-text-primary">Edit company culture</h3>

        {/* Culture Description */}
        <div>
          <label className="block text-base font-bold text-text-primary mb-2">Culture description</label>
          <textarea
            rows={3}
            value={cultureData.cultureDescription}
            onChange={(e) => setCultureData({ ...cultureData, cultureDescription: e.target.value })}
            className="input-field"
            placeholder="Describe your company culture..."
          />
        </div>

        {/* Core Values */}
        <div>
          <label className="block text-base font-bold text-text-primary mb-2">Core values</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {cultureData.values.map((value, index) => (
              <span key={index} className="badge badge-primary text-sm flex items-center gap-2">
                {value}
                <button
                  type="button"
                  onClick={() => handleRemoveValue(value)}
                  className="text-navy-600 hover:text-navy-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddValue(); } }}
              className="input-field flex-1"
              placeholder="Add a value..."
            />
            <button type="button" onClick={handleAddValue} className="btn-outline min-h-12 px-4">
              Add
            </button>
          </div>
        </div>

        {/* Work Style */}
        <div>
          <label className="block text-base font-bold text-text-primary mb-2">Work style</label>
          <select
            value={cultureData.workStyle}
            onChange={(e) => setCultureData({ ...cultureData, workStyle: e.target.value })}
            className="input-field"
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-base font-bold text-text-primary mb-2">Benefits & perks</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {cultureData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between bg-bg-alt rounded-lg px-3 py-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-navy rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm font-normal text-text-secondary">{benefit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(benefit)}
                  className="text-text-tertiary hover:text-error ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
              className="input-field flex-1"
              placeholder="Add a benefit..."
            />
            <button type="button" onClick={handleAddBenefit} className="btn-outline min-h-12 px-4">
              Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-border flex items-center gap-4">
          <button type="submit" className="btn-primary min-h-12">
            Save changes
          </button>
        </div>
      </div>
    </form>
  );
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
      {/* Liftout History Card - Practical UI styling */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Liftout history</h3>

        <div className="space-y-4">
          {liftoutHistory.map((liftout) => (
            <div key={liftout.id} className="border border-border rounded-xl p-4 hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-bold text-text-primary">{liftout.team}</h4>
                <span className={`badge text-xs ${
                  liftout.outcome === 'Successful'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {liftout.outcome}
                </span>
              </div>
              <p className="text-sm font-normal text-text-tertiary mb-2">
                From {liftout.fromCompany} • {liftout.size} team members • {liftout.date}
              </p>
              <p className="text-sm font-normal text-text-secondary">{liftout.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics Card */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Liftout success metrics</h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center p-4 bg-bg-alt rounded-xl">
            <p className="text-3xl font-bold text-navy">19</p>
            <p className="text-sm font-bold text-text-secondary mt-1">Total liftouts</p>
          </div>
          <div className="text-center p-4 bg-bg-alt rounded-xl">
            <p className="text-3xl font-bold text-success">89%</p>
            <p className="text-sm font-bold text-text-secondary mt-1">Success rate</p>
          </div>
          <div className="text-center p-4 bg-bg-alt rounded-xl">
            <p className="text-3xl font-bold text-navy">156</p>
            <p className="text-sm font-bold text-text-secondary mt-1">Team members acquired</p>
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
      {/* Ideal Team Profile Card - Practical UI styling */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Ideal team profile</h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-base font-bold text-text-primary mb-3">Target industries</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.targetIndustries.map((industry, index) => (
                <span
                  key={index}
                  className="badge badge-primary text-sm"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-text-primary mb-3">Preferred team sizes</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.teamSizes.map((size, index) => (
                <span
                  key={index}
                  className="badge badge-success text-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-text-primary mb-2">Geographic preference</h4>
            <p className="text-sm font-normal text-text-secondary">{requirements.geographicPreference}</p>
          </div>

          <div>
            <h4 className="text-base font-bold text-text-primary mb-2">Experience level</h4>
            <p className="text-sm font-normal text-text-secondary">{requirements.experienceLevel}</p>
          </div>

          <div>
            <h4 className="text-base font-bold text-text-primary mb-3">Key specializations</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="badge badge-secondary text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-text-primary mb-2">Budget range</h4>
            <p className="text-sm font-normal text-text-secondary">{requirements.budget}</p>
          </div>
        </div>
      </div>

      {/* Integration Approach Card */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Integration approach</h3>
        <div className="space-y-5">
          <div>
            <h4 className="text-base font-bold text-text-primary mb-2">Onboarding timeline</h4>
            <p className="text-sm font-normal text-text-secondary">{requirements.timeline}</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-text-primary mb-2">Integration philosophy</h4>
            <p className="text-sm font-normal text-text-secondary leading-relaxed">
              Preserve team dynamics while providing resources for accelerated growth.
              Maintain team autonomy with strategic alignment to company objectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}