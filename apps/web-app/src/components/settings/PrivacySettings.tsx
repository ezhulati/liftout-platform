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
        enabled ? 'bg-primary-600' : 'bg-gray-200'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
      disabled={disabled}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
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
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      risk: 'low',
    },
    {
      value: 'selective' as const,
      title: 'Selective',
      description: 'Only visible to verified companies and direct connections',
      icon: ShieldCheckIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      risk: 'medium',
    },
    {
      value: 'private' as const,
      title: 'Private',
      description: 'Only visible to you and direct team members',
      icon: EyeSlashIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
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
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
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
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Control who can see your information and how it's used on the platform.
        </p>
      </div>

      {/* Profile Visibility */}
      <div className="space-y-4">
        <div className="flex items-center">
          <EyeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-base font-medium text-gray-900">Profile Visibility</h4>
        </div>
        <p className="text-sm text-gray-600">
          Choose who can see your profile and contact information.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibilityOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                settings.privacy.profileVisibility === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => handleVisibilityChange(option.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${option.bgColor} p-2 rounded-lg`}>
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{option.title}</p>
                  </div>
                </div>
                {settings.privacy.profileVisibility === option.value && (
                  <div className="flex-shrink-0 text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">{option.description}</p>
            </div>
          ))}
        </div>

        {/* Visibility Warning */}
        {settings.privacy.profileVisibility === 'private' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Limited Visibility
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
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
        <h4 className="text-base font-medium text-gray-900">Privacy Controls</h4>
        <div className="space-y-4">
          {privacyToggles.map((toggle) => (
            <div 
              key={toggle.key} 
              className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                toggle.important ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-1 rounded ${
                  toggle.important ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <toggle.icon className={`h-5 w-5 ${
                    toggle.important ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{toggle.title}</p>
                    {toggle.important && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{toggle.description}</p>
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
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Data Privacy & Security</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Data Protection:</strong> Your personal information is encrypted and stored securely. 
            We never sell your data to third parties.
          </p>
          <p>
            <strong>Profile Verification:</strong> Companies must be verified before they can access your contact information.
          </p>
          <p>
            <strong>Anonymized Analytics:</strong> When enabled, usage analytics are completely anonymized and cannot be traced back to you.
          </p>
          <p>
            <strong>Data Deletion:</strong> You can request deletion of your data at any time from the Account settings.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString()} | 
            <a href="/privacy" className="text-primary-600 hover:text-primary-500 ml-1">
              Privacy Policy
            </a> | 
            <a href="/terms" className="text-primary-600 hover:text-primary-500 ml-1">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}