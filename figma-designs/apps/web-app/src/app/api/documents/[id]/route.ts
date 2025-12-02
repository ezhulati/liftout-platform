import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for demo (in production, use database + file storage)
let documents: any[] = [
  {
    id: 'doc_001',
    name: 'TechFlow Team Profile.pdf',
    description: 'Comprehensive team profile with performance metrics and case studies',
    type: 'team_profile',
    fileType: 'pdf',
    size: 2456789,
    uploadedBy: '1', // team user
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    confidential: true,
    accessControl: {
      type: 'restricted', // 'public', 'restricted', 'private'
      allowedUsers: ['2'], // company users who can access
      allowedRoles: ['company'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    },
    metadata: {
      opportunityId: 'opp_001',
      applicationId: null,
      tags: ['team-profile', 'performance-metrics', 'case-studies'],
      version: '1.0',
    },
    downloadCount: 5,
    lastAccessed: new Date().toISOString(),
  },
  {
    id: 'doc_002',
    name: 'Standard NDA Template.pdf',
    description: 'Standard non-disclosure agreement for liftout discussions',
    type: 'legal_document',
    fileType: 'pdf',
    size: 1234567,
    uploadedBy: '2', // company user
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    confidential: false,
    accessControl: {
      type: 'public',
      allowedUsers: [],
      allowedRoles: ['individual', 'company'],
      expiresAt: null,
    },
    metadata: {
      opportunityId: null,
      applicationId: null,
      tags: ['nda', 'legal', 'template'],
      version: '2.1',
    },
    downloadCount: 23,
    lastAccessed: new Date().toISOString(),
  },
  {
    id: 'doc_003',
    name: 'FinTech Liftout Term Sheet.pdf',
    description: 'Initial term sheet for strategic team acquisition',
    type: 'term_sheet',
    fileType: 'pdf',
    size: 987654,
    uploadedBy: '2', // company user
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    confidential: true,
    accessControl: {
      type: 'restricted',
      allowedUsers: ['1'], // specific team lead
      allowedRoles: [],
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
    },
    metadata: {
      opportunityId: 'opp_001',
      applicationId: 'app_001',
      tags: ['term-sheet', 'compensation', 'equity'],
      version: '1.0',
    },
    downloadCount: 2,
    lastAccessed: new Date().toISOString(),
  }
];

function hasDocumentAccess(document: any, userId: string, userType: string): boolean {
  const { accessControl } = document;
  
  // Check if document is expired
  if (accessControl.expiresAt && new Date(accessControl.expiresAt) < new Date()) {
    return false;
  }
  
  // Public documents - accessible to all authenticated users with proper role
  if (accessControl.type === 'public') {
    return accessControl.allowedRoles.includes(userType);
  }
  
  // Private documents - only accessible to uploader
  if (accessControl.type === 'private') {
    return document.uploadedBy === userId;
  }
  
  // Restricted documents - check specific permissions
  if (accessControl.type === 'restricted') {
    const hasUserAccess = accessControl.allowedUsers.includes(userId);
    const hasRoleAccess = accessControl.allowedRoles.includes(userType);
    const isUploader = document.uploadedBy === userId;
    
    return isUploader || hasUserAccess || hasRoleAccess;
  }
  
  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const document = documents.find(doc => doc.id === params.id);
  
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // Check access permissions
  if (!hasDocumentAccess(document, session.user.id, session.user.userType)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Check if this is a download request
  const { searchParams } = new URL(request.url);
  const download = searchParams.get('download') === 'true';
  
  if (download) {
    // Update download count and last accessed
    document.downloadCount += 1;
    document.lastAccessed = new Date().toISOString();
    
    // In a real implementation, you would:
    // 1. Retrieve the actual file from storage (S3, etc.)
    // 2. Return the file with proper headers
    // For demo, we'll return a download URL
    return NextResponse.json({
      downloadUrl: `/api/documents/${params.id}/file`,
      filename: document.name,
      size: document.size,
      contentType: `application/${document.fileType}`,
    });
  }

  return NextResponse.json({ document });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const document = documents.find(doc => doc.id === params.id);
  
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // Only document owner can update
  if (document.uploadedBy !== session.user.id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const body = await request.json();
  const updates = body;

  // Update allowed fields
  const allowedFields = [
    'name', 'description', 'confidential', 'accessControl', 'metadata'
  ];
  
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      document[field] = updates[field];
    }
  });
  
  document.updatedAt = new Date().toISOString();

  return NextResponse.json({ document });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const documentIndex = documents.findIndex(doc => doc.id === params.id);
  
  if (documentIndex === -1) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const document = documents[documentIndex];

  // Only document owner can delete
  if (document.uploadedBy !== session.user.id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Soft delete - mark as inactive
  document.status = 'deleted';
  document.updatedAt = new Date().toISOString();

  return NextResponse.json({ message: 'Document deleted successfully' });
}