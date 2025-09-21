import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// In-memory storage for demo purposes
let applications: any[] = [];

interface CreateApplicationRequest {
  opportunityId: string;
  teamId: string;
  coverLetter: string;
  whyInterested: string;
  questionsForCompany?: string;
  availabilityTimeline: string;
  compensationExpectations?: string;
  teamLead: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const opportunityId = searchParams.get('opportunityId');
  const teamId = searchParams.get('teamId');
  const status = searchParams.get('status');

  let filteredApplications = applications;

  // Filter by opportunity (for companies viewing applications to their opportunities)
  if (opportunityId) {
    filteredApplications = filteredApplications.filter(app => app.opportunityId === opportunityId);
  }

  // Filter by team (for team users viewing their applications)
  if (teamId) {
    filteredApplications = filteredApplications.filter(app => app.teamId === teamId);
  }

  // Filter by status
  if (status) {
    filteredApplications = filteredApplications.filter(app => app.status === status);
  }

  // Filter by user access (teams can see their own applications, companies can see applications to their opportunities)
  if (session.user.userType === 'individual') {
    // Team users can only see applications from their teams
    filteredApplications = filteredApplications.filter(app => app.applicantUserId === session.user.id);
  } else if (session.user.userType === 'company') {
    // Company users can see applications to opportunities they created
    // In a real app, we'd fetch opportunities created by this company and filter accordingly
    // For demo, we'll show all applications
  }

  return NextResponse.json({ 
    success: true, 
    applications: filteredApplications 
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only team users can create applications
  if (session.user.userType !== 'individual') {
    return NextResponse.json({ error: 'Only team users can apply to opportunities' }, { status: 403 });
  }

  try {
    const data: CreateApplicationRequest = await request.json();

    // Validate required fields
    if (!data.opportunityId || !data.teamId || !data.coverLetter || !data.whyInterested || !data.availabilityTimeline || !data.teamLead) {
      return NextResponse.json({ 
        error: 'Missing required fields: opportunityId, teamId, coverLetter, whyInterested, availabilityTimeline, teamLead' 
      }, { status: 400 });
    }

    // Check if team has already applied to this opportunity
    const existingApplication = applications.find(
      app => app.opportunityId === data.opportunityId && app.teamId === data.teamId
    );

    if (existingApplication) {
      return NextResponse.json({ 
        error: 'Team has already applied to this opportunity' 
      }, { status: 409 });
    }

    const newApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      opportunityId: data.opportunityId,
      teamId: data.teamId,
      applicantUserId: session.user.id,
      coverLetter: data.coverLetter,
      whyInterested: data.whyInterested,
      questionsForCompany: data.questionsForCompany || '',
      availabilityTimeline: data.availabilityTimeline,
      compensationExpectations: data.compensationExpectations || '',
      teamLead: data.teamLead,
      status: 'submitted', // submitted, under_review, interview_scheduled, offer_made, accepted, rejected
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'submitted',
          date: new Date().toISOString(),
          note: 'Expression of interest submitted by team lead',
          actor: session.user.name || session.user.email
        }
      ],
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    };

    applications.push(newApplication);

    return NextResponse.json({ 
      success: true, 
      application: newApplication 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ 
      error: 'Failed to create application' 
    }, { status: 500 });
  }
}