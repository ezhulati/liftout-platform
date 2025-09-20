// Demo mode configuration
export const DEMO_CONFIG = {
  // Demo mode - set to false for production
  enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development',
  
  // Demo branding
  branding: {
    showDemoBanner: true,
    demoTitle: 'Liftout Demo',
    demoSubtitle: 'Explore team-based hiring in action',
    watermark: 'DEMO',
  },

  // Demo user accounts
  accounts: {
    individual: {
      email: 'demo@example.com',
      password: 'password',
      name: 'Alex Johnson',
      type: 'individual' as const,
    },
    company: {
      email: 'company@example.com', 
      password: 'password',
      name: 'Sarah Chen',
      type: 'company' as const,
    },
    teamLead: {
      email: 'team.lead@example.com',
      password: 'password', 
      name: 'Michael Rodriguez',
      type: 'individual' as const,
    },
  },

  // Demo data settings
  data: {
    resetInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxDemoUsers: 100,
    maxDemoTeams: 50,
    maxDemoOpportunities: 30,
    enableRealTimeDemo: true,
  },

  // Demo features
  features: {
    showTutorial: true,
    enableGuidedTour: true,
    showMetrics: true,
    enableAutoActions: false, // Auto-create sample interactions
    showcaseMode: false, // Full screen demo mode
  },

  // Demo limitations
  limitations: {
    maxTeamSize: 10,
    maxApplications: 5,
    maxMessages: 50,
    disableEmailNotifications: true,
    disableRealPayments: true,
  },
};

// Demo mode utilities
export const isDemoMode = () => DEMO_CONFIG.enabled;

export const getDemoAccount = (type: 'individual' | 'company' | 'teamLead') => {
  return DEMO_CONFIG.accounts[type];
};

export const isDemoUser = (email: string) => {
  return Object.values(DEMO_CONFIG.accounts).some(account => account.email === email);
};

export const getDemoLimitations = () => DEMO_CONFIG.limitations;

export const shouldShowDemoBanner = () => {
  return DEMO_CONFIG.enabled && DEMO_CONFIG.branding.showDemoBanner;
};

// Demo data identifiers
export const DEMO_IDENTIFIERS = {
  userPrefix: 'demo_',
  teamPrefix: 'demo_team_',
  opportunityPrefix: 'demo_opp_',
  messagePrefix: 'demo_msg_',
} as const;

export const isDemoEntity = (id: string, type: keyof typeof DEMO_IDENTIFIERS) => {
  return id.startsWith(DEMO_IDENTIFIERS[`${type}Prefix`]);
};

// Demo analytics
export const DEMO_ANALYTICS = {
  trackDemoInteractions: true,
  demoSessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxDemoSessions: 1000,
};