import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { TeamMember, TeamRole } from './team-permissions';

export interface TeamMetrics {
  // Core team metrics
  totalMembers: number;
  activeMembers: number;
  membersByRole: Record<TeamRole, number>;
  avgTenure: number; // in months
  teamCohesion: number; // 0-100 score
  
  // Performance metrics
  liftoutSuccessRate: number; // percentage
  totalLiftouts: number;
  avgLiftoutValue: number; // in USD
  lastLiftoutDate?: Date;
  
  // Growth metrics
  memberGrowthRate: number; // percentage change
  profileViews: number;
  expressionsOfInterest: number;
  opportunityResponseRate: number;
  
  // Engagement metrics
  lastActivityDate: Date;
  communicationScore: number; // 0-100
  collaborationRating: number; // 1-5 stars
  clientSatisfaction: number; // 1-5 stars
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
  compensation: {
    min: number;
    max: number;
    currency: string;
    type: 'salary' | 'total_package' | 'equity';
  };
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

class TeamAnalyticsService {
  private readonly ANALYTICS_COLLECTION = 'team_analytics';
  private readonly PERFORMANCE_HISTORY_COLLECTION = 'team_performance_history';
  private readonly OPPORTUNITIES_COLLECTION = 'liftout_opportunities';

  /**
   * Get comprehensive team analytics
   */
  async getTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
    try {
      const [metrics, history, opportunities] = await Promise.all([
        this.getTeamMetrics(teamId),
        this.getPerformanceHistory(teamId),
        this.getTeamOpportunities(teamId)
      ]);

      const trends = this.calculateTrends(history, opportunities);
      const benchmarks = await this.getBenchmarks(teamId, metrics);

      return {
        teamId,
        metrics,
        performanceHistory: history,
        trends,
        benchmarks
      };
    } catch (error) {
      console.error('Error getting team analytics:', error);
      throw error;
    }
  }

  /**
   * Get current team metrics
   */
  async getTeamMetrics(teamId: string): Promise<TeamMetrics> {
    try {
      // Get team members
      const membersQuery = query(
        collection(db, 'team_members'),
        where('teamId', '==', teamId),
        where('isActive', '==', true)
      );
      const membersSnapshot = await getDocs(membersQuery);
      const members = membersSnapshot.docs.map(doc => doc.data() as TeamMember);

      // Calculate basic metrics
      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.isActive).length;
      
      const membersByRole: Record<TeamRole, number> = {
        leader: 0,
        admin: 0,
        member: 0
      };
      
      members.forEach(member => {
        membersByRole[member.role]++;
      });

      // Calculate average tenure
      const now = new Date();
      const tenures = members.map(member => {
        const joinedAt = new Date(member.joinedAt);
        return (now.getTime() - joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 30); // months
      });
      const avgTenure = tenures.length > 0 ? tenures.reduce((a, b) => a + b, 0) / tenures.length : 0;

      // Get performance metrics (mock data for now)
      const metrics: TeamMetrics = {
        totalMembers,
        activeMembers,
        membersByRole,
        avgTenure,
        teamCohesion: this.calculateTeamCohesion(members),
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
        clientSatisfaction: 4.5
      };

      return metrics;
    } catch (error) {
      console.error('Error getting team metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate team cohesion score based on tenure and role distribution
   */
  private calculateTeamCohesion(members: TeamMember[]): number {
    if (members.length === 0) return 0;

    // Factors: average tenure, role balance, team size
    const avgTenureMonths = members.reduce((sum, member) => {
      const months = (new Date().getTime() - new Date(member.joinedAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return sum + months;
    }, 0) / members.length;

    // Higher cohesion for teams that have worked together longer
    const tenureScore = Math.min(avgTenureMonths / 24, 1) * 40; // Max 40 points for 2+ years

    // Role balance score (diversity but not too fragmented)
    const roleDistribution = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const roles = Object.keys(roleDistribution).length;
    const balanceScore = roles > 1 ? 30 : 20; // Bonus for role diversity

    // Team size score (not too small, not too large)
    const sizeScore = members.length >= 3 && members.length <= 8 ? 30 : 20;

    return Math.min(tenureScore + balanceScore + sizeScore, 100);
  }

  /**
   * Get performance history for a team
   */
  async getPerformanceHistory(teamId: string, limitCount: number = 50): Promise<PerformanceHistory[]> {
    try {
      const q = query(
        collection(db, this.PERFORMANCE_HISTORY_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('recordedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PerformanceHistory[];
    } catch (error) {
      console.error('Error getting performance history:', error);
      return [];
    }
  }

  /**
   * Get team opportunities
   */
  async getTeamOpportunities(teamId: string): Promise<LiftoutOpportunity[]> {
    try {
      const q = query(
        collection(db, this.OPPORTUNITIES_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('postedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LiftoutOpportunity[];
    } catch (error) {
      console.error('Error getting opportunities:', error);
      return [];
    }
  }

  /**
   * Calculate trends from historical data
   */
  private calculateTrends(
    history: PerformanceHistory[], 
    opportunities: LiftoutOpportunity[]
  ) {
    // Generate mock trends for demonstration
    return {
      memberGrowth: [
        { period: '2024-Q1', change: 12.5 },
        { period: '2024-Q2', change: 18.3 },
        { period: '2024-Q3', change: 15.8 },
        { period: '2024-Q4', change: 22.1 }
      ],
      liftoutPerformance: [
        { period: '2024-Q1', count: 2, value: 180000 },
        { period: '2024-Q2', count: 4, value: 340000 },
        { period: '2024-Q3', count: 3, value: 275000 },
        { period: '2024-Q4', count: 3, value: 290000 }
      ],
      engagementTrends: [
        { period: '2024-Q1', views: 892, interest: 15 },
        { period: '2024-Q2', views: 1024, interest: 19 },
        { period: '2024-Q3', views: 1156, interest: 21 },
        { period: '2024-Q4', views: 1247, interest: 23 }
      ]
    };
  }

  /**
   * Get industry benchmarks
   */
  private async getBenchmarks(teamId: string, metrics: TeamMetrics): Promise<TeamAnalytics['benchmarks']> {
    // Mock benchmark data - in production, this would come from aggregated data
    return {
      industryAverage: {
        liftoutSuccessRate: 68.4,
        avgLiftoutValue: 195000,
        teamCohesion: 72.3,
        collaborationRating: 4.1,
        clientSatisfaction: 4.2
      },
      topPerformers: {
        liftoutSuccessRate: 94.7,
        avgLiftoutValue: 385000,
        teamCohesion: 91.8,
        collaborationRating: 4.9,
        clientSatisfaction: 4.8
      },
      similarTeams: {
        liftoutSuccessRate: 73.2,
        avgLiftoutValue: 220000,
        teamCohesion: 76.5,
        collaborationRating: 4.3,
        clientSatisfaction: 4.4
      }
    };
  }

  /**
   * Record a performance event
   */
  async recordPerformance(
    teamId: string,
    metricType: PerformanceHistory['metricType'],
    value: number,
    description: string,
    recordedBy: string
  ): Promise<string> {
    try {
      const performance: Omit<PerformanceHistory, 'id'> = {
        teamId,
        metricType,
        value,
        description,
        recordedAt: new Date(),
        recordedBy
      };

      const docRef = await addDoc(collection(db, this.PERFORMANCE_HISTORY_COLLECTION), {
        ...performance,
        recordedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error recording performance:', error);
      throw error;
    }
  }

  /**
   * Get team benchmarks compared to industry
   */
  async getTeamBenchmarks(teamId: string): Promise<TeamBenchmark[]> {
    try {
      const metrics = await this.getTeamMetrics(teamId);
      const { industryAverage, topPerformers } = await this.getBenchmarks(teamId, metrics);

      const benchmarks: TeamBenchmark[] = [
        {
          metric: 'liftoutSuccessRate',
          value: metrics.liftoutSuccessRate,
          industryAverage: industryAverage.liftoutSuccessRate || 0,
          topPerformer: topPerformers.liftoutSuccessRate || 0,
          percentile: this.calculatePercentile(metrics.liftoutSuccessRate, 68.4),
          trend: 'improving'
        },
        {
          metric: 'avgLiftoutValue',
          value: metrics.avgLiftoutValue,
          industryAverage: industryAverage.avgLiftoutValue || 0,
          topPerformer: topPerformers.avgLiftoutValue || 0,
          percentile: this.calculatePercentile(metrics.avgLiftoutValue, 195000),
          trend: 'stable'
        },
        {
          metric: 'teamCohesion',
          value: metrics.teamCohesion,
          industryAverage: industryAverage.teamCohesion || 0,
          topPerformer: topPerformers.teamCohesion || 0,
          percentile: this.calculatePercentile(metrics.teamCohesion, 72.3),
          trend: 'improving'
        }
      ];

      return benchmarks;
    } catch (error) {
      console.error('Error getting benchmarks:', error);
      throw error;
    }
  }

  /**
   * Calculate percentile ranking
   */
  private calculatePercentile(value: number, average: number): number {
    // Simplified percentile calculation
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