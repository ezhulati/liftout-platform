'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Deadline {
  id: string;
  type: 'liftout_deadline' | 'due_diligence' | 'interview_scheduled' | 'negotiation_deadline';
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  href?: string;
  status?: 'upcoming' | 'overdue' | 'completed';
}

const mockDeadlines: Deadline[] = [
  {
    id: '1',
    type: 'liftout_deadline',
    title: 'Strategic Analytics Team Opportunity',
    description: 'Expression of interest deadline for FinTech expansion liftout',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    status: 'upcoming',
    href: '/app/opportunities/1',
  },
  {
    id: '2',
    type: 'interview_scheduled',
    title: 'Liftout interview with TechCorp',
    description: 'Final team assessment for potential acquisition',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    status: 'upcoming',
    href: '/app/interviews/2',
  },
  {
    id: '3',
    type: 'due_diligence',
    title: 'Due diligence submission',
    description: 'Submit team credentials and performance history to MedTech Solutions',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    status: 'upcoming',
    href: '/app/applications/3',
  },
  {
    id: '4',
    type: 'negotiation_deadline',
    title: 'Contract negotiation deadline',
    description: 'Finalize terms for team acquisition with DataFlow Inc.',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    status: 'upcoming',
    href: '/app/negotiations/4',
  },
];

const deadlineIcons = {
  liftout_deadline: ClockIcon,
  due_diligence: CheckCircleIcon,
  interview_scheduled: ExclamationTriangleIcon,
  negotiation_deadline: ClockIcon,
};

const priorityColors = {
  low: 'text-success',
  medium: 'text-gold-700',
  high: 'text-error',
};

const priorityBgColors = {
  low: 'bg-success-light border-success/20',
  medium: 'bg-gold-50 border-gold/20',
  high: 'bg-error-light border-error/20',
};

export function UpcomingDeadlines() {
  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['upcoming-deadlines'],
    queryFn: async () => {
      // This would normally fetch from your API
      return mockDeadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-5 font-heading">Upcoming Deadlines</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse border border-border rounded-xl p-3">
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 skeleton rounded"></div>
                <div className="flex-1">
                  <div className="h-4 skeleton rounded w-48 mb-2"></div>
                  <div className="h-3 skeleton rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const urgentDeadlines = deadlines?.filter(d => {
    const daysUntilDue = (new Date(d.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilDue <= 3;
  }) || [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-text-primary font-heading">Upcoming Deadlines</h3>
        <Link
          href="/app/deadlines"
          className="text-base font-medium text-navy hover:text-gold transition-colors duration-fast"
        >
          View all
        </Link>
      </div>

      {urgentDeadlines.length > 0 && (
        <div className="mb-4 p-3 bg-gold-50 border border-gold/20 rounded-xl">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-gold-700" />
            <div className="ml-2">
              <p className="text-base font-semibold text-gold-800">
                {urgentDeadlines.length} urgent deadline{urgentDeadlines.length > 1 ? 's' : ''} approaching
              </p>
              <p className="text-base text-gold-700 mt-0.5">
                Do not miss these important dates!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {deadlines?.slice(0, 5).map((deadline) => {
          const Icon = deadlineIcons[deadline.type];
          const isUrgent = urgentDeadlines.includes(deadline);

          return (
            <div
              key={deadline.id}
              className={`relative border rounded-xl p-3 transition-all duration-base hover:shadow-sm ${
                isUrgent ? priorityBgColors[deadline.priority] : 'border-border hover:border-gold/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className={`h-5 w-5 ${priorityColors[deadline.priority]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-text-primary truncate">
                      {deadline.title}
                    </h4>
                    <span className={`badge text-sm ${
                      deadline.priority === 'high'
                        ? 'badge-error'
                        : deadline.priority === 'medium'
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}>
                      {deadline.priority}
                    </span>
                  </div>
                  <p className="text-base text-text-secondary mt-1">{deadline.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-base text-text-tertiary">
                      Due {format(new Date(deadline.dueDate), 'MMM d, yyyy')}
                    </p>
                    <p className={`text-base font-medium ${
                      isUrgent ? 'text-error' : 'text-text-tertiary'
                    }`}>
                      {formatDistanceToNow(new Date(deadline.dueDate), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              {deadline.href && (
                <Link href={deadline.href} className="absolute inset-0">
                  <span className="sr-only">View {deadline.title}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {(!deadlines || deadlines.length === 0) && (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-success-light flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-7 w-7 text-success" />
          </div>
          <h4 className="text-base font-semibold text-text-primary mb-1">No upcoming deadlines</h4>
          <p className="text-base text-text-secondary mb-6">
            You're all caught up! Check back later for new liftout opportunities and important deadlines.
          </p>
          <Link
            href="/app/opportunities"
            className="btn-primary min-h-12"
          >
            Browse liftout opportunities
          </Link>
        </div>
      )}
    </div>
  );
}