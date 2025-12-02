import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/documents/[id]/versions - List all versions of a document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentId = params.id;

    // Return mock version data (document versioning feature not yet implemented)
    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: documentId,
          name: 'Document',
          currentVersion: 1,
          uploadedBy: {
            id: session.user.id,
            firstName: 'Demo',
            lastName: 'User',
          },
        },
        versions: [
          {
            id: 'v1',
            versionNumber: 1,
            filename: 'document.pdf',
            fileSize: 1024,
            storageUrl: '#',
            changeDescription: 'Initial version',
            uploadedBy: {
              id: session.user.id,
              firstName: 'Demo',
              lastName: 'User',
              email: session.user.email,
            },
            createdAt: new Date().toISOString(),
            isCurrent: true,
          },
        ],
        total: 1,
      },
      _mock: true,
    });
  } catch (error) {
    console.error('Error fetching document versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

// POST /api/documents/[id]/versions - Upload a new version
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentId = params.id;
    const body = await request.json();
    const { filename, fileSize, storageUrl, checksum, changeDescription } = body;

    if (!filename || !fileSize || !storageUrl) {
      return NextResponse.json(
        { error: 'filename, fileSize, and storageUrl are required' },
        { status: 400 }
      );
    }

    // Return mock upload response (document versioning feature not yet implemented)
    return NextResponse.json({
      success: true,
      data: {
        version: {
          id: `v-${Date.now()}`,
          versionNumber: 2,
          filename,
          fileSize,
          storageUrl,
          changeDescription: changeDescription || 'Version 2',
          uploadedBy: {
            id: session.user.id,
            firstName: 'Demo',
            lastName: 'User',
          },
          createdAt: new Date().toISOString(),
        },
        document: {
          id: documentId,
          currentVersion: 2,
        },
      },
      _mock: true,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading new version:', error);
    return NextResponse.json(
      { error: 'Failed to upload new version' },
      { status: 500 }
    );
  }
}
