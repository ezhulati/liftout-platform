import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In production, you might want to add authentication here
    // For now, we'll allow anyone to seed the database in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database seeding is not allowed in production' },
        { status: 403 }
      );
    }

    // Dynamically import seedDatabase to avoid Firebase initialization during build
    const { seedDatabase } = await import('@/scripts/seed-database');
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Use POST to seed the database',
      note: 'This endpoint is only available in development mode'
    },
    { status: 200 }
  );
}