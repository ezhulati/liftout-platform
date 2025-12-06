import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Fetch document with versions from database
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        versions: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { versionNumber: 'desc' },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Format versions with isCurrent flag
    const versions = document.versions.map((v) => ({
      id: v.id,
      versionNumber: v.versionNumber,
      filename: v.filename,
      fileSize: v.fileSize,
      storageUrl: v.storageUrl,
      checksum: v.checksum,
      changeDescription: v.changeDescription,
      uploadedBy: v.uploadedBy,
      createdAt: v.createdAt.toISOString(),
      isCurrent: v.versionNumber === document.currentVersion,
    }));

    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: document.id,
          name: document.name,
          currentVersion: document.currentVersion,
          uploadedBy: document.uploadedBy,
        },
        versions,
        total: versions.length,
      },
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

    // Fetch current document to get next version number
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const nextVersion = document.currentVersion + 1;

    // Create new version and update document in transaction
    const [newVersion, updatedDocument] = await prisma.$transaction([
      prisma.documentVersion.create({
        data: {
          documentId,
          versionNumber: nextVersion,
          filename,
          fileSize,
          storageUrl,
          checksum,
          changeDescription: changeDescription || `Version ${nextVersion}`,
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
          filename,
          fileSize,
          storageUrl,
          checksum,
          updatedAt: new Date(),
        },
      }),
    ]);

    // Log the upload action
    await prisma.documentAccessLog.create({
      data: {
        documentId,
        userId: session.user.id,
        action: 'upload',
        outcome: 'success',
        versionId: newVersion.id,
        metadata: { versionNumber: nextVersion },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        version: {
          id: newVersion.id,
          versionNumber: newVersion.versionNumber,
          filename: newVersion.filename,
          fileSize: newVersion.fileSize,
          storageUrl: newVersion.storageUrl,
          changeDescription: newVersion.changeDescription,
          uploadedBy: newVersion.uploadedBy,
          createdAt: newVersion.createdAt.toISOString(),
        },
        document: {
          id: updatedDocument.id,
          currentVersion: updatedDocument.currentVersion,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading new version:', error);
    return NextResponse.json(
      { error: 'Failed to upload new version' },
      { status: 500 }
    );
  }
}
