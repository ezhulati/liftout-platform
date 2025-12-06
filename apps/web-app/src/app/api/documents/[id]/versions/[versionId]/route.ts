import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/documents/[id]/versions/[versionId] - Get a specific version
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: documentId, versionId } = params;

    // Fetch the specific version with document info
    const version = await prisma.documentVersion.findUnique({
      where: { id: versionId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        document: {
          select: {
            id: true,
            name: true,
            currentVersion: true,
          },
        },
      },
    });

    if (!version || version.documentId !== documentId) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: version.id,
        versionNumber: version.versionNumber,
        filename: version.filename,
        fileSize: version.fileSize,
        storageUrl: version.storageUrl,
        checksum: version.checksum,
        changeDescription: version.changeDescription,
        uploadedBy: version.uploadedBy,
        createdAt: version.createdAt.toISOString(),
        isCurrent: version.versionNumber === version.document.currentVersion,
        document: version.document,
      },
    });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 }
    );
  }
}

// POST /api/documents/[id]/versions/[versionId] - Restore/revert to this version
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: documentId, versionId } = params;

    // Fetch the version to restore
    const versionToRestore = await prisma.documentVersion.findUnique({
      where: { id: versionId },
      include: {
        document: true,
      },
    });

    if (!versionToRestore || versionToRestore.documentId !== documentId) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    const nextVersion = versionToRestore.document.currentVersion + 1;

    // Create a new version as a copy of the old one (restore = create new version with old content)
    const [newVersion, updatedDocument] = await prisma.$transaction([
      prisma.documentVersion.create({
        data: {
          documentId,
          versionNumber: nextVersion,
          filename: versionToRestore.filename,
          fileSize: versionToRestore.fileSize,
          storageUrl: versionToRestore.storageUrl,
          checksum: versionToRestore.checksum,
          changeDescription: `Restored from version ${versionToRestore.versionNumber}`,
          uploadedById: session.user.id,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.document.update({
        where: { id: documentId },
        data: {
          currentVersion: nextVersion,
          filename: versionToRestore.filename,
          fileSize: versionToRestore.fileSize,
          storageUrl: versionToRestore.storageUrl,
          checksum: versionToRestore.checksum,
          updatedAt: new Date(),
        },
      }),
    ]);

    // Log the restore action
    await prisma.documentAccessLog.create({
      data: {
        documentId,
        userId: session.user.id,
        action: 'restore',
        outcome: 'success',
        versionId: newVersion.id,
        metadata: {
          restoredFromVersionId: versionId,
          restoredFromVersionNumber: versionToRestore.versionNumber,
          newVersionNumber: nextVersion,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Version restored successfully',
      data: {
        version: {
          id: newVersion.id,
          versionNumber: newVersion.versionNumber,
          filename: newVersion.filename,
          changeDescription: newVersion.changeDescription,
          uploadedBy: newVersion.uploadedBy,
          createdAt: newVersion.createdAt.toISOString(),
        },
        document: {
          id: updatedDocument.id,
          currentVersion: updatedDocument.currentVersion,
        },
        restoredFromVersion: versionToRestore.versionNumber,
      },
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
