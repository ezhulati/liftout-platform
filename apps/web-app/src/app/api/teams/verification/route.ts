import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const API_URL = process.env.API_SERVER_URL || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Demo user handling - simulate success
    if (isDemoUser(session.user?.email)) {
        console.log('[Demo] Verification documents submitted');
        return NextResponse.json({
            success: true,
            verificationId: `demo-verify-${Date.now()}`,
            status: 'pending',
            message: 'Verification documents submitted successfully (demo mode)',
        }, { status: 201 });
    }

    try {
        const formData = await request.formData();
        
        const response = await fetch(`${API_URL}/teams/verification`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error || 'Failed to submit documents' }, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Verification submission error:', error);
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
}
