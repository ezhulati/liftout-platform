import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Export user profile as JSON or text
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            currentTitle: true,
            currentEmployer: true,
            title: true,
            location: true,
            bio: true,
            profilePhotoUrl: true,
            linkedinUrl: true,
            portfolioUrl: true,
            resumeUrl: true,
            skillsSummary: true,
            achievements: true,
          },
        },
        skills: {
          select: {
            skill: {
              select: {
                name: true,
              },
            },
            proficiencyLevel: true,
            yearsExperience: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const profile = user.profile;

    // Format profile data
    const profileData = {
      name: fullName,
      email: user.email,
      title: profile?.currentTitle || profile?.title,
      company: profile?.currentEmployer,
      location: profile?.location,
      bio: profile?.bio,
      skillsSummary: profile?.skillsSummary,
      achievements: profile?.achievements,
      linkedinUrl: profile?.linkedinUrl,
      portfolioUrl: profile?.portfolioUrl,
      resumeUrl: profile?.resumeUrl,
      skills: user.skills.map(s => ({
        name: s.skill.name,
        level: s.proficiencyLevel,
        years: s.yearsExperience,
      })),
      memberSince: user.createdAt?.toISOString(),
      exportedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      return NextResponse.json(profileData);
    }

    if (format === 'pdf' || format === 'txt') {
      // Generate a text-based export
      const title = profile?.currentTitle || profile?.title;
      const textContent = `
LIFTOUT PROFILE EXPORT
======================

Name: ${fullName || 'N/A'}
Title: ${title || 'N/A'}${profile?.currentEmployer ? ` at ${profile.currentEmployer}` : ''}
Email: ${user.email}
Location: ${profile?.location || 'N/A'}

ABOUT
-----
${profile?.bio || 'No bio provided'}

SKILLS
------
${user.skills.length > 0
  ? user.skills.map(s => `- ${s.skill.name}${s.proficiencyLevel ? ` (${s.proficiencyLevel})` : ''}${s.yearsExperience ? ` - ${s.yearsExperience} years` : ''}`).join('\n')
  : 'No skills listed'}

LINKS
-----
${profile?.linkedinUrl ? `LinkedIn: ${profile.linkedinUrl}` : ''}
${profile?.portfolioUrl ? `Portfolio: ${profile.portfolioUrl}` : ''}
${profile?.resumeUrl ? `Resume: ${profile.resumeUrl}` : ''}

---
Exported from Liftout on ${new Date().toLocaleDateString()}
      `.trim();

      const filename = `${fullName.replace(/\s+/g, '_') || 'profile'}_liftout.txt`;

      return new NextResponse(textContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Export profile error:', error);
    return NextResponse.json(
      { error: 'Failed to export profile' },
      { status: 500 }
    );
  }
}
