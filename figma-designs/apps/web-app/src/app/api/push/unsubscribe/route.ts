import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user metadata
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metadata: true },
    });

    // Remove push subscription from metadata
    const currentMetadata = (user?.metadata as Record<string, unknown>) || {};
    const { pushSubscription: _ps, pushEnabled: _pe, ...restMetadata } = currentMetadata;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        metadata: {
          ...restMetadata,
          pushEnabled: false,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}
