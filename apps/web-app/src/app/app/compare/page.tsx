'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TeamComparison } from '@/components/teams/TeamComparison';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Demo teams for comparison
const DEMO_TEAMS = [
  {
    id: 'techflow-data-science',
    name: 'TechFlow Data Science Team',
    matchScore: 92,
    size: 4,
    yearsWorking: 3,
    industry: 'FinTech',
    location: 'San Francisco, CA',
    skills: ['Machine Learning', 'Python', 'SQL', 'Data Architecture', 'NLP', 'MLOps'],
    achievements: ['Reduced fraud by 35%', '$2.1M annual savings', '10M+ predictions/day'],
    compensation: { min: 180000, max: 250000 },
    availability: 'Immediate',
    members: [
      { id: '1', name: 'Alex Chen', role: 'Tech Lead', yearsExperience: 10 },
      { id: '2', name: 'Sarah Martinez', role: 'Senior Data Scientist', yearsExperience: 7 },
      { id: '3', name: 'Marcus Johnson', role: 'ML Engineer', yearsExperience: 6 },
      { id: '4', name: 'Priya Patel', role: 'Data Analyst', yearsExperience: 4 },
    ],
    strengths: ['Proven track record in FinTech', 'Full-stack ML capabilities', 'Strong team cohesion'],
    considerations: ['Premium compensation expectations', 'Prefer remote-first'],
    verificationStatus: 'verified' as const,
    previousLiftouts: 1,
  },
  {
    id: 'quantum-ai-team',
    name: 'Quantum AI Research Team',
    matchScore: 87,
    size: 5,
    yearsWorking: 4,
    industry: 'Healthcare AI',
    location: 'Boston, MA',
    skills: ['Deep Learning', 'Computer Vision', 'PyTorch', 'Medical Imaging', 'Research'],
    achievements: ['3 FDA-approved algorithms', '15+ publications', 'Patent portfolio'],
    compensation: { min: 200000, max: 280000 },
    availability: '30 days notice',
    members: [
      { id: '5', name: 'Dr. Emily Watson', role: 'Research Lead', yearsExperience: 12 },
      { id: '6', name: 'James Liu', role: 'Senior ML Engineer', yearsExperience: 8 },
      { id: '7', name: 'Sofia Garcia', role: 'Computer Vision Specialist', yearsExperience: 6 },
      { id: '8', name: 'Michael Brown', role: 'ML Engineer', yearsExperience: 5 },
      { id: '9', name: 'Lisa Park', role: 'Research Scientist', yearsExperience: 4 },
    ],
    strengths: ['World-class research credentials', 'Healthcare domain expertise', 'Patent experience'],
    considerations: ['Academic background, may need industry adjustment', 'Require research autonomy'],
    verificationStatus: 'verified' as const,
    previousLiftouts: 0,
  },
  {
    id: 'devops-ninjas',
    name: 'DevOps Excellence Team',
    matchScore: 78,
    size: 3,
    yearsWorking: 2,
    industry: 'Cloud Infrastructure',
    location: 'Austin, TX',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Security', 'Docker'],
    achievements: ['99.99% uptime', '60% cost reduction', 'Zero-downtime deployments'],
    compensation: { min: 160000, max: 220000 },
    availability: '2 weeks notice',
    members: [
      { id: '10', name: 'Ryan O\'Connor', role: 'Platform Lead', yearsExperience: 9 },
      { id: '11', name: 'Anna Kim', role: 'Senior SRE', yearsExperience: 7 },
      { id: '12', name: 'David Martinez', role: 'Cloud Engineer', yearsExperience: 5 },
    ],
    strengths: ['Infrastructure expertise', 'Cost optimization focus', 'Security-first mindset'],
    considerations: ['Smaller team size', 'Less experience together'],
    verificationStatus: 'pending' as const,
    previousLiftouts: 2,
  },
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize from URL params
  useEffect(() => {
    const teamsParam = searchParams.get('teams');
    if (teamsParam) {
      setSelectedTeamIds(teamsParam.split(',').filter(Boolean));
    }
  }, [searchParams]);

  // Update URL when selection changes
  useEffect(() => {
    if (selectedTeamIds.length > 0) {
      router.replace(`/app/compare?teams=${selectedTeamIds.join(',')}`, { scroll: false });
    }
  }, [selectedTeamIds, router]);

  const selectedTeams = DEMO_TEAMS.filter(t => selectedTeamIds.includes(t.id));
  const availableTeams = DEMO_TEAMS.filter(
    t => !selectedTeamIds.includes(t.id) &&
    (searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddTeam = (teamId: string) => {
    if (selectedTeamIds.length < 4) {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
    }
    setShowTeamPicker(false);
    setSearchQuery('');
  };

  const handleRemoveTeam = (teamId: string) => {
    setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
  };

  const handleViewTeam = (teamId: string) => {
    router.push(`/app/teams/${teamId}`);
  };

  const handleContactTeam = (teamId: string) => {
    router.push(`/app/teams/${teamId}?action=contact`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Compare Teams</h1>
          <p className="text-text-secondary mt-1">
            Compare up to 4 teams side by side to find the best fit
          </p>
        </div>
        {selectedTeamIds.length < 4 && (
          <button
            onClick={() => setShowTeamPicker(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Team to Compare
          </button>
        )}
      </div>

      {/* Team Picker Modal */}
      {showTeamPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Select a Team</h3>
              <button
                onClick={() => { setShowTeamPicker(false); setSearchQuery(''); }}
                className="text-text-tertiary hover:text-text-primary"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:ring-2 focus:ring-navy focus:border-navy"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {availableTeams.length === 0 ? (
                <div className="p-8 text-center text-text-tertiary">
                  No teams available to add
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {availableTeams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => handleAddTeam(team.id)}
                      className="w-full px-6 py-4 text-left hover:bg-bg-alt transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">{team.name}</p>
                          <p className="text-sm text-text-tertiary">
                            {team.size} members · {team.industry} · {team.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${
                            team.matchScore >= 90 ? 'text-success' :
                            team.matchScore >= 75 ? 'text-navy' : 'text-gold-600'
                          }`}>
                            {team.matchScore}%
                          </span>
                          <p className="text-xs text-text-tertiary">match</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Component */}
      <TeamComparison
        teams={selectedTeams}
        maxTeams={4}
        onRemoveTeam={handleRemoveTeam}
        onAddTeam={() => setShowTeamPicker(true)}
        onViewTeam={handleViewTeam}
        onContactTeam={handleContactTeam}
      />

      {/* Quick Tips */}
      {selectedTeamIds.length === 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">How to Use Team Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-bg-alt rounded-lg">
              <div className="h-8 w-8 rounded-full bg-navy-50 text-navy flex items-center justify-center font-bold mb-2">1</div>
              <p className="text-sm text-text-secondary">
                Add teams from search results or team profiles using the "Add to Compare" button
              </p>
            </div>
            <div className="p-4 bg-bg-alt rounded-lg">
              <div className="h-8 w-8 rounded-full bg-navy-50 text-navy flex items-center justify-center font-bold mb-2">2</div>
              <p className="text-sm text-text-secondary">
                Compare up to 4 teams side by side on skills, experience, and compensation
              </p>
            </div>
            <div className="p-4 bg-bg-alt rounded-lg">
              <div className="h-8 w-8 rounded-full bg-navy-50 text-navy flex items-center justify-center font-bold mb-2">3</div>
              <p className="text-sm text-text-secondary">
                Contact your preferred team directly to start the conversation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
