import { teamService } from './teamService';
import { opportunityService } from './opportunityService';
import type { TeamProfile } from '@/types/teams';
import type { Opportunity } from '@/types/firebase';

export interface MatchScore {
  total: number; // 0-100
  breakdown: {
    skillsMatch: number;      // 0-25 points
    industryMatch: number;    // 0-20 points  
    experienceMatch: number;  // 0-15 points
    locationMatch: number;    // 0-10 points
    compensationMatch: number; // 0-15 points
    cultureMatch: number;     // 0-10 points
    availabilityMatch: number; // 0-5 points
  };
  reasoning: string[];
}

export interface TeamOpportunityMatch {
  team: TeamProfile;
  opportunity: Opportunity;
  score: MatchScore;
  recommendation: 'excellent' | 'good' | 'fair' | 'poor';
  keyStrengths: string[];
  potentialConcerns: string[];
}

export interface MatchingFilters {
  minScore?: number;
  maxResults?: number;
  industryPreference?: string[];
  locationPreference?: string[];
  teamSizeRange?: { min: number; max: number };
  compensationRange?: { min: number; max: number; currency: string };
}

export class MatchingService {
  
  // Find best team matches for an opportunity
  async findTeamsForOpportunity(
    opportunityId: string, 
    filters?: MatchingFilters
  ): Promise<TeamOpportunityMatch[]> {
    try {
      const opportunity = await opportunityService.getOpportunityById(opportunityId);
      if (!opportunity) {
        throw new Error('Opportunity not found');
      }

      // Get all available teams
      const teamsResult = await teamService.searchTeams({
        availability: 'available',
        verified: true,
      });

      const matches = teamsResult.teams.map(team => {
        const score = this.calculateMatch(team, opportunity);
        return {
          team,
          opportunity,
          score,
          recommendation: this.getRecommendation(score.total),
          keyStrengths: this.extractStrengths(team, opportunity, score),
          potentialConcerns: this.extractConcerns(team, opportunity, score),
        };
      });

      // Apply filters
      let filteredMatches = matches;
      
      if (filters?.minScore) {
        filteredMatches = filteredMatches.filter(match => match.score.total >= filters.minScore!);
      }

      if (filters?.teamSizeRange) {
        filteredMatches = filteredMatches.filter(match => 
          match.team.size >= filters.teamSizeRange!.min && 
          match.team.size <= filters.teamSizeRange!.max
        );
      }

      if (filters?.compensationRange) {
        filteredMatches = filteredMatches.filter(match => {
          const teamExpectation = match.team.compensationExpectations?.totalTeamValue;
          const filterRange = filters.compensationRange!;
          
          if (!teamExpectation) return true;
          
          // Skip currency check for now (would need to convert in real app)
          
          return teamExpectation.min <= filterRange.max && teamExpectation.max >= filterRange.min;
        });
      }

      // Sort by score descending
      filteredMatches.sort((a, b) => b.score.total - a.score.total);

      if (filters?.maxResults) {
        filteredMatches = filteredMatches.slice(0, filters.maxResults);
      }

      return filteredMatches;
    } catch (error) {
      console.error('Error finding teams for opportunity:', error);
      throw new Error('Failed to find matching teams');
    }
  }

  // Find best opportunity matches for a team
  async findOpportunitiesForTeam(
    teamId: string,
    filters?: MatchingFilters
  ): Promise<TeamOpportunityMatch[]> {
    try {
      const team = await teamService.getTeamById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Get all active opportunities
      const opportunitiesResult = await opportunityService.searchOpportunities({
        status: 'active',
      });

      const matches = opportunitiesResult.opportunities.map(opportunity => {
        const score = this.calculateMatch(team, opportunity);
        return {
          team,
          opportunity,
          score,
          recommendation: this.getRecommendation(score.total),
          keyStrengths: this.extractStrengths(team, opportunity, score),
          potentialConcerns: this.extractConcerns(team, opportunity, score),
        };
      });

      // Apply filters and sort
      let filteredMatches = matches;
      
      if (filters?.minScore) {
        filteredMatches = filteredMatches.filter(match => match.score.total >= filters.minScore!);
      }

      if (filters?.industryPreference) {
        filteredMatches = filteredMatches.filter(match =>
          filters.industryPreference!.some(industry =>
            match.opportunity.industry.includes(industry)
          )
        );
      }

      filteredMatches.sort((a, b) => b.score.total - a.score.total);

      if (filters?.maxResults) {
        filteredMatches = filteredMatches.slice(0, filters.maxResults);
      }

      return filteredMatches;
    } catch (error) {
      console.error('Error finding opportunities for team:', error);
      throw new Error('Failed to find matching opportunities');
    }
  }

  // Calculate compatibility score between team and opportunity
  private calculateMatch(team: TeamProfile, opportunity: Opportunity): MatchScore {
    const breakdown = {
      skillsMatch: this.calculateSkillsMatch(team, opportunity),
      industryMatch: this.calculateIndustryMatch(team, opportunity),
      experienceMatch: this.calculateExperienceMatch(team, opportunity),
      locationMatch: this.calculateLocationMatch(team, opportunity),
      compensationMatch: this.calculateCompensationMatch(team, opportunity),
      cultureMatch: this.calculateCultureMatch(team, opportunity),
      availabilityMatch: this.calculateAvailabilityMatch(team, opportunity),
    };

    const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
    
    const reasoning = this.generateReasoning(team, opportunity, breakdown);

    return {
      total: Math.round(total),
      breakdown,
      reasoning,
    };
  }

  private calculateSkillsMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 25;
    
    if (!opportunity.skills?.length) return maxScore * 0.5; // Default if no requirements
    
    const teamSkills = team.specializations?.map(s => s.toLowerCase()) || [];
    const requiredSkills = opportunity.skills.map(s => s.toLowerCase());
    
    const matchedSkills = requiredSkills.filter(skill =>
      teamSkills.some(teamSkill => 
        teamSkill.includes(skill) || skill.includes(teamSkill)
      )
    );
    
    const matchRatio = matchedSkills.length / requiredSkills.length;
    return Math.round(matchRatio * maxScore);
  }

  private calculateIndustryMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 20;
    
    const teamIndustries = team.industry.map(i => i.toLowerCase());
    const oppIndustries = opportunity.industry.map(i => i.toLowerCase());
    
    const hasExactMatch = teamIndustries.some(ti => oppIndustries.includes(ti));
    if (hasExactMatch) return maxScore;
    
    // Check for related industries (simplified)
    const relatedMatches = teamIndustries.some(ti =>
      oppIndustries.some(oi => 
        (ti.includes('financial') && oi.includes('financial')) ||
        (ti.includes('tech') && oi.includes('tech')) ||
        (ti.includes('healthcare') && oi.includes('healthcare'))
      )
    );
    
    return relatedMatches ? Math.round(maxScore * 0.7) : Math.round(maxScore * 0.3);
  }

  private calculateExperienceMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 15;
    
    const teamExperience = team.dynamics.yearsWorkingTogether;
    const teamCohesion = team.dynamics.cohesionScore || 5;
    
    // Higher score for more experienced, cohesive teams
    const experienceScore = Math.min(teamExperience / 3 * 0.6, 0.6); // Max 60% for experience
    const cohesionScore = (teamCohesion / 10) * 0.4; // Max 40% for cohesion
    
    return Math.round((experienceScore + cohesionScore) * maxScore);
  }

  private calculateLocationMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 10;
    
    // Perfect match for same location or both remote
    if (team.location.primary === opportunity.location || 
        (team.location.remote && opportunity.remotePolicy === 'remote')) {
      return maxScore;
    }
    
    // Good match for hybrid arrangements
    if (opportunity.remotePolicy === 'hybrid' && team.location.remote) {
      return Math.round(maxScore * 0.8);
    }
    
    // Partial match for different locations but remote-friendly
    if (team.location.remote || opportunity.remotePolicy !== 'onsite') {
      return Math.round(maxScore * 0.6);
    }
    
    return Math.round(maxScore * 0.2);
  }

  private calculateCompensationMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 15;
    
    if (!team.compensationExpectations || !opportunity.compensation) {
      return Math.round(maxScore * 0.5); // Default score if data missing
    }
    
    const teamMin = team.compensationExpectations.totalTeamValue.min;
    const teamMax = team.compensationExpectations.totalTeamValue.max;
    const oppBudget = opportunity.compensation.total || 
                     (opportunity.compensation.max * team.size);
    
    if (oppBudget >= teamMax) return maxScore; // Opportunity exceeds expectations
    if (oppBudget >= teamMin) return Math.round(maxScore * 0.8); // Within range
    if (oppBudget >= teamMin * 0.8) return Math.round(maxScore * 0.5); // Close to range
    
    return Math.round(maxScore * 0.2); // Below expectations
  }

  private calculateCultureMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 10;
    
    // Simplified culture matching based on values and work style
    let score = maxScore * 0.5; // Base score
    
    // Match work arrangement preferences
    if (team.dynamics.preferredWorkArrangement === 'remote' && 
        opportunity.remotePolicy === 'remote') {
      score += maxScore * 0.3;
    } else if (team.dynamics.preferredWorkArrangement === 'hybrid' && 
               opportunity.remotePolicy === 'hybrid') {
      score += maxScore * 0.2;
    }
    
    // Bonus for company culture alignment (simplified)
    if (opportunity.culture?.values?.length) {
      const valueMatches = team.values.filter(tv =>
        opportunity.culture!.values!.some(ov =>
          tv.toLowerCase().includes(ov.toLowerCase()) ||
          ov.toLowerCase().includes(tv.toLowerCase())
        )
      );
      score += (valueMatches.length / Math.max(team.values.length, 1)) * maxScore * 0.2;
    }
    
    return Math.round(Math.min(score, maxScore));
  }

  private calculateAvailabilityMatch(team: TeamProfile, opportunity: Opportunity): number {
    const maxScore = 5;
    
    if (team.availability.status === 'available') return maxScore;
    if (team.availability.status === 'selective') return Math.round(maxScore * 0.7);
    return 0; // not_available
  }

  private generateReasoning(
    team: TeamProfile, 
    opportunity: Opportunity, 
    breakdown: MatchScore['breakdown']
  ): string[] {
    const reasoning: string[] = [];
    
    if (breakdown.skillsMatch >= 20) {
      reasoning.push(`Strong skills alignment with ${breakdown.skillsMatch}/25 match score`);
    } else if (breakdown.skillsMatch >= 15) {
      reasoning.push(`Good skills overlap with room for growth`);
    } else {
      reasoning.push(`Limited skills match may require additional training`);
    }
    
    if (breakdown.industryMatch >= 16) {
      reasoning.push(`Excellent industry experience in ${team.industry.join(', ')}`);
    } else if (breakdown.industryMatch >= 10) {
      reasoning.push(`Related industry experience provides good foundation`);
    }
    
    if (breakdown.experienceMatch >= 12) {
      reasoning.push(`Highly experienced team with ${team.dynamics.yearsWorkingTogether} years working together`);
    }
    
    if (breakdown.compensationMatch <= 8) {
      reasoning.push(`Compensation expectations may exceed current budget`);
    }
    
    if (breakdown.locationMatch <= 5) {
      reasoning.push(`Location mismatch may require relocation or remote work arrangement`);
    }
    
    return reasoning;
  }

  private extractStrengths(
    team: TeamProfile, 
    opportunity: Opportunity, 
    score: MatchScore
  ): string[] {
    const strengths: string[] = [];
    
    if (score.breakdown.skillsMatch >= 20) {
      strengths.push('Exceptional skills match');
    }
    
    if (score.breakdown.industryMatch >= 16) {
      strengths.push('Deep industry expertise');
    }
    
    if (score.breakdown.experienceMatch >= 12) {
      strengths.push('Proven team cohesion and track record');
    }
    
    if (team.verification.status === 'verified') {
      strengths.push('Fully verified team credentials');
    }
    
    if (team.liftoutHistory.previousLiftouts.length > 0) {
      strengths.push('Previous successful liftout experience');
    }
    
    if (team.performanceMetrics.successRate >= 90) {
      strengths.push('Outstanding historical performance');
    }
    
    return strengths;
  }

  private extractConcerns(
    team: TeamProfile, 
    opportunity: Opportunity, 
    score: MatchScore
  ): string[] {
    const concerns: string[] = [];
    
    if (score.breakdown.skillsMatch <= 10) {
      concerns.push('Significant skills gap requiring training');
    }
    
    if (score.breakdown.compensationMatch <= 8) {
      concerns.push('Budget constraints may impact negotiation');
    }
    
    if (score.breakdown.locationMatch <= 5) {
      concerns.push('Geographic constraints require attention');
    }
    
    if (team.verification.status !== 'verified') {
      concerns.push('Team verification still pending');
    }
    
    if (team.dynamics.yearsWorkingTogether < 1) {
      concerns.push('Limited shared working history');
    }
    
    if (team.liftoutHistory.nonCompeteRestrictions?.hasRestrictions) {
      concerns.push('Non-compete restrictions may apply');
    }
    
    return concerns;
  }

  private getRecommendation(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    return 'poor';
  }

  // Get team recommendations for company dashboard
  async getRecommendedTeams(
    companyUserId: string,
    limit = 10
  ): Promise<TeamProfile[]> {
    try {
      // Get company's recent opportunities to understand preferences
      const companyOpportunities = await opportunityService.searchOpportunities({
        companyId: companyUserId,
        limit: 5,
      });

      if (companyOpportunities.opportunities.length === 0) {
        // No opportunities yet, return featured teams
        return await teamService.getFeaturedTeams(limit);
      }

      // Use most recent opportunity as basis for recommendations
      const latestOpportunity = companyOpportunities.opportunities[0];
      const matches = await this.findTeamsForOpportunity(latestOpportunity.id, {
        maxResults: limit,
        minScore: 60,
      });

      return matches.map(match => match.team);
    } catch (error) {
      console.error('Error getting recommended teams:', error);
      // Fallback to featured teams
      return await teamService.getFeaturedTeams(limit);
    }
  }

  // Get opportunity recommendations for team dashboard  
  async getRecommendedOpportunities(
    teamId: string,
    limit = 10
  ): Promise<Opportunity[]> {
    try {
      const matches = await this.findOpportunitiesForTeam(teamId, {
        maxResults: limit,
        minScore: 60,
      });

      return matches.map(match => match.opportunity);
    } catch (error) {
      console.error('Error getting recommended opportunities:', error);
      return [];
    }
  }
}

export const matchingService = new MatchingService();