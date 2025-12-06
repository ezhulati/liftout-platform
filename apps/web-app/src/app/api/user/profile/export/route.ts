import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Export user profile as JSON or PDF
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
        name: true,
        email: true,
        phone: true,
        title: true,
        location: true,
        bio: true,
        avatarUrl: true,
        linkedinUrl: true,
        skills: true,
        experience: true,
        education: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format profile data
    const profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      title: user.title,
      location: user.location,
      bio: user.bio,
      linkedinUrl: user.linkedinUrl,
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      memberSince: user.createdAt?.toISOString(),
      exportedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      return NextResponse.json(profileData);
    }

    if (format === 'pdf') {
      // Generate a simple text-based PDF-like document
      // In production, use a library like @react-pdf/renderer or puppeteer
      const textContent = `
LIFTOUT PROFILE EXPORT
======================

Name: ${user.name || 'N/A'}
Title: ${user.title || 'N/A'}
Email: ${user.email}
Phone: ${user.phone || 'N/A'}
Location: ${user.location || 'N/A'}

ABOUT
-----
${user.bio || 'No bio provided'}

SKILLS
------
${(user.skills as string[] || []).join(', ') || 'No skills listed'}

EXPERIENCE
----------
${((user.experience as any[]) || []).map((exp: any) =>
  `${exp.title} at ${exp.company}\n${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`
).join('\n\n') || 'No experience listed'}

EDUCATION
---------
${((user.education as any[]) || []).map((edu: any) =>
  `${edu.degree} - ${edu.school}${edu.field ? ` (${edu.field})` : ''}${edu.year ? `, ${edu.year}` : ''}`
).join('\n') || 'No education listed'}

${user.linkedinUrl ? `LinkedIn: ${user.linkedinUrl}` : ''}

---
Exported from Liftout on ${new Date().toLocaleDateString()}
      `.trim();

      // Return as plain text with PDF mime type (a simplified version)
      // In production, generate actual PDF
      return new NextResponse(textContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="${user.name?.replace(/\s+/g, '_') || 'profile'}_liftout.txt"`,
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
