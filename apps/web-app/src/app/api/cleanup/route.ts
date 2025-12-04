import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Secret key to protect this endpoint
const CLEANUP_SECRET = process.env.SEED_SECRET || 'liftout-seed-2024';

// Essential emails to keep
const KEEP_EMAILS = [
  'admin@liftout.com',
  'enrizhulati@gmail.com',
  'demo@example.com',
  'sarah.martinez@example.com',
  'marcus.johnson@example.com',
  'priya.patel@example.com',
  'company@example.com',
];

// Essential company slugs to keep
const KEEP_COMPANY_SLUGS = [
  'demo-company',
];

// Essential team slugs to keep
const KEEP_TEAM_SLUGS = [
  'techflow-data-science',
];

export async function POST(request: NextRequest) {
  try {
    // Check for secret key
    const authHeader = request.headers.get('x-seed-secret');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    if (authHeader !== CLEANUP_SECRET && querySecret !== CLEANUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - provide x-seed-secret header or ?secret= query param' },
        { status: 401 }
      );
    }

    const results: string[] = [];

    // Get counts before cleanup
    const userCountBefore = await prisma.user.count();
    const companyCountBefore = await prisma.company.count();
    const teamCountBefore = await prisma.team.count();

    results.push(`Before cleanup: ${userCountBefore} users, ${companyCountBefore} companies, ${teamCountBefore} teams`);

    // Delete conversations first (depends on teams/companies)
    const deletedConversations = await prisma.conversation.deleteMany({
      where: {
        OR: [
          { team: { slug: { notIn: KEEP_TEAM_SLUGS } } },
          { company: { slug: { notIn: KEEP_COMPANY_SLUGS } } },
        ]
      }
    });
    results.push(`Deleted ${deletedConversations.count} conversations`);

    // Delete applications (depends on teams)
    const deletedApplications = await prisma.teamApplication.deleteMany({
      where: {
        team: { slug: { notIn: KEEP_TEAM_SLUGS } }
      }
    });
    results.push(`Deleted ${deletedApplications.count} applications`);

    // Delete opportunities from non-essential companies
    const deletedOpportunities = await prisma.opportunity.deleteMany({
      where: {
        company: { slug: { notIn: KEEP_COMPANY_SLUGS } }
      }
    });
    results.push(`Deleted ${deletedOpportunities.count} opportunities`);

    // Delete team members from non-essential teams
    const deletedTeamMembers = await prisma.teamMember.deleteMany({
      where: {
        team: { slug: { notIn: KEEP_TEAM_SLUGS } }
      }
    });
    results.push(`Deleted ${deletedTeamMembers.count} team members`);

    // Delete non-essential teams
    const deletedTeams = await prisma.team.deleteMany({
      where: {
        slug: { notIn: KEEP_TEAM_SLUGS }
      }
    });
    results.push(`Deleted ${deletedTeams.count} teams`);

    // Delete company users from non-essential companies
    const deletedCompanyUsers = await prisma.companyUser.deleteMany({
      where: {
        company: { slug: { notIn: KEEP_COMPANY_SLUGS } }
      }
    });
    results.push(`Deleted ${deletedCompanyUsers.count} company users`);

    // Delete non-essential companies
    const deletedCompanies = await prisma.company.deleteMany({
      where: {
        slug: { notIn: KEEP_COMPANY_SLUGS }
      }
    });
    results.push(`Deleted ${deletedCompanies.count} companies`);

    // Delete individual profiles for non-essential users
    const deletedProfiles = await prisma.individualProfile.deleteMany({
      where: {
        user: { email: { notIn: KEEP_EMAILS } }
      }
    });
    results.push(`Deleted ${deletedProfiles.count} individual profiles`);

    // Delete user skills for non-essential users
    const deletedUserSkills = await prisma.userSkill.deleteMany({
      where: {
        user: { email: { notIn: KEEP_EMAILS } }
      }
    });
    results.push(`Deleted ${deletedUserSkills.count} user skills`);

    // Delete non-essential users
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: { notIn: KEEP_EMAILS }
      }
    });
    results.push(`Deleted ${deletedUsers.count} users`);

    // Get counts after cleanup
    const userCountAfter = await prisma.user.count();
    const companyCountAfter = await prisma.company.count();
    const teamCountAfter = await prisma.team.count();

    results.push(`After cleanup: ${userCountAfter} users, ${companyCountAfter} companies, ${teamCountAfter} teams`);

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      results,
      summary: {
        users: { before: userCountBefore, after: userCountAfter, deleted: userCountBefore - userCountAfter },
        companies: { before: companyCountBefore, after: companyCountAfter, deleted: companyCountBefore - companyCountAfter },
        teams: { before: teamCountBefore, after: teamCountAfter, deleted: teamCountBefore - teamCountAfter },
      }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with secret to cleanup non-essential demo data',
    usage: 'POST /api/cleanup?secret=liftout-seed-2024',
    willKeep: {
      users: KEEP_EMAILS,
      companies: KEEP_COMPANY_SLUGS,
      teams: KEEP_TEAM_SLUGS,
    }
  });
}
