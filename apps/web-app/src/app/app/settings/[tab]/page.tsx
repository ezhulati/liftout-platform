'use client';

import { useParams, notFound } from 'next/navigation';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { DataManagementSettings } from '@/components/settings/DataManagementSettings';
import { BillingSettings } from '@/components/settings/BillingSettings';

const tabComponents: Record<string, React.ComponentType> = {
  profile: ProfileSettings,
  notifications: NotificationSettings,
  privacy: PrivacySettings,
  security: SecuritySettings,
  theme: ThemeSettings,
  data: DataManagementSettings,
  billing: BillingSettings,
  account: AccountSettings,
};

export default function SettingsTabPage() {
  const params = useParams();
  const tab = params?.tab as string;

  const Component = tabComponents[tab];

  if (!Component) {
    notFound();
  }

  return <Component />;
}
