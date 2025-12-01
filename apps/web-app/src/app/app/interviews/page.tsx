'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { InterviewScheduler } from '@/components/interviews';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Demo interviews for when API returns empty
const DEMO_INTERVIEWS = [
  {
    id: 'demo-interview-1',
    applicationId: 'app-1',
    teamId: 'techflow-data-science',
    teamName: 'TechFlow Data Science Team',
    opportunityTitle: 'Lead Data Science Division',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    format: 'video' as const,
    meetingLink: 'https://zoom.us/j/123456789',
    status: 'scheduled' as const,
    interviewers: [
      { id: '1', name: 'Sarah Johnson', role: 'VP of Engineering', email: 'sarah@company.com' },
      { id: '2', name: 'Michael Chen', role: 'CTO', email: 'michael@company.com' },
    ],
    notes: 'Initial team assessment - discuss past projects and team dynamics',
  },
  {
    id: 'demo-interview-2',
    applicationId: 'app-2',
    teamId: 'quantum-ai-team',
    teamName: 'Quantum AI Research Team',
    opportunityTitle: 'Healthcare AI Research Lead',
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    format: 'video' as const,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmed' as const,
    interviewers: [
      { id: '3', name: 'Dr. Emily Watson', role: 'Chief Medical Officer', email: 'emily@company.com' },
      { id: '4', name: 'James Liu', role: 'Head of AI', email: 'james@company.com' },
    ],
    notes: 'Technical deep dive - review research methodology and FDA experience',
  },
  {
    id: 'demo-interview-3',
    applicationId: 'app-3',
    teamId: 'devops-ninjas',
    teamName: 'DevOps Excellence Team',
    opportunityTitle: 'Platform Engineering Team',
    scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    format: 'in_person' as const,
    location: '123 Tech Street, San Francisco, CA',
    status: 'completed' as const,
    interviewers: [
      { id: '5', name: 'Alex Martinez', role: 'VP of Infrastructure', email: 'alex@company.com' },
    ],
    feedback: 'Strong technical skills, excellent team chemistry. Proceeding to final round.',
  },
];

export default function InterviewsPage() {
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews', statusFilter === 'all' ? undefined : statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const response = await fetch(`/api/interviews?${params}`);
      if (!response.ok) throw new Error('Failed to fetch interviews');
      return response.json();
    },
  });

  // Use demo data if API returns empty
  const displayInterviews = interviews?.length > 0 ? interviews : DEMO_INTERVIEWS;

  // Transform API response to component format
  const formattedInterviews = displayInterviews.map((interview: typeof DEMO_INTERVIEWS[0]) => ({
    id: interview.id,
    applicationId: interview.applicationId || interview.id,
    teamId: interview.teamId,
    teamName: interview.teamName,
    opportunityTitle: interview.opportunityTitle,
    scheduledAt: interview.scheduledAt,
    duration: interview.duration,
    format: interview.format,
    location: interview.location,
    meetingLink: interview.meetingLink,
    status: interview.status,
    interviewers: interview.interviewers || [],
    notes: interview.notes,
    feedback: interview.feedback,
  }));

  const handleScheduleInterview = async (data: {
    applicationId: string;
    scheduledAt: string;
    duration: number;
    format: 'video' | 'in_person' | 'phone';
    location?: string;
    meetingLink?: string;
    interviewers: string[];
    notes?: string;
  }) => {
    const response = await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to schedule interview');
  };

  const handleConfirmInterview = async (interviewId: string) => {
    const response = await fetch(`/api/interviews/${interviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    });
    if (!response.ok) throw new Error('Failed to confirm interview');
  };

  const handleCancelInterview = async (interviewId: string, reason?: string) => {
    const response = await fetch(`/api/interviews/${interviewId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to cancel interview');
  };

  // Calculate stats
  const now = new Date();
  const upcomingCount = formattedInterviews.filter(
    (i: typeof formattedInterviews[0]) => new Date(i.scheduledAt) > now && i.status !== 'cancelled'
  ).length;
  const thisWeekCount = formattedInterviews.filter((i: typeof formattedInterviews[0]) => {
    const date = new Date(i.scheduledAt);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date > now && date < weekFromNow && i.status !== 'cancelled';
  }).length;
  const completedCount = formattedInterviews.filter(
    (i: typeof formattedInterviews[0]) => i.status === 'completed'
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Interviews</h1>
        <p className="text-text-secondary mt-1">
          Manage your interview schedule and track progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{upcomingCount}</p>
              <p className="text-sm text-text-tertiary">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gold-100 flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-gold-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{thisWeekCount}</p>
              <p className="text-sm text-text-tertiary">This Week</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <VideoCameraIcon className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{completedCount}</p>
              <p className="text-sm text-text-tertiary">Completed</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-bg-alt flex items-center justify-center">
              <FunnelIcon className="h-5 w-5 text-text-tertiary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{formattedInterviews.length}</p>
              <p className="text-sm text-text-tertiary">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Scheduler Component */}
      <InterviewScheduler
        interviews={formattedInterviews}
        isLoading={isLoading}
        onScheduleInterview={session?.user?.userType === 'company' ? handleScheduleInterview : undefined}
        onConfirmInterview={handleConfirmInterview}
        onCancelInterview={handleCancelInterview}
      />
    </div>
  );
}
