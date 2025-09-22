import { NextRequest, NextResponse } from 'next/server';
import { firebaseStatus } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    // Enhanced production protection
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_ALLOW_SEEDING) {
      return NextResponse.json(
        { error: 'Database seeding is not allowed in production' },
        { status: 403 }
      );
    }

    // Validate Firebase configuration
    if (!firebaseStatus.isConfigured) {
      return NextResponse.json(
        { 
          error: 'Firebase not properly configured', 
          details: 'Using fallback configuration - cannot seed database'
        },
        { status: 400 }
      );
    }

    // Optional API key validation for development
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SEED_API_KEY;
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    console.log('🌱 Starting database seeding...');
    
    // Dynamically import seedDatabase to avoid Firebase initialization during build
    const { seedDatabase } = await import('@/scripts/seed-database');
    const result = await seedDatabase();
    
    if (result.success) {
      console.log('✅ Database seeding completed successfully');
      return NextResponse.json(result, { status: 200 });
    } else {
      console.error('❌ Database seeding failed:', result.error);
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
      message: 'Database Seeding API',
      usage: 'Use POST to seed the database',
      environment: process.env.NODE_ENV,
      firebaseStatus: {
        configured: firebaseStatus.isConfigured,
        projectId: firebaseStatus.projectId,
        usingFallback: firebaseStatus.usingFallback
      },
      requirements: {
        development: 'NODE_ENV !== production OR NEXT_PUBLIC_ALLOW_SEEDING=true',
        authentication: 'Optional SEED_API_KEY environment variable'
      }
    },
    { status: 200 }
  );
}