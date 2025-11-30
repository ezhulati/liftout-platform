import { TeamPermissionMember, TeamRole } from './team-permissions';

export interface TeamMetrics {
  totalMembers: number;
  activeMembers: number;
  membersByRole: Record<TeamRole, number>;
  avgTenure: number;
  teamCohesion: number;
  liftoutSuccessRate: number;
  totalLiftouts: number;
  avgLiftoutValue: number;
  lastLiftoutDate?: Date;
  memberGrowthRate: number;
  profileViews: number;
  expressionsOfInterest: number;
  opportunityResponseRate: number;
  lastActivityDate: Date;
  communicationScore: number;
  collaborationRating: number;
  clientSatisfaction: number;
}

export interface PerformanceHistory {
  id?: string;
  teamId: string;
  metricType: 'liftout' | 'project' | 'client_feedback' | 'team_growth';
  value: number;
  description: string;
  recordedAt: Date;
  recordedBy: string;
}

export interface TeamAnalytics {
  teamId: string;
  metrics: TeamMetrics;
  performanceHistory: PerformanceHistory[];
  trends: {
    memberGrowth: { period: string; change: number }[];
    liftoutPerformance: { period: string; count: number; value: number }[];
    engagementTrends: { period: string; views: number; interest: number }[];
  };
  benchmarks: {
    industryAverage: Partial<TeamMetrics>;
    topPerformers: Partial<TeamMetrics>;
    similarTeams: Partial<TeamMetrics>;
  };
}

export interface LiftoutOpportunity {
  id?: string;
  teamId: string;
  companyName: string;
  position: string;
  compensation: { min: number; max: number; currency: string; type: 'salary' | 'total_package' | 'equity' };
  status: 'active' | 'interested' | 'in_negotiation' | 'declined' | 'completed';
  postedAt: Date;
  expiresAt: Date;
  location: string;
  remote: boolean;
  liftoutType: 'expansion' | 'capability_building' | 'market_entry' | 'acquisition';
  requirements: string[];
  teamSize: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

export interface TeamBenchmark {
  metric: keyof TeamMetrics;
  value: number;
  industryAverage: number;
  topPerformer: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
}

const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id === 'demo@example.com' || id === 'company@example.com';
};

const DEMO_METRICS: TeamMetrics = {
  totalMembers: 4,
  activeMembers: 4,
  membersByRole: { leader: 1, admin: 0, member: 3 },
  avgTenure: 28,
  teamCohesion: 87,
  liftoutSuccessRate: 85.2,
  totalLiftouts: 12,
  avgLiftoutValue: 245000,
  lastLiftoutDate: new Date('2024-08-15'),
  memberGrowthRate: 15.8,
  profileViews: 1247,
  expressionsOfInterest: 23,
  opportunityResponseRate: 78.5,
  lastActivityDate: new Date(),
  communicationScore: 92,
  collaborationRating: 4.7,
  clientSatisfaction: 4.5,
};

const DEMO_TRENDS = {
  memberGrowth: [
    { period: '2024-Q1', change: 12.5 },
    { period: '2024-Q2', change: 18.3 },
    { period: '2024-Q3', change: 15.8 },
    { period: '2024-Q4', change: 22.1 },
  ],
  liftoutPerformance: [
    { period: '2024-Q1', count: 2, value: 180000 },
    { period: '2024-Q2', count: 4, value: 340000 },
    { period: '2024-Q3', count: 3, value: 275000 },
    { period: '2024-Q4', count: 3, value: 290000 },
  ],
  engagementTrends: [
    { period: '2024-Q1', views: 892, interest: 15 },
    { period: '2024-Q2', views: 1024, interest: 19 },
    { period: '2024-Q3', views: 1156, interest: 21 },
    { period: '2024-Q4', views: 1247, interest: 23 },
  ],
};

const DEMO_BENCHMARKS = {
  industryAverage: { liftoutSuccessRate: 68.4, avgLiftoutValue: 195000, teamCohesion: 72.3, collaborationRating: 4.1, clientSatisfaction: 4.2 },
  topPerformers: { liftoutSuccessRate: 94.7, avgLiftoutValue: 385000, teamCohesion: 91.8, collaborationRating: 4.9, clientSatisfaction: 4.8 },
  similarTeams: { liftoutSuccessRate: 73.2, avgLiftoutValue: 220000, teamCohesion: 76.5, collaborationRating: 4.3, clientSatisfaction: 4.4 },
};

class TeamAnalyticsService {
  async getTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
    if (isDemoEntity(teamId)) {
      return { teamId, metrics: DEMO_METRICS, performanceHistory: [], trends: DEMO_TRENDS, benchmarks: DEMO_BENCHMARKS };
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/analytics`);
      if (!response.ok) throw new Error('Failed to get team analytics');
      const result = await response.json();
      return result.analytics || result.data || { teamId, metrics: DEMO_METRICS, performanceHistory: [], trends: DEMO_TRENDS, benchmarks: DEMO_BENCHMARKS };
    } catch (error) {
      console.error('Error getting team analytics:', error);
      return { teamId, metrics: DEMO_METRICS, performanceHistory: [], trends: DEMO_TRENDS, benchmarks: DEMO_BENCHMARKS };
    }
  }

  async getTeamMetrics(teamId: string): Promise<TeamMetrics> {
    if (isDemoEntity(teamId)) return DEMO_METRICS;

    try {
      const response = await fetch(`/api/teams/${teamId}/metrics`);
      if (!response.ok) return DEMO_METRICS;
      const result = await response.json();
      return result.metrics || result.data || DEMO_METRICS;
    } catch (error) {
      console.error('Error getting team metrics:', error);
      return DEMO_METRICS;
    }
  }

  calculateTeamCohesion(members: TeamPermissionMember[]): number {
    if (members.length === 0) return 0;
    const avgTenureMonths = members.reduce((sum, member) => {
      const joinedAt = typeof member.joinedAt === 'string' ? new Date(member.joinedAt) : member.joinedAt;
      const months = (new Date().getTime() - joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return sum + months;
    }, 0) / members.length;
    const tenureScore = Math.min(avgTenureMonths / 24, 1) * 40;
    const roles = new Set(members.map(m => m.role)).size;
    const balanceScore = roles > 1 ? 30 : 20;
    const sizeScore = members.length >= 3 && members.length <= 8 ? 30 : 20;
    return Math.min(tenureScore + balanceScore + sizeScore, 100);
  }

  async getPerformanceHistory(teamId: string, limitCount: number = 50): Promise<PerformanceHistory[]> {
    if (isDemoEntity(teamId)) return [];

    try {
      const response = await fetch(`/api/teams/${teamId}/performance-history?limit=${limitCount}`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.history || result.data || [];
    } catch (error) {
      console.error('Error getting performance history:', error);
      return [];
    }
  }

  async getTeamOpportunities(teamId: string): Promise<LiftoutOpportunity[]> {
    if (isDemoEntity(teamId)) return [];

    try {
      const response = await fetch(`/api/teams/${teamId}/opportunities`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.opportunities || result.data || [];
    } catch (error) {
      console.error('Error getting opportunities:', error);
      return [];
    }
  }

  async recordPerformance(teamId: string, metricType: PerformanceHistory['metricType'], value: number, description: string, recordedBy: string): Promise<string> {
    if (isDemoEntity(teamId)) {
      console.log(`[Demo] Recording performance: ${metricType} = ${value}`);
      return `demo-perf-${Date.now()}`;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metricType, value, description, recordedBy }),
      });
      if (!response.ok) throw new Error('Failed to record performance');
      const result = await response.json();
      return result.id || result.data?.id || '';
    } catch (error) {
      console.error('Error recording performance:', error);
      throw error;
    }
  }

  async getTeamBenchmarks(teamId: string): Promise<TeamBenchmark[]> {
    const metrics = await this.getTeamMetrics(teamId);
    return [
      { metric: 'liftoutSuccessRate', value: metrics.liftoutSuccessRate, industryAverage: 68.4, topPerformer: 94.7, percentile: this.calculatePercentile(metrics.liftoutSuccessRate, 68.4), trend: 'improving' },
      { metric: 'avgLiftoutValue', value: metrics.avgLiftoutValue, industryAverage: 195000, topPerformer: 385000, percentile: this.calculatePercentile(metrics.avgLiftoutValue, 195000), trend: 'stable' },
      { metric: 'teamCohesion', value: metrics.teamCohesion, industryAverage: 72.3, topPerformer: 91.8, percentile: this.calculatePercentile(metrics.teamCohesion, 72.3), trend: 'improving' },
    ];
  }

  private calculatePercentile(value: number, average: number): number {
    const ratio = value / average;
    if (ratio >= 1.5) return 95;
    if (ratio >= 1.3) return 90;
    if (ratio >= 1.2) return 85;
    if (ratio >= 1.1) return 75;
    if (ratio >= 1.0) return 65;
    if (ratio >= 0.9) return 50;
    if (ratio >= 0.8) return 35;
    if (ratio >= 0.7) return 25;
    return 15;
  }
}

export const teamAnalyticsService = new TeamAnalyticsService();
