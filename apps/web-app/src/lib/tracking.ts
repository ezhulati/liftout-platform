/**
 * Analytics event tracking utilities
 * Provides type-safe tracking for user actions across the platform
 */

// Declare gtag as a global function
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom event with Google Analytics
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track a page view (for client-side navigation)
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-2X9H3CR9V3', {
      page_path: url,
      page_title: title,
    });
  }
}

/**
 * Standard event types for the platform
 */
export const Events = {
  // Authentication events
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',

  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Team events
  TEAM_CREATED: 'team_created',
  TEAM_MEMBER_INVITED: 'team_member_invited',
  TEAM_PROFILE_UPDATED: 'team_profile_updated',
  TEAM_VIEWED: 'team_viewed',

  // Opportunity events
  OPPORTUNITY_CREATED: 'opportunity_created',
  OPPORTUNITY_VIEWED: 'opportunity_viewed',
  OPPORTUNITY_APPLIED: 'opportunity_applied',

  // Application events
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_STATUS_CHANGED: 'application_status_changed',
  EOI_SENT: 'eoi_sent',
  EOI_RESPONDED: 'eoi_responded',

  // Messaging events
  CONVERSATION_STARTED: 'conversation_started',
  MESSAGE_SENT: 'message_sent',

  // Search events
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_RESULT_CLICKED: 'search_result_clicked',

  // Document events
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_VIEWED: 'document_viewed',

  // Engagement events
  CTA_CLICKED: 'cta_clicked',
  FEATURE_USED: 'feature_used',
} as const;

/**
 * Track authentication events
 */
export function trackAuth(action: 'sign_up' | 'sign_in' | 'sign_out', userType?: string): void {
  trackEvent(action, { user_type: userType || 'unknown' });
}

/**
 * Track onboarding progress
 */
export function trackOnboarding(
  action: 'started' | 'step_completed' | 'completed',
  step?: string,
  userType?: string
): void {
  const eventName =
    action === 'started'
      ? Events.ONBOARDING_STARTED
      : action === 'step_completed'
        ? Events.ONBOARDING_STEP_COMPLETED
        : Events.ONBOARDING_COMPLETED;

  trackEvent(eventName, {
    step: step || '',
    user_type: userType || 'unknown',
  });
}

/**
 * Track team-related actions
 */
export function trackTeam(
  action: 'created' | 'member_invited' | 'profile_updated' | 'viewed',
  teamId?: string,
  additionalParams?: Record<string, string | number>
): void {
  const eventMap = {
    created: Events.TEAM_CREATED,
    member_invited: Events.TEAM_MEMBER_INVITED,
    profile_updated: Events.TEAM_PROFILE_UPDATED,
    viewed: Events.TEAM_VIEWED,
  };

  trackEvent(eventMap[action], {
    team_id: teamId || '',
    ...additionalParams,
  });
}

/**
 * Track opportunity-related actions
 */
export function trackOpportunity(
  action: 'created' | 'viewed' | 'applied',
  opportunityId?: string,
  additionalParams?: Record<string, string | number>
): void {
  const eventMap = {
    created: Events.OPPORTUNITY_CREATED,
    viewed: Events.OPPORTUNITY_VIEWED,
    applied: Events.OPPORTUNITY_APPLIED,
  };

  trackEvent(eventMap[action], {
    opportunity_id: opportunityId || '',
    ...additionalParams,
  });
}

/**
 * Track search actions
 */
export function trackSearch(query: string, resultsCount: number, filters?: string): void {
  trackEvent(Events.SEARCH_PERFORMED, {
    search_term: query,
    results_count: resultsCount,
    filters: filters || '',
  });
}

/**
 * Track CTA clicks
 */
export function trackCTA(ctaName: string, location: string): void {
  trackEvent(Events.CTA_CLICKED, {
    cta_name: ctaName,
    location,
  });
}

/**
 * Track feature usage
 */
export function trackFeature(featureName: string, action?: string): void {
  trackEvent(Events.FEATURE_USED, {
    feature_name: featureName,
    action: action || 'used',
  });
}

/**
 * Set user properties for analytics
 */
export function setUserProperties(properties: {
  userId?: string;
  userType?: string;
  companyId?: string;
  teamId?: string;
}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }

  // Also set for Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    if (properties.userId) {
      window.clarity('identify', properties.userId);
    }
    Object.entries(properties).forEach(([key, value]) => {
      if (value) {
        window.clarity?.('set', key, value);
      }
    });
  }
}
