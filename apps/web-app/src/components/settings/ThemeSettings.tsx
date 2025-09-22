'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { 
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  LanguageIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EnvelopeIcon,
  SwatchIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { ThemeSettings as ThemeSettingsType } from '@/types/settings';

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

export function ThemeSettings() {
  const { settings, updateThemeSettings, isLoading } = useSettings();

  const handleToggle = (key: keyof ThemeSettingsType, value: boolean) => {
    updateThemeSettings({ [key]: value });
  };

  const handleSelectChange = (key: keyof ThemeSettingsType, value: string) => {
    updateThemeSettings({ [key]: value });
  };

  const themeOptions = [
    {
      value: 'light' as const,
      title: 'Light',
      description: 'Clean, bright interface',
      icon: SunIcon,
      preview: 'bg-white border-gray-200',
    },
    {
      value: 'dark' as const,
      title: 'Dark',
      description: 'Easy on the eyes',
      icon: MoonIcon,
      preview: 'bg-gray-900 border-gray-700',
    },
    {
      value: 'system' as const,
      title: 'System',
      description: 'Match your device setting',
      icon: ComputerDesktopIcon,
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400',
    },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  ];

  const dateFormats = [
    { value: 'US', label: 'MM/DD/YYYY (US)', example: '12/25/2024' },
    { value: 'EU', label: 'DD/MM/YYYY (EU)', example: '25/12/2024' },
    { value: 'ISO', label: 'YYYY-MM-DD (ISO)', example: '2024-12-25' },
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
  ];

  const digestFrequencies = [
    { value: 'daily', label: 'Daily', description: 'Every day at 9 AM' },
    { value: 'weekly', label: 'Weekly', description: 'Every Monday at 9 AM' },
    { value: 'monthly', label: 'Monthly', description: 'First Monday of each month' },
    { value: 'never', label: 'Never', description: 'No email digests' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Theme & Interface</h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize your Liftout experience with themes, languages, and display preferences.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="flex items-center">
          <SwatchIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-base font-medium text-gray-900">Appearance</h4>
        </div>
        <p className="text-sm text-gray-600">
          Choose your preferred theme for the Liftout interface.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                settings.theme.theme === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => handleSelectChange('theme', option.value)}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-full h-16 rounded-lg ${option.preview} mb-3 flex items-center justify-center border-2`}>
                  <option.icon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
                  {settings.theme.theme === option.value && (
                    <div className="ml-2 flex-shrink-0 text-primary-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interface Options */}
      <div className="space-y-4">
        <div className="flex items-center">
          <ViewColumnsIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-base font-medium text-gray-900">Interface Options</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Compact Mode</p>
              <p className="text-sm text-gray-500">Reduce padding and spacing for a denser interface</p>
            </div>
            <ToggleSwitch
              enabled={settings.theme.compactMode}
              onChange={(value) => handleToggle('compactMode', value)}
            />
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="space-y-4">
        <div className="flex items-center">
          <LanguageIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-base font-medium text-gray-900">Language & Region</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              value={settings.theme.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              Timezone
            </label>
            <select
              id="timezone"
              value={settings.theme.timezone}
              onChange={(e) => handleSelectChange('timezone', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Format Preferences */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-900">Format Preferences</h4>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Date Format
            </label>
            <select
              id="dateFormat"
              value={settings.theme.dateFormat}
              onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {dateFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label} - {format.example}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
              Currency
            </label>
            <select
              id="currency"
              value={settings.theme.currency}
              onChange={(e) => handleSelectChange('currency', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="space-y-4">
        <div className="flex items-center">
          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-base font-medium text-gray-900">Email Digest</h4>
        </div>
        <p className="text-sm text-gray-600">
          Choose how often you'd like to receive summary emails about platform activity.
        </p>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {digestFrequencies.map((freq) => (
            <div
              key={freq.value}
              className={`cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                settings.theme.emailDigestFrequency === freq.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => handleSelectChange('emailDigestFrequency', freq.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{freq.label}</p>
                  <p className="text-sm text-gray-500">{freq.description}</p>
                </div>
                {settings.theme.emailDigestFrequency === freq.value && (
                  <div className="flex-shrink-0 text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Preview</h4>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-medium text-gray-900">Sample Liftout Opportunity</h5>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleDateString(
                settings.theme.language,
                settings.theme.dateFormat === 'US' ? { month: 'numeric', day: 'numeric', year: 'numeric' } :
                settings.theme.dateFormat === 'EU' ? { day: 'numeric', month: 'numeric', year: 'numeric' } :
                { year: 'numeric', month: '2-digit', day: '2-digit' }
              )}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Senior Software Engineering Team • Goldman Sachs
          </p>
          <p className="text-sm text-gray-900">
            Compensation: {settings.theme.currency === 'USD' ? '$250,000' : 
                          settings.theme.currency === 'EUR' ? '€230,000' :
                          settings.theme.currency === 'GBP' ? '£200,000' :
                          settings.theme.currency === 'JPY' ? '¥35,000,000' :
                          `${settings.theme.currency} 250,000`}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          This preview updates in real-time as you change your preferences.
        </p>
      </div>
    </div>
  );
}