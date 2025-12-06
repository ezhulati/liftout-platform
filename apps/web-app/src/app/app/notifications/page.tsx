'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { BellIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

function getNotificationIcon(title: string) {
    if (title.toLowerCase().includes('success')) {
        return <CheckCircleIcon className="h-6 w-6 text-success" />;
    }
    if (title.toLowerCase().includes('error') || title.toLowerCase().includes('failed')) {
        return <XCircleIcon className="h-6 w-6 text-error" />;
    }
    return <BellIcon className="h-6 w-6 text-navy" />;
}

export default function NotificationsPage() {
    const { data: session } = useSession();
    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: () => fetch('/api/notifications').then(res => res.json()),
        enabled: !!session,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="page-header mb-8">
                <h1 className="page-title">Notifications</h1>
                <p className="page-subtitle">Manage your notification preferences.</p>
            </div>

            <div className="card">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-medium text-text-primary">All Notifications</h2>
                </div>
                <div className="px-6 py-6 space-y-4">
                    {notifications?.length === 0 ? (
                        <p className="text-text-secondary">You have no notifications.</p>
                    ) : (
                        notifications?.map(notification => (
                            <div key={notification.id} className={`p-4 rounded-lg flex items-start gap-4 ${notification.isRead ? 'bg-bg-surface' : 'bg-bg-alt'}`}>
                                <div className="flex-shrink-0">
                                    {getNotificationIcon(notification.title)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-primary">{notification.title}</h3>
                                    <p className="text-text-secondary">{notification.message}</p>
                                    <p className="text-xs text-text-tertiary mt-2">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
