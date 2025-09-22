import { NextRequest, NextResponse } from 'next/server';
import { firebaseStatus } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or when demo mode is enabled
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Demo seeding not allowed in production' },
        { status: 403 }
      );
    }

    // Validate Firebase configuration
    if (!firebaseStatus.isConfigured) {
      return NextResponse.json(
        { 
          error: 'Firebase not properly configured', 
          details: 'Using fallback configuration - cannot seed demo data'
        },
        { status: 400 }
      );
    }

    console.log('🎭 Starting demo data seeding...');

    // Dynamically import DemoSeeder to avoid Firebase initialization during build
    const { DemoSeeder } = await import('@/lib/demo-seeder');
    const result = await DemoSeeder.seedAllDemoData();
    
    if (result.success) {
      console.log('✅ Demo data seeding completed successfully');
      return NextResponse.json({
        success: true,
        message: 'Demo data seeded successfully',
        data: {
          users: 2,
          teams: 3,
          opportunities: 3,
          conversations: 2
        }
      });
    } else {
      console.error('❌ Demo data seeding failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Demo seeding error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to seed demo data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only allow in development or when demo mode is enabled
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Demo clearing not allowed in production' },
        { status: 403 }
      );
    }

    // Validate Firebase configuration
    if (!firebaseStatus.isConfigured) {
      return NextResponse.json(
        { 
          error: 'Firebase not properly configured', 
          details: 'Using fallback configuration - cannot clear demo data'
        },
        { status: 400 }
      );
    }

    console.log('🧹 Starting demo data clearing...');

    // Dynamically import DemoSeeder to avoid Firebase initialization during build
    const { DemoSeeder } = await import('@/lib/demo-seeder');
    const result = await DemoSeeder.clearDemoData();
    
    if (result.success) {
      console.log('✅ Demo data cleared successfully');
      return NextResponse.json({
        success: true,
        message: 'Demo data cleared successfully'
      });
    } else {
      console.error('❌ Demo data clearing failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Demo clearing error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clear demo data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return demo data status and information
  return NextResponse.json({
    message: 'Demo Data Seeding API',
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development',
    environment: process.env.NODE_ENV,
    firebaseStatus: {
      configured: firebaseStatus.isConfigured,
      projectId: firebaseStatus.projectId,
      usingFallback: firebaseStatus.usingFallback
    },
    operations: {
      POST: 'Seed demo data (users, teams, opportunities, conversations)',
      DELETE: 'Clear all demo data',
      GET: 'Get demo status and accounts'
    },
    demoAccounts: [
      {
        type: 'individual',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Alex Chen - Data Science Team Lead'
      },
      {
        type: 'company', 
        email: 'company@example.com',
        password: 'demo123',
        name: 'Sarah Rodriguez - VP Talent Acquisition'
      }
    ]
  });
}