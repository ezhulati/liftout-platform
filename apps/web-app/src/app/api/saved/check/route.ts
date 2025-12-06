import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Check if an item is saved
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type') as 'team' | 'company' | 'opportunity';
    const itemId = searchParams.get('id');

    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: 'Missing type or id parameter' },
        { status: 400 }
      );
    }

    const savedItem = await prisma.savedItem.findFirst({
      where: {
        userId: session.user.id,
        itemType,
        itemId,
      },
    });

    return NextResponse.json({
      isSaved: !!savedItem,
      savedItem: savedItem || null,
    });
  } catch (error) {
    console.error('Check saved item error:', error);
    return NextResponse.json(
      { error: 'Failed to check saved status' },
      { status: 500 }
    );
  }
}
