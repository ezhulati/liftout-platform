'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import {
  CalendarIcon,
  VideoCameraIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  ArrowRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Interview {
  id: string;
  teamName: string;
  opportunityTitle: string;
  scheduledAt: string;
  format: string;
  duration: number;
  location?: string;
}

function getFormatIcon(interviewFormat: string) {
  switch (interviewFormat) {
    case 'video':
      return <VideoCameraIcon className="h-4 w-4" />;
    case 'in-person':
    case 'in_person':
      return <BuildingOfficeIcon className="h-4 w-4" />;
    case 'phone':
      return <PhoneIcon className="h-4 w-4" />;
    default:
      return <VideoCameraIcon className="h-4 w-4" />;
  }
}

export function UpcomingInterviews() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardInterviews'],
    queryFn: async () => {
      const response = await fetch('/api/interviews?status=upcoming');
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }
      return response.json() as Promise<Interview[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Interviews</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-bg-alt rounded-lg">
              <div className="h-10 w-10 bg-bg-elevated rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-bg-elevated rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Interviews</h2>
        </div>
        <p className="text-sm text-text-tertiary">Unable to load interviews</p>
      </div>
    );
  }

  const interviews = data || [];
  const upcomingInterviews = interviews
    .filter((interview) => !isPast(new Date(interview.scheduledAt)))
    .slice(0, 3);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Upcoming Interviews</h2>
        <Link
          href="/app/interviews"
          className="text-sm text-navy hover:text-navy-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {upcomingInterviews.length === 0 ? (
        <div className="text-center py-6">
          <CalendarIcon className="h-10 w-10 mx-auto text-text-tertiary mb-2" />
          <p className="text-sm text-text-secondary">No upcoming interviews</p>
          <p className="text-xs text-text-tertiary mt-1">
            Schedule interviews from your applications
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingInterviews.map((interview) => {
            const interviewDate = new Date(interview.scheduledAt);
            const isTodayInterview = isToday(interviewDate);

            return (
              <Link
                key={interview.id}
                href="/app/interviews"
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-bg-alt ${
                  isTodayInterview ? 'bg-success/5 border border-success/20' : 'bg-bg-elevated'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    isTodayInterview ? 'bg-success/10 text-success' : 'bg-navy/10 text-navy'
                  }`}
                >
                  {getFormatIcon(interview.format)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary text-sm truncate">
                    {interview.teamName}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {interview.opportunityTitle}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-xs ${
                        isTodayInterview ? 'text-success font-medium' : 'text-text-tertiary'
                      }`}
                    >
                      {isTodayInterview
                        ? `Today at ${format(interviewDate, 'h:mm a')}`
                        : format(interviewDate, 'MMM d, h:mm a')}
                    </span>
                    <span className="text-xs text-text-tertiary flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {interview.duration} min
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
