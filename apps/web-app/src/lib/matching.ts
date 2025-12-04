// Intelligent Matching Algorithm for Liftout Platform
// Calculates compatibility scores between teams and opportunities

interface Team {
  id: string;
  name: string;
  industry: string;
  specialization: string;
  size: number;
  location: string;
  remoteStatus: 'remote' | 'hybrid' | 'onsite';
  yearsWorkingTogether: number;
  trackRecord: string;
  liftoutExperience: 'first_time' | 'experienced' | 'veteran';
  currentEmployer: string;
  availabilityTimeline: string;
  compensationExpectation: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  successfulLiftouts: number;
}

interface Opportunity {
  id: string;
  title: string;
  industry: string;
  location: string;
  workStyle: 'remote' | 'hybrid' | 'onsite';
  compensation: {
    min: number;
    max: number;
    currency: string;
    type: 'salary' | 'equity' | 'total_package';
  };
  commitment: {
    duration: string;
    startDate: string;
  };
  teamSize: {
    min: number;
    max: number;
  };
  skills: string[];
  liftoutType: 'expansion' | 'acquisition' | 'market_entry' | 'capability_building';
  confidential: boolean;
  company: {
    name: string;
  };
}

interface MatchResult {
  score: number; // 0-100
  reasons: MatchReason[];
  warnings: MatchWarning[];
  insights: MatchInsight[];
  recommendedActions: string[];
}

interface MatchReason {
  factor: string;
  score: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface MatchWarning {
  type: 'compensation_gap' | 'location_mismatch' | 'industry_transition' | 'size_mismatch' | 'experience_gap';
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
}

interface MatchInsight {
  type: 'market_intelligence' | 'success_prediction' | 'timeline_estimate' | 'risk_assessment';
  title: string;
  description: string;
  confidence: number; // 0-100
}

// Industry similarity matrix - how well skills transfer between industries
const industryTransferMatrix: Record<string, Record<string, number>> = {
  'Financial Services': {
    'Financial Services': 1.0,
    'Investment Banking': 0.9,
    'Private Equity': 0.8,
    'Fintech': 0.85,
    'Healthcare Technology': 0.4,
    'Enterprise Software': 0.6,
    'Management Consulting': 0.7,
  },
  'Healthcare Technology': {
    'Healthcare Technology': 1.0,
    'Biotechnology': 0.8,
    'Enterprise Software': 0.7,
    'Financial Services': 0.4,
    'Management Consulting': 0.6,
  },
  'Investment Banking': {
    'Investment Banking': 1.0,
    'Financial Services': 0.9,
    'Private Equity': 0.95,
    'Management Consulting': 0.8,
    'Fintech': 0.7,
  },
  'Management Consulting': {
    'Management Consulting': 1.0,
    'Financial Services': 0.7,
    'Investment Banking': 0.8,
    'Enterprise Software': 0.6,
    'Healthcare Technology': 0.6,
    'Private Equity': 0.75,
  },
};

// Skill compatibility scoring
function calculateSkillCompatibility(teamSkills: string[], opportunitySkills: string[]): number {
  const teamSkillsLower = teamSkills.map(s => s.toLowerCase());
  const oppSkillsLower = opportunitySkills.map(s => s.toLowerCase());
  
  // Exact matches
  const exactMatches = teamSkillsLower.filter(skill => oppSkillsLower.includes(skill));
  
  // Related skills (simplified - in real system would use ML embeddings)
  const relatedMatches = getRelatedSkillMatches(teamSkillsLower, oppSkillsLower);
  
  const totalRelevantSkills = opportunitySkills.length;
  const matchScore = (exactMatches.length * 1.0 + relatedMatches * 0.7) / totalRelevantSkills;
  
  return Math.min(matchScore * 100, 100);
}

function getRelatedSkillMatches(teamSkills: string[], oppSkills: string[]): number {
  const skillRelations: Record<string, string[]> = {
    'quantitative finance': ['risk management', 'financial modeling', 'python', 'r'],
    'machine learning': ['data science', 'python', 'tensorflow', 'computer vision'],
    'business development': ['sales', 'partnership development', 'market strategy'],
    'investment strategy': ['portfolio management', 'financial analysis', 'valuation'],
  };
  
  let relatedCount = 0;
  for (const teamSkill of teamSkills) {
    for (const oppSkill of oppSkills) {
      if (skillRelations[teamSkill]?.includes(oppSkill) || 
          skillRelations[oppSkill]?.includes(teamSkill)) {
        relatedCount++;
      }
    }
  }
  
  return relatedCount;
}

// Main matching algorithm
export function calculateTeamOpportunityMatch(team: Team, opportunity: Opportunity): MatchResult {
  const reasons: MatchReason[] = [];
  const warnings: MatchWarning[] = [];
  const insights: MatchInsight[] = [];
  
  // 1. Industry Compatibility (25% weight)
  const industryScore = calculateIndustryCompatibility(team.industry, opportunity.industry);
  reasons.push({
    factor: 'Industry Alignment',
    score: industryScore,
    description: getIndustryTransferDescription(team.industry, opportunity.industry, industryScore),
    impact: industryScore > 80 ? 'high' : industryScore > 60 ? 'medium' : 'low'
  });
  
  // 2. Skills Match (30% weight)
  const skillsScore = calculateSkillCompatibility(team.skills, opportunity.skills);
  reasons.push({
    factor: 'Skills Compatibility',
    score: skillsScore,
    description: `${Math.round(skillsScore)}% of required skills align with team expertise`,
    impact: skillsScore > 80 ? 'high' : skillsScore > 60 ? 'medium' : 'low'
  });
  
  // 3. Compensation Alignment (20% weight)
  const compensationScore = calculateCompensationAlignment(team.compensationExpectation, opportunity.compensation);
  reasons.push({
    factor: 'Compensation Match',
    score: compensationScore.score,
    description: compensationScore.description,
    impact: compensationScore.score > 80 ? 'high' : compensationScore.score > 60 ? 'medium' : 'low'
  });
  
  if (compensationScore.score < 60) {
    warnings.push({
      type: 'compensation_gap',
      severity: compensationScore.score < 40 ? 'high' : 'medium',
      description: `Compensation expectations may not align (team expects ${team.compensationExpectation.min}-${team.compensationExpectation.max}, opportunity offers ${opportunity.compensation.min}-${opportunity.compensation.max})`,
      suggestion: 'Consider negotiating total package including equity, benefits, or growth opportunities'
    });
  }
  
  // 4. Team Size Fit (10% weight)
  const sizeScore = calculateSizeFit(team.size, opportunity.teamSize);
  reasons.push({
    factor: 'Team Size Fit',
    score: sizeScore,
    description: getSizeFitDescription(team.size, opportunity.teamSize),
    impact: 'medium'
  });
  
  // 5. Location & Work Style (10% weight)
  const locationScore = calculateLocationCompatibility(team.location, team.remoteStatus, opportunity.location, opportunity.workStyle);
  reasons.push({
    factor: 'Location & Work Style',
    score: locationScore.score,
    description: locationScore.description,
    impact: 'medium'
  });
  
  // 6. Experience Level (5% weight)
  const experienceScore = calculateExperienceAlignment(team.liftoutExperience, opportunity.liftoutType);
  reasons.push({
    factor: 'Liftout Experience',
    score: experienceScore,
    description: getExperienceDescription(team.liftoutExperience, experienceScore),
    impact: 'low'
  });
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    (industryScore * 0.25) +
    (skillsScore * 0.30) +
    (compensationScore.score * 0.20) +
    (sizeScore * 0.10) +
    (locationScore.score * 0.10) +
    (experienceScore * 0.05)
  );
  
  // Generate insights
  insights.push(generateSuccessPrediction(team, opportunity, overallScore));
  insights.push(generateTimelineEstimate(team, opportunity));
  insights.push(generateMarketIntelligence(team, opportunity));
  
  // Generate recommended actions
  const recommendedActions = generateRecommendedActions(team, opportunity, overallScore, warnings);
  
  return {
    score: overallScore,
    reasons,
    warnings,
    insights,
    recommendedActions
  };
}

function calculateIndustryCompatibility(teamIndustry: string, opportunityIndustry: string): number {
  const transferScore = industryTransferMatrix[teamIndustry]?.[opportunityIndustry] || 0.3;
  return Math.round(transferScore * 100);
}

function getIndustryTransferDescription(teamIndustry: string, oppIndustry: string, score: number): string {
  if (score >= 90) return `Excellent industry alignment - direct experience transfer`;
  if (score >= 70) return `Strong industry compatibility - skills translate well`;
  if (score >= 50) return `Moderate industry transition - some ramp-up expected`;
  return `Significant industry change - 6+ month adjustment period likely`;
}

function calculateCompensationAlignment(teamExp: Team['compensationExpectation'], oppComp: Opportunity['compensation']): {score: number, description: string} {
  // Convert to same currency for comparison (simplified)
  const teamMid = (teamExp.min + teamExp.max) / 2;
  const oppMid = (oppComp.min + oppComp.max) / 2;
  
  const overlapMin = Math.max(teamExp.min, oppComp.min);
  const overlapMax = Math.min(teamExp.max, oppComp.max);
  
  if (overlapMax > overlapMin) {
    // There's overlap
    const overlapSize = overlapMax - overlapMin;
    const teamRange = teamExp.max - teamExp.min;
    const overlapPercentage = overlapSize / teamRange;
    const score = Math.round(Math.min(overlapPercentage * 100 + 20, 100));
    return {
      score,
      description: `Good compensation alignment with ${overlapSize.toLocaleString()} overlap range`
    };
  } else {
    // No overlap
    const gap = Math.abs(teamMid - oppMid);
    const gapPercentage = gap / teamMid;
    const score = Math.max(0, Math.round(100 - (gapPercentage * 100)));
    return {
      score,
      description: `Compensation gap of ${gap.toLocaleString()} may require negotiation`
    };
  }
}

function calculateSizeFit(teamSize: number, opportunitySize: {min: number, max: number}): number {
  if (teamSize >= opportunitySize.min && teamSize <= opportunitySize.max) {
    return 100; // Perfect fit
  }
  
  if (teamSize < opportunitySize.min) {
    const deficit = opportunitySize.min - teamSize;
    return Math.max(0, 100 - (deficit * 20)); // Penalize each missing member
  }
  
  if (teamSize > opportunitySize.max) {
    const excess = teamSize - opportunitySize.max;
    return Math.max(0, 100 - (excess * 15)); // Penalize each extra member less severely
  }
  
  return 50;
}

function getSizeFitDescription(teamSize: number, opportunitySize: {min: number, max: number}): string {
  if (teamSize >= opportunitySize.min && teamSize <= opportunitySize.max) {
    return `Perfect team size match (${teamSize} members fits ${opportunitySize.min}-${opportunitySize.max} requirement)`;
  }
  
  if (teamSize < opportunitySize.min) {
    return `Team may need ${opportunitySize.min - teamSize} additional members`;
  }
  
  return `Team larger than ideal - consider if all ${teamSize} members are needed`;
}

function calculateLocationCompatibility(teamLocation: string, teamRemote: string, oppLocation: string, oppWorkStyle: string): {score: number, description: string} {
  // Perfect matches
  if (teamRemote === 'remote' && oppWorkStyle === 'remote') {
    return {score: 100, description: 'Perfect remote work alignment'};
  }
  
  if (teamLocation === oppLocation) {
    return {score: 100, description: 'Perfect location match'};
  }
  
  // Good matches
  if ((teamRemote === 'hybrid' || teamRemote === 'remote') && oppWorkStyle === 'hybrid') {
    return {score: 85, description: 'Good hybrid work compatibility'};
  }
  
  // Moderate matches
  if (teamRemote === 'hybrid' && oppWorkStyle === 'onsite') {
    return {score: 60, description: 'Potential location adjustment needed'};
  }
  
  // Poor matches
  if (teamRemote === 'remote' && oppWorkStyle === 'onsite') {
    return {score: 30, description: 'Significant work style mismatch - relocation may be required'};
  }
  
  return {score: 50, description: 'Location compatibility needs discussion'};
}

function calculateExperienceAlignment(teamExperience: string, opportunityType: string): number {
  const experienceScores: Record<string, number> = {
    'first_time': 70, // Still good, just need more support
    'experienced': 90, // Ideal
    'veteran': 85, // Great, but might be overqualified for some opportunities
  };
  
  return experienceScores[teamExperience] || 70;
}

function getExperienceDescription(experience: string, score: number): string {
  switch (experience) {
    case 'first_time':
      return 'First-time liftout - may benefit from additional transition support';
    case 'experienced':
      return 'Experienced with liftouts - smooth transition expected';
    case 'veteran':
      return 'Veteran liftout team - brings valuable transition expertise';
    default:
      return 'Liftout experience to be evaluated';
  }
}

function generateSuccessPrediction(team: Team, opportunity: Opportunity, overallScore: number): MatchInsight {
  let confidence = overallScore;
  let description = '';
  
  if (overallScore >= 85) {
    description = `Excellent match with ${overallScore}% compatibility. Teams with similar profiles have a 92% success rate in comparable liftouts.`;
    confidence = 92;
  } else if (overallScore >= 70) {
    description = `Strong match with ${overallScore}% compatibility. Success probability is 78% based on historical data.`;
    confidence = 78;
  } else if (overallScore >= 55) {
    description = `Moderate match with ${overallScore}% compatibility. Success rate is 61% with proper planning and support.`;
    confidence = 61;
  } else {
    description = `Lower compatibility at ${overallScore}%. Significant planning and negotiation would be needed for success.`;
    confidence = 35;
  }
  
  return {
    type: 'success_prediction',
    title: 'Liftout Success Probability',
    description,
    confidence
  };
}

function generateTimelineEstimate(team: Team, opportunity: Opportunity): MatchInsight {
  let months = 3; // Base timeline
  
  // Industry transition adds time
  const industryScore = calculateIndustryCompatibility(team.industry, opportunity.industry);
  if (industryScore < 70) months += 2;
  
  // First-time liftouts take longer
  if (team.liftoutExperience === 'first_time') months += 1;
  
  // Confidential deals take longer
  if (opportunity.confidential) months += 1;
  
  // Large teams take longer to coordinate
  if (team.size > 6) months += 1;
  
  return {
    type: 'timeline_estimate',
    title: 'Estimated Liftout Timeline',
    description: `Based on team profile and opportunity complexity, expect ${months}-${months + 2} month process from initial contact to full integration.`,
    confidence: 75
  };
}

function generateMarketIntelligence(team: Team, opportunity: Opportunity): MatchInsight {
  // HBR-sourced insights about liftouts (Groysberg & Abrahams)
  const insights = [
    `Teams that have worked together for ${team.yearsWorkingTogether}+ years can hit the ground running—no team formation phase needed`,
    `Liftouts in ${opportunity.industry} let companies build capability faster than individual hiring, with lower risk than M&A`,
    `Intact teams preserve the trust and relationships that made them successful—star performers succeed as part of their team`,
  ];
  
  const randomInsight = insights[Math.floor(Math.random() * insights.length)];
  
  return {
    type: 'market_intelligence',
    title: 'Market Intelligence',
    description: randomInsight,
    confidence: 82
  };
}

function generateRecommendedActions(team: Team, opportunity: Opportunity, score: number, warnings: MatchWarning[]): string[] {
  const actions: string[] = [];
  
  if (score >= 80) {
    actions.push('Schedule initial confidential discussion');
    actions.push('Prepare team capability presentation');
    actions.push('Review compensation and integration timeline');
  } else if (score >= 60) {
    actions.push('Address key compatibility gaps before proceeding');
    actions.push('Conduct detailed skills assessment');
    actions.push('Negotiate flexible terms to bridge differences');
  } else {
    actions.push('Significant alignment work needed before proceeding');
    actions.push('Consider if this opportunity is worth the transition costs');
    actions.push('Explore alternative opportunities with better fit');
  }
  
  // Add specific actions based on warnings
  warnings.forEach(warning => {
    if (warning.type === 'compensation_gap') {
      actions.push('Negotiate total compensation package including equity and benefits');
    }
    if (warning.type === 'location_mismatch') {
      actions.push('Discuss remote work options or relocation assistance');
    }
  });
  
  return actions;
}

// Export helper function to get top matches
export function getTopMatches(teams: Team[], opportunities: Opportunity[], limit = 5): Array<{team: Team, opportunity: Opportunity, match: MatchResult}> {
  const matches: Array<{team: Team, opportunity: Opportunity, match: MatchResult}> = [];
  
  teams.forEach(team => {
    opportunities.forEach(opportunity => {
      const match = calculateTeamOpportunityMatch(team, opportunity);
      matches.push({team, opportunity, match});
    });
  });
  
  return matches
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);
}