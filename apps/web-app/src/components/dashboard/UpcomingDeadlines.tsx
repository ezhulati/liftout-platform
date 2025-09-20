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
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

const priorityBgColors = {
  low: 'bg-green-50 border-green-200',
  medium: 'bg-yellow-50 border-yellow-200',
  high: 'bg-red-50 border-red-200',
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
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h3>
          <Link
            href="/app/deadlines"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>

        {urgentDeadlines.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
              <div className="ml-2">
                <p className="text-sm font-medium text-amber-800">
                  {urgentDeadlines.length} urgent deadline{urgentDeadlines.length > 1 ? 's' : ''} approaching
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Don't miss these important dates!
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
                className={`relative border rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${
                  isUrgent ? priorityBgColors[deadline.priority] : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${priorityColors[deadline.priority]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {deadline.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        deadline.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : deadline.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{deadline.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Due {format(new Date(deadline.dueDate), 'MMM d, yyyy')}
                      </p>
                      <p className={`text-xs font-medium ${
                        isUrgent ? 'text-red-600' : 'text-gray-500'
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
          <div className="text-center py-6">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming deadlines</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! Check back later for new liftout opportunities and important deadlines.
            </p>
            <div className="mt-6">
              <Link
                href="/app/opportunities"
                className="btn-primary"
              >
                Browse Liftout Opportunities
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}