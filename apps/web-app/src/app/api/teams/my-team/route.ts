import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.API_SERVER_URL || 'http://localhost:8000/api';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await fetch(`${API_URL}/teams/my-team`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error || 'Failed to fetch team' }, { status: response.status });
        }

        return NextResponse.json({ team: data });
    } catch (error) {
        console.error('Failed to fetch team:', error);
        return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
    }
}
