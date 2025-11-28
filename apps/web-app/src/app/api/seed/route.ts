import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@liftout/database';
import bcrypt from 'bcryptjs';

// Secret key to protect this endpoint
const SEED_SECRET = process.env.SEED_SECRET || 'liftout-seed-2024';

export async function POST(request: NextRequest) {
  try {
    // Check for secret key in header or query param
    const authHeader = request.headers.get('x-seed-secret');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    if (authHeader !== SEED_SECRET && querySecret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - provide x-seed-secret header or ?secret= query param' },
        { status: 401 }
      );
    }

    const results: string[] = [];

    // Hash password for demo users
    const demoPassword = await bcrypt.hash('password', 12);

    // Create demo team user
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: { passwordHash: demoPassword },
      create: {
        email: 'demo@example.com',
        passwordHash: demoPassword,
        firstName: 'Demo',
        lastName: 'User',
        userType: 'individual',
        emailVerified: true,
        profileCompleted: true,
        profile: {
          create: {
            title: 'Team Lead',
            location: 'San Francisco, CA',
            bio: 'Demo team lead user for testing the platform.',
            yearsExperience: 10,
            availabilityStatus: 'open_to_opportunities',
            salaryExpectationMin: 180000,
            salaryExpectationMax: 250000,
            remotePreference: 'hybrid',
            skillsSummary: 'Leadership, Full-Stack Development, Team Management'
          }
        }
      }
    });
    results.push(`Created/updated demo user: ${demoUser.email}`);

    // Create demo company user
    const demoCompanyUser = await prisma.user.upsert({
      where: { email: 'company@example.com' },
      update: { passwordHash: demoPassword },
      create: {
        email: 'company@example.com',
        passwordHash: demoPassword,
        firstName: 'Company',
        lastName: 'Demo',
        userType: 'company',
        emailVerified: true,
        profileCompleted: true
      }
    });
    results.push(`Created/updated company user: ${demoCompanyUser.email}`);

    // Check if demo company exists, create if not
    const existingCompany = await prisma.company.findUnique({
      where: { slug: 'demo-company' }
    });

    if (!existingCompany) {
      const demoCompany = await prisma.company.create({
        data: {
          name: 'Demo Company',
          slug: 'demo-company',
          description: 'Demo company for testing the platform.',
          industry: 'Technology',
          companySize: 'large',
          foundedYear: 2010,
          websiteUrl: 'https://demo-company.com',
          headquartersLocation: 'New York, NY',
          companyCulture: 'Innovative and collaborative.',
          employeeCount: 500,
          verificationStatus: 'verified',
          verifiedAt: new Date(),
          users: {
            create: {
              userId: demoCompanyUser.id,
              role: 'admin',
              isPrimaryContact: true,
              title: 'Head of Talent Acquisition'
            }
          }
        }
      });
      results.push(`Created demo company: ${demoCompany.name}`);
    } else {
      // Make sure company user is linked
      const existingMembership = await prisma.companyUser.findFirst({
        where: {
          userId: demoCompanyUser.id,
          companyId: existingCompany.id
        }
      });

      if (!existingMembership) {
        await prisma.companyUser.create({
          data: {
            userId: demoCompanyUser.id,
            companyId: existingCompany.id,
            role: 'admin',
            isPrimaryContact: true,
            title: 'Head of Talent Acquisition'
          }
        });
        results.push(`Linked company user to existing demo company`);
      } else {
        results.push(`Demo company already exists and user is linked`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      results
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with secret to seed demo data',
    usage: 'POST /api/seed?secret=liftout-seed-2024 OR with x-seed-secret header',
    credentials: {
      team: { email: 'demo@example.com', password: 'password' },
      company: { email: 'company@example.com', password: 'password' }
    }
  });
}