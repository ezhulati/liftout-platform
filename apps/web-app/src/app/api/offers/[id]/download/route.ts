import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Download offer letter as PDF-style text document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'txt';

    // Get offer details
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: {
            title: true,
            compensationMin: true,
            compensationMax: true,
            compensationCurrency: true,
            equityOffered: true,
            equityRange: true,
            remotePolicy: true,
            location: true,
            startDate: true,
            company: {
              select: {
                name: true,
                websiteUrl: true,
                industry: true,
              },
            },
          },
        },
        team: {
          select: {
            name: true,
            members: {
              where: { status: 'active' },
              select: {
                role: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check access
    const isTeamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!isTeamMember) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Parse offer details
    const offerDetails = application.offerDetails as Record<string, unknown> || {};
    const salary = offerDetails.salary || application.opportunity.compensationMin;
    const salaryMax = offerDetails.salaryMax || application.opportunity.compensationMax;
    const currency = (offerDetails.currency || application.opportunity.compensationCurrency || 'USD') as string;
    const equity = offerDetails.equity || (application.opportunity.equityOffered ? application.opportunity.equityRange : null);

    // Format salary
    const formatSalary = (amount: number | null | undefined) => {
      if (!amount) return 'Not specified';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const salaryRange = salaryMax
      ? `${formatSalary(salary as number)} - ${formatSalary(salaryMax as number)}`
      : formatSalary(salary as number);

    // Generate offer letter content
    const offerDate = application.offerMadeAt
      ? new Date(application.offerMadeAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    const startDate = application.availabilityDate
      ? new Date(application.availabilityDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'To be determined';

    const responseDeadline = application.responseDeadline
      ? new Date(application.responseDeadline).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Within 5 business days';

    const teamMembers = application.team.members
      .map((m) => `  - ${m.user?.firstName} ${m.user?.lastName}${m.role ? ` (${m.role})` : ''}`)
      .join('\n');

    const letterContent = `
================================================================================
                           OFFER OF EMPLOYMENT
================================================================================

Date: ${offerDate}

FROM:
${application.opportunity.company.name}
${application.opportunity.company.websiteUrl || ''}
Industry: ${application.opportunity.company.industry || 'Not specified'}

TO:
${application.team.name}

Team Members:
${teamMembers}

--------------------------------------------------------------------------------
                              POSITION DETAILS
--------------------------------------------------------------------------------

Position: ${application.opportunity.title}
Location: ${application.opportunity.location || 'Not specified'}
Work Arrangement: ${application.opportunity.remotePolicy || 'Not specified'}
Proposed Start Date: ${startDate}

--------------------------------------------------------------------------------
                              COMPENSATION
--------------------------------------------------------------------------------

Base Salary: ${salaryRange} per year
${equity ? `Equity: ${equity}` : ''}
${(offerDetails.bonus as string) ? `Signing Bonus: ${offerDetails.bonus}` : ''}

${(offerDetails.benefits as string[])?.length ? `Benefits:\n${(offerDetails.benefits as string[]).map((b: string) => `  - ${b}`).join('\n')}` : ''}

--------------------------------------------------------------------------------
                              TERMS
--------------------------------------------------------------------------------

This offer is contingent upon:
- Successful completion of background verification
- Proof of eligibility to work in the applicable jurisdiction
- Signing of confidentiality and non-compete agreements as required

Response Deadline: ${responseDeadline}

--------------------------------------------------------------------------------
                              STATUS
--------------------------------------------------------------------------------

Offer Status: ${
      application.status === 'accepted'
        ? 'ACCEPTED'
        : application.status === 'rejected'
        ? 'DECLINED'
        : application.status === 'interviewing'
        ? 'PENDING'
        : application.status.toUpperCase()
    }

${application.responseMessage ? `Response Message: ${application.responseMessage}` : ''}
${application.finalDecisionAt ? `Decision Date: ${new Date(application.finalDecisionAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}

--------------------------------------------------------------------------------

This document is a summary of the offer terms. The official offer letter with
complete terms and conditions will be provided separately.

Generated via Liftout Platform
Reference ID: ${application.id}

================================================================================
`.trim();

    if (format === 'json') {
      return NextResponse.json({
        offerId: application.id,
        company: application.opportunity.company.name,
        position: application.opportunity.title,
        team: application.team.name,
        salary: salaryRange,
        equity,
        startDate,
        status: application.status,
        offerDate,
        responseDeadline,
        content: letterContent,
      });
    }

    // Return as downloadable text file
    return new NextResponse(letterContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="offer-letter-${application.id.slice(0, 8)}.txt"`,
      },
    });
  } catch (error) {
    console.error('Download offer error:', error);
    return NextResponse.json(
      { error: 'Failed to download offer' },
      { status: 500 }
    );
  }
}
