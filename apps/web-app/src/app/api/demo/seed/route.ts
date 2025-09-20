import { NextRequest, NextResponse } from 'next/server';
import { DemoSeeder } from '@/lib/demo-seeder';

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or when demo mode is enabled
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Demo seeding not allowed in production' },
        { status: 403 }
      );
    }

    const result = await DemoSeeder.seedAllDemoData();
    
    if (result.success) {
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
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Demo seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo data' },
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

    const result = await DemoSeeder.clearDemoData();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Demo data cleared successfully'
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Demo clearing error:', error);
    return NextResponse.json(
      { error: 'Failed to clear demo data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return demo data status
  return NextResponse.json({
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development',
    accounts: [
      {
        type: 'individual',
        email: 'demo@liftout.com',
        name: 'Alex Chen - Data Science Team Lead'
      },
      {
        type: 'company', 
        email: 'company@liftout.com',
        name: 'Sarah Rodriguez - VP Talent Acquisition'
      }
    ]
  });
}