import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSavedItemSchema = z.object({
  itemType: z.enum(['team', 'company', 'opportunity']),
  itemId: z.string().min(1),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folder: z.string().optional(),
});

// GET - List saved items (optionally filtered by type)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type') as 'team' | 'company' | 'opportunity' | null;

    const savedItems = await prisma.savedItem.findMany({
      where: {
        userId: session.user.id,
        ...(itemType && { itemType }),
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch related data based on item type
    const enrichedItems = await Promise.all(
      savedItems.map(async (item) => {
        let relatedData = null;

        switch (item.itemType) {
          case 'opportunity':
            relatedData = await prisma.opportunity.findUnique({
              where: { id: item.itemId },
              select: {
                id: true,
                title: true,
                description: true,
                location: true,
                industry: true,
                teamSizeMin: true,
                teamSizeMax: true,
                status: true,
                company: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                  },
                },
              },
            });
            break;
          case 'team':
            relatedData = await prisma.team.findUnique({
              where: { id: item.itemId },
              select: {
                id: true,
                name: true,
                description: true,
                industry: true,
                location: true,
                size: true,
                yearsWorkingTogether: true,
              },
            });
            break;
          case 'company':
            relatedData = await prisma.company.findUnique({
              where: { id: item.itemId },
              select: {
                id: true,
                name: true,
                description: true,
                industry: true,
                locations: true,
                logoUrl: true,
              },
            });
            break;
        }

        return {
          ...item,
          item: relatedData,
        };
      })
    );

    // Filter out items where the related data no longer exists
    const validItems = enrichedItems.filter((item) => item.item !== null);

    return NextResponse.json({
      savedItems: validItems,
      total: validItems.length,
    });
  } catch (error) {
    console.error('Get saved items error:', error);
    return NextResponse.json(
      { error: 'Failed to get saved items' },
      { status: 500 }
    );
  }
}

// POST - Save an item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSavedItemSchema.parse(body);

    // Check if already saved
    const existing = await prisma.savedItem.findFirst({
      where: {
        userId: session.user.id,
        itemType: validatedData.itemType,
        itemId: validatedData.itemId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Item already saved' },
        { status: 400 }
      );
    }

    // Verify the item exists
    let itemExists = false;
    switch (validatedData.itemType) {
      case 'opportunity':
        itemExists = !!(await prisma.opportunity.findUnique({
          where: { id: validatedData.itemId },
        }));
        break;
      case 'team':
        itemExists = !!(await prisma.team.findUnique({
          where: { id: validatedData.itemId },
        }));
        break;
      case 'company':
        itemExists = !!(await prisma.company.findUnique({
          where: { id: validatedData.itemId },
        }));
        break;
    }

    if (!itemExists) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const savedItem = await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        itemType: validatedData.itemType,
        itemId: validatedData.itemId,
        notes: validatedData.notes,
        tags: validatedData.tags || [],
        folder: validatedData.folder,
      },
    });

    return NextResponse.json({
      success: true,
      savedItem,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Save item error:', error);
    return NextResponse.json(
      { error: 'Failed to save item' },
      { status: 500 }
    );
  }
}

// DELETE - Unsave an item
export async function DELETE(request: NextRequest) {
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

    if (!savedItem) {
      return NextResponse.json(
        { error: 'Saved item not found' },
        { status: 404 }
      );
    }

    await prisma.savedItem.delete({
      where: { id: savedItem.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Item unsaved',
    });
  } catch (error) {
    console.error('Unsave item error:', error);
    return NextResponse.json(
      { error: 'Failed to unsave item' },
      { status: 500 }
    );
  }
}
