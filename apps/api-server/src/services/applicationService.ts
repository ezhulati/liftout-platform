import { prisma } from '../lib/prisma';
import { TeamApplication, ExpressionOfInterest, ApplicationStatus, Prisma } from '@prisma/client';
import { getPaginationParams } from '../lib/utils';
import { NotFoundError, AuthorizationError, ValidationError } from '../middleware/errorHandler';
import { sendApplicationStatusEmail, sendExpressionOfInterestEmail } from '../lib/email';
import { logger } from '../utils/logger';

// Types
export interface ApplicationFilters {
  status?: ApplicationStatus;
  teamId?: string;
  opportunityId?: string;
}

export interface CreateApplicationInput {
  teamId: string;
  opportunityId: string;
  coverLetter?: string;
  proposedCompensation?: number;
  proposedEquity?: string;
  availabilityDate?: Date;
  customProposal?: string;
  teamFitExplanation?: string;
  questionsForCompany?: string;
  attachments?: string[];
}

export interface UpdateStatusInput {
  status: ApplicationStatus;
  rejectionReason?: string;
  responseMessage?: string;
  recruiterNotes?: string;
  hiringManagerNotes?: string;
  responseDeadline?: Date;
}

export interface ScheduleInterviewInput {
  scheduledAt: Date;
  format: 'video' | 'in_person' | 'phone';
  duration: number;
  participants?: string[];
  notes?: string;
  location?: string;
  meetingLink?: string;
}

export interface InterviewFeedbackInput {
  rating: number;
  strengths: string[];
  concerns: string[];
  recommendation: 'proceed' | 'hold' | 'reject';
  notes?: string;
  interviewerName: string;
}

export interface OfferDetailsInput {
  compensation: number;
  equityOffer?: string;
  benefits?: string[];
  startDate?: Date;
  signingBonus?: number;
  additionalTerms?: string;
  expirationDate?: Date;
}

export interface CreateEOIInput {
  fromType: 'team' | 'company';
  toType: 'team' | 'opportunity';
  toId: string;
  message?: string;
  interestLevel?: string;
  specificRole?: string;
  timeline?: string;
  budgetRange?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Valid state transitions
const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  submitted: ['reviewing', 'rejected'],
  reviewing: ['interviewing', 'rejected'],
  interviewing: ['accepted', 'rejected'],
  accepted: [],
  rejected: [],
};

type ApplicationAction =
  | 'view'
  | 'create'
  | 'update_content'
  | 'withdraw'
  | 'update_status'
  | 'schedule_interview'
  | 'add_feedback'
  | 'make_offer';

class ApplicationService {
  /**
   * Validate if a state transition is allowed
   */
  private validateStateTransition(currentStatus: ApplicationStatus, newStatus: ApplicationStatus): boolean {
    const validNextStates = VALID_TRANSITIONS[currentStatus];
    return validNextStates.includes(newStatus);
  }

  /**
   * Send application status emails to all team members
   */
  private async sendStatusEmailsToTeam(
    teamId: string,
    teamName: string,
    opportunityTitle: string,
    companyName: string,
    status: 'reviewing' | 'interviewing' | 'accepted' | 'rejected',
    message?: string
  ): Promise<void> {
    // Get all active team members
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId, status: 'active' },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
      },
    });

    // Send emails to all team members (fire and forget)
    for (const member of teamMembers) {
      sendApplicationStatusEmail({
        to: member.user.email,
        firstName: member.user.firstName,
        teamName,
        opportunityTitle,
        companyName,
        status,
        message,
      }).then(result => {
        if (result.success) {
          logger.info(`Application status email sent to: ${member.user.email} (status: ${status})`);
        } else {
          logger.error(`Failed to send application status email to ${member.user.email}: ${result.error}`);
        }
      });
    }
  }

  /**
   * Check if user can perform an action on an application
   */
  async canUserActOnApplication(
    application: TeamApplication,
    userId: string,
    action: ApplicationAction
  ): Promise<{ canAct: boolean; reason?: string }> {
    // Team actions (create, update_content, withdraw, view team's applications)
    if (['create', 'update_content', 'withdraw'].includes(action)) {
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: application.teamId,
            userId,
          },
        },
      });

      if (!teamMember) {
        return { canAct: false, reason: 'User is not a member of this team' };
      }

      if (!teamMember.isAdmin && !teamMember.isLead) {
        return { canAct: false, reason: 'Only team leads or admins can perform this action' };
      }

      // Can only update content before company starts reviewing
      if (action === 'update_content' && application.status !== 'submitted') {
        return { canAct: false, reason: 'Cannot modify application after review has started' };
      }

      // Cannot withdraw accepted applications
      if (action === 'withdraw' && application.status === 'accepted') {
        return { canAct: false, reason: 'Cannot withdraw an accepted application' };
      }

      return { canAct: true };
    }

    // Company actions (update_status, schedule_interview, add_feedback, make_offer)
    if (['update_status', 'schedule_interview', 'add_feedback', 'make_offer'].includes(action)) {
      // Get the opportunity to check company ownership
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: application.opportunityId },
        include: {
          company: {
            include: {
              users: {
                where: { userId },
              },
            },
          },
        },
      });

      if (!opportunity) {
        return { canAct: false, reason: 'Opportunity not found' };
      }

      if (opportunity.company.users.length === 0) {
        return { canAct: false, reason: 'User does not belong to the company that posted this opportunity' };
      }

      // make_offer requires admin role
      if (action === 'make_offer') {
        const companyUser = opportunity.company.users[0];
        if (companyUser.role !== 'admin' && companyUser.role !== 'owner') {
          return { canAct: false, reason: 'Only company admins can make offers' };
        }
      }

      return { canAct: true };
    }

    // View permission - either team member or company user
    if (action === 'view') {
      // Check if team member
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: application.teamId,
            userId,
          },
        },
      });

      if (teamMember) {
        return { canAct: true };
      }

      // Check if company user
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: application.opportunityId },
        include: {
          company: {
            include: {
              users: {
                where: { userId },
              },
            },
          },
        },
      });

      if (opportunity && opportunity.company.users.length > 0) {
        return { canAct: true };
      }

      return { canAct: false, reason: 'User does not have permission to view this application' };
    }

    return { canAct: false, reason: 'Unknown action' };
  }

  /**
   * Create a new application
   */
  async createApplication(
    data: CreateApplicationInput,
    userId: string
  ): Promise<TeamApplication> {
    // Check if team exists and user is lead/admin
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId,
        },
      },
    });

    if (!teamMember) {
      throw new AuthorizationError('You are not a member of this team');
    }

    if (!teamMember.isAdmin && !teamMember.isLead) {
      throw new AuthorizationError('Only team leads or admins can submit applications');
    }

    // Check if opportunity exists and is active
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: data.opportunityId },
    });

    if (!opportunity) {
      throw new NotFoundError('Opportunity not found');
    }

    if (opportunity.status !== 'active') {
      throw new ValidationError('Cannot apply to an inactive opportunity');
    }

    // Check for existing application
    const existingApplication = await prisma.teamApplication.findUnique({
      where: {
        teamId_opportunityId: {
          teamId: data.teamId,
          opportunityId: data.opportunityId,
        },
      },
    });

    if (existingApplication) {
      throw new ValidationError('Your team has already applied to this opportunity');
    }

    // Create application
    const application = await prisma.teamApplication.create({
      data: {
        teamId: data.teamId,
        opportunityId: data.opportunityId,
        appliedBy: userId,
        coverLetter: data.coverLetter,
        proposedCompensation: data.proposedCompensation,
        proposedEquity: data.proposedEquity,
        availabilityDate: data.availabilityDate,
        customProposal: data.customProposal,
        teamFitExplanation: data.teamFitExplanation,
        questionsForCompany: data.questionsForCompany,
        attachments: data.attachments || [],
        status: 'submitted',
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            size: true,
          },
        },
        opportunity: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    // Increment applications count on opportunity
    await prisma.opportunity.update({
      where: { id: data.opportunityId },
      data: {
        applicationsCount: { increment: 1 },
      },
    });

    return application;
  }

  /**
   * Get application by ID
   */
  async getApplicationById(id: string, userId: string): Promise<TeamApplication> {
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: {
              where: { status: 'active' },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profile: {
                      select: {
                        title: true,
                        profilePhotoUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        opportunity: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                industry: true,
              },
            },
          },
        },
        applier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check permissions
    const { canAct, reason } = await this.canUserActOnApplication(application, userId, 'view');
    if (!canAct) {
      throw new AuthorizationError(reason || 'Access denied');
    }

    return application;
  }

  /**
   * Get applications for a team
   */
  async getApplicationsByTeam(
    teamId: string,
    userId: string,
    filters: ApplicationFilters = {},
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedResult<TeamApplication>> {
    // Check if user is team member
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!teamMember) {
      throw new AuthorizationError('You are not a member of this team');
    }

    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    const where: Prisma.TeamApplicationWhereInput = { teamId };

    if (filters.status) {
      where.status = filters.status;
    }

    const [applications, total] = await Promise.all([
      prisma.teamApplication.findMany({
        where,
        include: {
          opportunity: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                  industry: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.teamApplication.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get applications for an opportunity (company view)
   */
  async getApplicationsByOpportunity(
    opportunityId: string,
    userId: string,
    filters: ApplicationFilters = {},
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedResult<TeamApplication>> {
    // Check if user belongs to company that owns the opportunity
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        company: {
          include: {
            users: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!opportunity) {
      throw new NotFoundError('Opportunity not found');
    }

    if (opportunity.company.users.length === 0) {
      throw new AuthorizationError('You do not have access to this opportunity');
    }

    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    const where: Prisma.TeamApplicationWhereInput = { opportunityId };

    if (filters.status) {
      where.status = filters.status;
    }

    const [applications, total] = await Promise.all([
      prisma.teamApplication.findMany({
        where,
        include: {
          team: {
            include: {
              members: {
                where: { status: 'active' },
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      profile: {
                        select: {
                          title: true,
                          profilePhotoUrl: true,
                          yearsExperience: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          applier: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip,
        take,
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.teamApplication.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    id: string,
    data: UpdateStatusInput,
    userId: string
  ): Promise<TeamApplication> {
    const application = await prisma.teamApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check permissions
    const { canAct, reason } = await this.canUserActOnApplication(application, userId, 'update_status');
    if (!canAct) {
      throw new AuthorizationError(reason || 'Access denied');
    }

    // Validate state transition
    if (!this.validateStateTransition(application.status, data.status)) {
      throw new ValidationError(
        `Cannot transition from ${application.status} to ${data.status}`
      );
    }

    // Require rejection reason when rejecting
    if (data.status === 'rejected' && !data.rejectionReason) {
      throw new ValidationError('Rejection reason is required');
    }

    const updateData: Prisma.TeamApplicationUpdateInput = {
      status: data.status,
      ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
      ...(data.responseMessage && { responseMessage: data.responseMessage }),
      ...(data.recruiterNotes && { recruiterNotes: data.recruiterNotes }),
      ...(data.hiringManagerNotes && { hiringManagerNotes: data.hiringManagerNotes }),
      ...(data.responseDeadline && { responseDeadline: data.responseDeadline }),
    };

    // Set timestamp based on status
    if (data.status === 'reviewing') {
      updateData.reviewedAt = new Date();
    } else if (data.status === 'accepted' || data.status === 'rejected') {
      updateData.finalDecisionAt = new Date();
    }

    const updatedApplication = await prisma.teamApplication.update({
      where: { id },
      data: updateData,
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Send status update emails to team members
    const team = updatedApplication.team as { id: string; name: string };
    const opportunity = updatedApplication.opportunity as { id: string; title: string; company: { id: string; name: string } };

    this.sendStatusEmailsToTeam(
      team.id,
      team.name,
      opportunity.title,
      opportunity.company.name,
      data.status as 'reviewing' | 'interviewing' | 'accepted' | 'rejected',
      data.responseMessage || data.rejectionReason
    );

    return updatedApplication;
  }

  /**
   * Withdraw an application
   */
  async withdrawApplication(id: string, userId: string): Promise<TeamApplication> {
    const application = await prisma.teamApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check permissions
    const { canAct, reason } = await this.canUserActOnApplication(application, userId, 'withdraw');
    if (!canAct) {
      throw new AuthorizationError(reason || 'Access denied');
    }

    // Delete the application (or you could soft-delete by adding a withdrawn status)
    await prisma.teamApplication.delete({
      where: { id },
    });

    // Decrement applications count on opportunity
    await prisma.opportunity.update({
      where: { id: application.opportunityId },
      data: {
        applicationsCount: { decrement: 1 },
      },
    });

    return application;
  }

  /**
   * Schedule an interview
   */
  async scheduleInterview(
    id: string,
    data: ScheduleInterviewInput,
    userId: string
  ): Promise<TeamApplication> {
    const application = await prisma.teamApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check permissions
    const { canAct, reason } = await this.canUserActOnApplication(application, userId, 'schedule_interview');
    if (!canAct) {
      throw new AuthorizationError(reason || 'Access denied');
    }

    // Must be in reviewing status to schedule interview
    if (application.status !== 'reviewing') {
      throw new ValidationError('Can only schedule interviews for applications in reviewing status');
    }

    const updatedApplication = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: 'interviewing',
        interviewScheduledAt: data.scheduledAt,
        interviewFeedback: {
          scheduled: {
            scheduledAt: data.scheduledAt.toISOString(),
            format: data.format,
            duration: data.duration,
            participants: data.participants || [],
            notes: data.notes,
            location: data.location,
            meetingLink: data.meetingLink,
          },
          feedback: [],
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Send interview scheduled emails to team members
    const team = updatedApplication.team as { id: string; name: string };
    const opportunity = updatedApplication.opportunity as { id: string; title: string; company: { id: string; name: string } };
    const interviewDate = data.scheduledAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this.sendStatusEmailsToTeam(
      team.id,
      team.name,
      opportunity.title,
      opportunity.company.name,
      'interviewing',
      `Your interview has been scheduled for ${interviewDate}. Format: ${data.format}${data.meetingLink ? `. Meeting link: ${data.meetingLink}` : ''}`
    );

    return updatedApplication;
  }

  /**
   * Add interview feedback
   */
  async addInterviewFeedback(
    id: string,
    feedback: InterviewFeedbackInput,
    userId: string
  ): Promise<TeamApplication> {
    const application = await prisma.teamApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check permissions
    const { canAct, reason } = await this.canUserActOnApplication(application, userId, 'add_feedback');
    if (!canAct) {
      throw new AuthorizationError(reason || 'Access denied');
    }

    // Must be in interviewing status
    if (application.status !== 'interviewing') {
      throw new ValidationError('Can only add feedback for applications in interviewing status');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentFeedback = application.interviewFeedback as any;
    const feedbackList = currentFeedback?.feedback || [];

    const updatedApplication = await prisma.teamApplication.update({
      where: { id },
      data: {
        interviewFeedback: {
          ...currentFeedback,
          feedback: [
            ...feedbackList,
            {
              ...feedback,
              submittedAt: new Date().toISOString(),
              submittedBy: userId,
            },
          ],
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return updatedApplication;
  }

  /**
   * Make an offer
   */
  async makeOffer(
    id: string,
    offerDetails: OfferDetailsInput,
    userId: string
  ): Promise<TeamApplication> {
    const application = await prisma.teamApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check permissions
    const { canAct, reason } = await this.canUserActOnApplication(application, userId, 'make_offer');
    if (!canAct) {
      throw new AuthorizationError(reason || 'Access denied');
    }

    // Must be in interviewing status to make offer
    if (application.status !== 'interviewing') {
      throw new ValidationError('Can only make offers for applications in interviewing status');
    }

    const updatedApplication = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: 'accepted',
        offerMadeAt: new Date(),
        finalDecisionAt: new Date(),
        offerDetails: {
          compensation: offerDetails.compensation,
          equityOffer: offerDetails.equityOffer,
          benefits: offerDetails.benefits || [],
          startDate: offerDetails.startDate?.toISOString(),
          signingBonus: offerDetails.signingBonus,
          additionalTerms: offerDetails.additionalTerms,
          expirationDate: offerDetails.expirationDate?.toISOString(),
        },
        responseDeadline: offerDetails.expirationDate,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Update opportunity status to filled
    await prisma.opportunity.update({
      where: { id: application.opportunityId },
      data: { status: 'filled' },
    });

    // Send offer notification emails to team members
    const team = updatedApplication.team as { id: string; name: string };
    const opportunity = updatedApplication.opportunity as { id: string; title: string; company: { id: string; name: string } };
    const compensationFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(offerDetails.compensation);

    this.sendStatusEmailsToTeam(
      team.id,
      team.name,
      opportunity.title,
      opportunity.company.name,
      'accepted',
      `Congratulations! You have received an offer with a compensation of ${compensationFormatted}${offerDetails.equityOffer ? ` plus ${offerDetails.equityOffer} equity` : ''}.${offerDetails.expirationDate ? ` Please respond by ${offerDetails.expirationDate.toLocaleDateString()}.` : ''}`
    );

    return updatedApplication;
  }

  // ==========================================
  // Expression of Interest Methods
  // ==========================================

  /**
   * Create an expression of interest
   */
  async createExpressionOfInterest(
    data: CreateEOIInput,
    userId: string
  ): Promise<ExpressionOfInterest> {
    let fromId: string;

    // Determine the fromId based on fromType
    if (data.fromType === 'team') {
      // User must be team lead/admin
      const teamMembers = await prisma.teamMember.findMany({
        where: {
          userId,
          OR: [{ isAdmin: true }, { isLead: true }],
          status: 'active',
        },
      });

      if (teamMembers.length === 0) {
        throw new AuthorizationError('You must be a team lead or admin to express interest');
      }

      fromId = teamMembers[0].teamId;
    } else {
      // User must be company user
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId },
      });

      if (!companyUser) {
        throw new AuthorizationError('You must belong to a company to express interest');
      }

      fromId = companyUser.companyId;
    }

    // Validate target exists
    if (data.toType === 'team') {
      const team = await prisma.team.findUnique({
        where: { id: data.toId },
      });
      if (!team) {
        throw new NotFoundError('Target team not found');
      }
    } else {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: data.toId },
      });
      if (!opportunity) {
        throw new NotFoundError('Target opportunity not found');
      }
    }

    // Check for existing EOI
    const existingEOI = await prisma.expressionOfInterest.findFirst({
      where: {
        fromType: data.fromType,
        fromId,
        toType: data.toType,
        toId: data.toId,
        status: 'pending',
      },
    });

    if (existingEOI) {
      throw new ValidationError('An expression of interest already exists');
    }

    const eoi = await prisma.expressionOfInterest.create({
      data: {
        fromType: data.fromType,
        fromId,
        toType: data.toType,
        toId: data.toId,
        message: data.message,
        interestLevel: data.interestLevel || 'medium',
        specificRole: data.specificRole,
        timeline: data.timeline,
        budgetRange: data.budgetRange,
        status: 'pending',
      },
    });

    // Send notification emails to the target (fire and forget)
    this.sendEOINotificationEmails(eoi, data.fromType, fromId, data.toType, data.toId, data.message);

    return eoi;
  }

  /**
   * Send EOI notification emails to the target
   */
  private async sendEOINotificationEmails(
    eoi: ExpressionOfInterest,
    fromType: 'team' | 'company',
    fromId: string,
    toType: 'team' | 'opportunity',
    toId: string,
    message?: string
  ): Promise<void> {
    try {
      // Get the interested party's name
      let interestedPartyName: string;
      if (fromType === 'team') {
        const team = await prisma.team.findUnique({
          where: { id: fromId },
          select: { name: true },
        });
        interestedPartyName = team?.name || 'A team';
      } else {
        const company = await prisma.company.findUnique({
          where: { id: fromId },
          select: { name: true },
        });
        interestedPartyName = company?.name || 'A company';
      }

      // Get recipients and target name
      let recipients: { email: string; firstName: string }[] = [];
      let targetName: string;

      if (toType === 'team') {
        // Get team leads/admins to notify
        const team = await prisma.team.findUnique({
          where: { id: toId },
          include: {
            members: {
              where: {
                status: 'active',
                OR: [{ isAdmin: true }, { isLead: true }],
              },
              include: {
                user: {
                  select: {
                    email: true,
                    firstName: true,
                  },
                },
              },
            },
          },
        });
        targetName = team?.name || 'your team';
        recipients = team?.members.map(m => ({
          email: m.user.email,
          firstName: m.user.firstName,
        })) || [];
      } else {
        // Get company users to notify for opportunity
        const opportunity = await prisma.opportunity.findUnique({
          where: { id: toId },
          include: {
            company: {
              include: {
                users: {
                  include: {
                    user: {
                      select: {
                        email: true,
                        firstName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        targetName = opportunity?.title || 'your opportunity';
        recipients = opportunity?.company.users.map(cu => ({
          email: cu.user.email,
          firstName: cu.user.firstName,
        })) || [];
      }

      // Send emails to all recipients
      for (const recipient of recipients) {
        sendExpressionOfInterestEmail({
          to: recipient.email,
          recipientName: recipient.firstName,
          interestedPartyName,
          interestedPartyType: fromType,
          targetName,
          message,
          interestId: eoi.id,
        }).then(result => {
          if (result.success) {
            logger.info(`EOI notification email sent to: ${recipient.email}`);
          } else {
            logger.error(`Failed to send EOI notification to ${recipient.email}: ${result.error}`);
          }
        });
      }
    } catch (error) {
      logger.error('Error sending EOI notification emails:', error);
      // Don't throw - EOI was created successfully, email failure shouldn't break the flow
    }
  }

  /**
   * Respond to an expression of interest
   */
  async respondToExpressionOfInterest(
    id: string,
    response: 'accepted' | 'declined',
    userId: string
  ): Promise<ExpressionOfInterest> {
    const eoi = await prisma.expressionOfInterest.findUnique({
      where: { id },
    });

    if (!eoi) {
      throw new NotFoundError('Expression of interest not found');
    }

    if (eoi.status !== 'pending') {
      throw new ValidationError('This expression of interest has already been responded to');
    }

    // Check if user can respond (must be the target)
    let canRespond = false;

    if (eoi.toType === 'team') {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          teamId: eoi.toId,
          userId,
          OR: [{ isAdmin: true }, { isLead: true }],
        },
      });
      canRespond = !!teamMember;
    } else {
      // toType is opportunity - check if user owns the opportunity
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: eoi.toId },
        include: {
          company: {
            include: {
              users: {
                where: { userId },
              },
            },
          },
        },
      });
      canRespond = (opportunity?.company.users.length || 0) > 0;
    }

    if (!canRespond) {
      throw new AuthorizationError('You do not have permission to respond to this expression of interest');
    }

    const updatedEOI = await prisma.expressionOfInterest.update({
      where: { id },
      data: {
        status: response,
        respondedAt: new Date(),
      },
    });

    return updatedEOI;
  }

  /**
   * Get expressions of interest for a user
   */
  async getExpressionsOfInterest(
    userId: string,
    type: 'sent' | 'received',
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedResult<ExpressionOfInterest>> {
    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    // Get user's teams and company
    const [teamMemberships, companyUser] = await Promise.all([
      prisma.teamMember.findMany({
        where: { userId, status: 'active' },
        select: { teamId: true },
      }),
      prisma.companyUser.findFirst({
        where: { userId },
        select: { companyId: true },
      }),
    ]);

    const teamIds = teamMemberships.map((m) => m.teamId);
    const companyId = companyUser?.companyId;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any;

    if (type === 'sent') {
      where = {
        OR: [
          { fromType: 'team', fromId: { in: teamIds } },
          ...(companyId ? [{ fromType: 'company', fromId: companyId }] : []),
        ],
      };
    } else {
      // Get opportunities for the company too
      const companyOpportunities = companyId
        ? await prisma.opportunity.findMany({
            where: { companyId },
            select: { id: true },
          })
        : [];
      const opportunityIds = companyOpportunities.map((o) => o.id);

      where = {
        OR: [
          { toType: 'team', toId: { in: teamIds } },
          { toType: 'opportunity', toId: { in: opportunityIds } },
        ],
      };
    }

    const [eois, total] = await Promise.all([
      prisma.expressionOfInterest.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.expressionOfInterest.count({ where }),
    ]);

    return {
      data: eois,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get application statistics for a user
   */
  async getApplicationStats(userId: string) {
    // Get user's teams
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId, status: 'active' },
      select: { teamId: true },
    });
    const teamIds = teamMemberships.map((m) => m.teamId);

    // Get company user info
    const companyUser = await prisma.companyUser.findFirst({
      where: { userId },
      select: { companyId: true },
    });

    // Team stats (applications sent by teams)
    const teamStats = teamIds.length > 0
      ? await prisma.teamApplication.groupBy({
          by: ['status'],
          where: { teamId: { in: teamIds } },
          _count: true,
        })
      : [];

    // Company stats (applications received)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let companyStats: any[] = [];
    if (companyUser) {
      const opportunities = await prisma.opportunity.findMany({
        where: { companyId: companyUser.companyId },
        select: { id: true },
      });
      const oppIds = opportunities.map((o) => o.id);

      if (oppIds.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        companyStats = await (prisma.teamApplication.groupBy as any)({
          by: ['status'],
          where: { opportunityId: { in: oppIds } },
          _count: true,
        });
      }
    }

    return {
      teamApplications: teamStats.reduce((acc: Record<string, number>, stat: { status: string; _count: number }) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {}),
      receivedApplications: companyStats.reduce((acc: Record<string, number>, stat: { status: string; _count: number }) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {}),
    };
  }
}

export const applicationService = new ApplicationService();
