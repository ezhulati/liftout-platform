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

// Practical UI: Toggle for immediate effect settings, min 48pt touch target
function ToggleSwitch({ enabled, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`${
        enabled ? 'bg-navy' : 'bg-border'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy min-h-[48px] min-w-[56px] items-center`}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
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

  // Practical UI: For ≤10 options use radio buttons stacked vertically
  const visibilityOptions = [
    {
      value: 'public' as const,
      title: 'Public',
      description: 'Visible to all users and search engines. Maximum exposure for liftout opportunities.',
      icon: UserGroupIcon,
    },
    {
      value: 'selective' as const,
      title: 'Selective (anonymous mode)',
      description: 'Only visible to verified companies. Your identity is masked until you respond to interest.',
      icon: ShieldCheckIcon,
    },
    {
      value: 'private' as const,
      title: 'Private',
      description: 'Only visible to you and direct team members. Companies cannot discover your profile.',
      icon: EyeSlashIcon,
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
      {/* Header - Practical UI: bold headings, regular body */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Privacy settings</h3>
        <p className="mt-1 text-sm font-normal text-text-secondary leading-relaxed">
          Control who can see your information and how it's used on the platform.
        </p>
      </div>

      {/* Profile Visibility - Practical UI: single column, radio buttons stacked vertically */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-bold text-text-primary">Profile visibility</h4>
          <p className="mt-1 text-base text-text-secondary">
            Choose who can see your profile and contact information.
          </p>
        </div>

        {/* Practical UI: Radio buttons for ≤10 options, stacked vertically, min 48pt touch targets */}
        <fieldset className="space-y-3" role="radiogroup" aria-label="Profile visibility">
          {visibilityOptions.map((option) => {
            const isSelected = settings.privacy.profileVisibility === option.value;
            return (
              <label
                key={option.value}
                className={`relative flex items-start cursor-pointer rounded-lg border-2 p-4 min-h-[64px] transition-colors ${
                  isSelected
                    ? 'border-navy bg-navy-50'
                    : 'border-border bg-bg-surface hover:border-navy-200'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleVisibilityChange(option.value)}
                  className="sr-only"
                />
                {/* Radio indicator */}
                <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-navy bg-navy' : 'border-border'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                {/* Label content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <option.icon className={`h-5 w-5 ${isSelected ? 'text-navy' : 'text-text-tertiary'}`} />
                    <span className="text-base font-bold text-text-primary">{option.title}</span>
                  </div>
                  <p className="mt-1 text-base text-text-secondary">{option.description}</p>
                </div>
              </label>
            );
          })}
        </fieldset>

        {/* Visibility Warning - Practical UI: color + icon + text for warnings */}
        {settings.privacy.profileVisibility === 'private' && (
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-bold text-gold-900">Limited visibility</p>
                <p className="mt-1 text-base text-gold-700">
                  With private visibility, companies won't be able to discover your profile through search or matching.
                  This may significantly reduce your liftout opportunities.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Controls - Practical UI: toggles for immediate effect, min 48pt touch targets */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-bold text-text-primary">Privacy controls</h4>
          <p className="mt-1 text-base text-text-secondary">
            Control what information is shared with others.
          </p>
        </div>
        <div className="space-y-3">
          {privacyToggles.map((toggle) => (
            <div
              key={toggle.key}
              className={`flex items-center justify-between p-4 border-2 rounded-lg transition-colors min-h-[72px] ${
                toggle.important ? 'border-navy-200 bg-navy-50' : 'border-border bg-bg-surface'
              }`}
            >
              <div className="flex items-start gap-3 mr-4 flex-1">
                <toggle.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  toggle.important ? 'text-navy' : 'text-text-tertiary'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-text-primary">{toggle.title}</span>
                    {toggle.important && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold bg-navy-100 text-navy-800">
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

      {/* Data Privacy Information - Practical UI: readable body text (≥18px) */}
      <div className="bg-bg-alt rounded-xl p-6">
        <h4 className="text-lg font-bold text-text-primary mb-4">Data privacy and security</h4>
        <div className="space-y-4 text-base text-text-secondary">
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
          <p className="text-sm text-text-tertiary">
            Last updated: {new Date().toLocaleDateString()} |{' '}
            <a href="/privacy" className="text-link underline">
              Privacy policy
            </a>{' '}
            |{' '}
            <a href="/terms" className="text-link underline">
              Terms of service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}