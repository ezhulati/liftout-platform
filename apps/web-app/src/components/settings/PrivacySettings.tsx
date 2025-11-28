'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { PrivacySettings as PrivacySettingsType } from '@/types/settings';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`${
        enabled ? 'bg-navy' : 'bg-bg-alt'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy min-h-12 min-w-14 items-center`}
      disabled={disabled}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-0'
        } pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow transform ring-0 transition duration-base`}
      />
    </button>
  );
}

export function PrivacySettings() {
  const { user, isCompany } = useAuth();
  const { settings, updatePrivacySettings, isLoading } = useSettings();

  const handleToggle = (key: keyof PrivacySettingsType, value: boolean) => {
    updatePrivacySettings({ [key]: value });
  };

  const handleVisibilityChange = (visibility: 'public' | 'selective' | 'private') => {
    updatePrivacySettings({ profileVisibility: visibility });
  };

  const visibilityOptions = [
    {
      value: 'public' as const,
      title: 'Public',
      description: 'Visible to all users and search engines',
      icon: UserGroupIcon,
      color: 'text-success',
      bgColor: 'bg-success-light',
      risk: 'low',
    },
    {
      value: 'selective' as const,
      title: 'Selective',
      description: 'Only visible to verified companies and direct connections',
      icon: ShieldCheckIcon,
      color: 'text-navy',
      bgColor: 'bg-navy-50',
      risk: 'medium',
    },
    {
      value: 'private' as const,
      title: 'Private',
      description: 'Only visible to you and direct team members',
      icon: EyeSlashIcon,
      color: 'text-text-secondary',
      bgColor: 'bg-bg-alt',
      risk: 'high',
    },
  ];

  const privacyToggles = [
    {
      key: 'showCurrentCompany' as const,
      title: 'Show Current Company',
      description: 'Display your current employer on your profile',
      icon: BuildingOfficeIcon,
      important: true,
    },
    {
      key: 'allowDiscovery' as const,
      title: 'Allow Discovery',
      description: isCompany 
        ? 'Let teams and individuals find your company through search'
        : 'Let companies find your team through search and matching algorithms',
      icon: ChartBarIcon,
      important: true,
    },
    {
      key: 'showContactInfo' as const,
      title: 'Show Contact Information',
      description: 'Display your email and phone number to verified companies',
      icon: EnvelopeIcon,
      important: false,
    },
    {
      key: 'allowDirectContact' as const,
      title: 'Allow Direct Contact',
      description: 'Allow companies to message you directly without going through the platform',
      icon: PhoneIcon,
      important: false,
    },
    {
      key: 'showSalaryExpectations' as const,
      title: 'Show Salary Expectations',
      description: 'Display your salary expectations to potential employers',
      icon: CurrencyDollarIcon,
      important: false,
    },
    {
      key: 'shareWithRecruiters' as const,
      title: 'Share with Recruiters',
      description: 'Allow third-party recruiters to access your profile information',
      icon: UserGroupIcon,
      important: false,
    },
    {
      key: 'shareAnalytics' as const,
      title: 'Share Usage Analytics',
      description: 'Help improve the platform by sharing anonymous usage data',
      icon: ChartBarIcon,
      important: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-bg-alt rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-bg-alt rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-bg-alt rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-bg-alt rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-bg-alt rounded w-2/3"></div>
                </div>
                <div className="w-11 h-6 bg-bg-alt rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg leading-6 font-medium text-text-primary">Privacy settings</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Control who can see your information and how it's used on the platform.
        </p>
      </div>

      {/* Profile Visibility */}
      <div className="space-y-4">
        <div className="flex items-center">
          <EyeIcon className="h-5 w-5 text-text-tertiary mr-2" />
          <h4 className="text-base font-medium text-text-primary">Profile visibility</h4>
        </div>
        <p className="text-sm text-text-secondary">
          Choose who can see your profile and contact information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibilityOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg border-2 p-4 focus:outline-none transition-colors ${
                settings.privacy.profileVisibility === option.value
                  ? 'border-navy bg-navy-50'
                  : 'border-border bg-bg-surface hover:border-navy-300'
              }`}
              onClick={() => handleVisibilityChange(option.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${option.bgColor} p-2 rounded-lg`}>
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-text-primary">{option.title}</p>
                  </div>
                </div>
                {settings.privacy.profileVisibility === option.value && (
                  <div className="flex-shrink-0 text-navy">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-text-tertiary">{option.description}</p>
            </div>
          ))}
        </div>

        {/* Visibility Warning */}
        {settings.privacy.profileVisibility === 'private' && (
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-gold" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gold-900">
                  Limited visibility
                </h3>
                <div className="mt-2 text-sm text-gold-700">
                  <p>
                    With private visibility, companies won't be able to discover your profile through search or matching.
                    This may significantly reduce your liftout opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Controls */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-text-primary">Privacy controls</h4>
        <div className="space-y-4">
          {privacyToggles.map((toggle) => (
            <div
              key={toggle.key}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors min-h-20 ${
                toggle.important ? 'border-navy-200 bg-navy-50 hover:bg-navy-50/80' : 'border-border hover:bg-bg-alt'
              }`}
            >
              <div className="flex items-start space-x-3 mr-4">
                <div className={`flex-shrink-0 p-1 rounded ${
                  toggle.important ? 'bg-navy-100' : 'bg-bg-alt'
                }`}>
                  <toggle.icon className={`h-5 w-5 ${
                    toggle.important ? 'text-navy' : 'text-text-tertiary'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-base font-medium text-text-primary">{toggle.title}</p>
                    {toggle.important && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-navy-100 text-navy-800">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-base text-text-secondary mt-1">{toggle.description}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.privacy[toggle.key]}
                onChange={(value) => handleToggle(toggle.key, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Data Privacy Information */}
      <div className="bg-bg-alt rounded-lg p-6">
        <h4 className="text-base font-medium text-text-primary mb-4">Data privacy and security</h4>
        <div className="space-y-3 text-sm text-text-secondary">
          <p>
            <strong className="text-text-primary">Data protection:</strong> Your personal information is encrypted and stored securely.
            We never sell your data to third parties.
          </p>
          <p>
            <strong className="text-text-primary">Profile verification:</strong> Companies must be verified before they can access your contact information.
          </p>
          <p>
            <strong className="text-text-primary">Anonymized analytics:</strong> When enabled, usage analytics are completely anonymized and cannot be traced back to you.
          </p>
          <p>
            <strong className="text-text-primary">Data deletion:</strong> You can request deletion of your data at any time from the Account settings.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-tertiary">
            Last updated: {new Date().toLocaleDateString()} |
            <a href="/privacy" className="text-link ml-1">
              Privacy policy
            </a> |
            <a href="/terms" className="text-link ml-1">
              Terms of service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}