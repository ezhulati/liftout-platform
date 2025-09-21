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

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const opportunityId = searchParams.get('opportunityId');
  const applicationId = searchParams.get('applicationId');
  const confidential = searchParams.get('confidential');
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  
  let filteredDocuments = [...documents];
  
  // Filter based on access control
  filteredDocuments = filteredDocuments.filter(doc => {
    // Check if user has access to this document
    const { accessControl } = doc;
    
    // Public documents - accessible to all authenticated users
    if (accessControl.type === 'public') {
      return accessControl.allowedRoles.includes(session.user.userType);
    }
    
    // Private documents - only accessible to uploader
    if (accessControl.type === 'private') {
      return doc.uploadedBy === session.user.id;
    }
    
    // Restricted documents - check specific permissions
    if (accessControl.type === 'restricted') {
      const hasUserAccess = accessControl.allowedUsers.includes(session.user.id);
      const hasRoleAccess = accessControl.allowedRoles.includes(session.user.userType);
      const isUploader = doc.uploadedBy === session.user.id;
      
      // Check expiration
      if (accessControl.expiresAt && new Date(accessControl.expiresAt) < new Date()) {
        return false;
      }
      
      return isUploader || hasUserAccess || hasRoleAccess;
    }
    
    return false;
  });
  
  // Text search across name, description, and tags
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.name.toLowerCase().includes(searchLower) ||
      doc.description.toLowerCase().includes(searchLower) ||
      doc.metadata.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Type filter
  if (type) {
    filteredDocuments = filteredDocuments.filter(doc => doc.type === type);
  }
  
  // Opportunity filter
  if (opportunityId) {
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.metadata.opportunityId === opportunityId
    );
  }
  
  // Application filter
  if (applicationId) {
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.metadata.applicationId === applicationId
    );
  }
  
  // Confidential filter
  if (confidential === 'true') {
    filteredDocuments = filteredDocuments.filter(doc => doc.confidential);
  } else if (confidential === 'false') {
    filteredDocuments = filteredDocuments.filter(doc => !doc.confidential);
  }
  
  // Tags filter
  if (tags.length > 0) {
    filteredDocuments = filteredDocuments.filter(doc => {
      return tags.some(tag => 
        doc.metadata.tags.some((docTag: string) => 
          docTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    });
  }

  return NextResponse.json({ 
    documents: filteredDocuments,
    total: filteredDocuments.length,
    filters: {
      types: [...new Set(documents.map(doc => doc.type))].sort(),
      tags: [...new Set(documents.flatMap(doc => doc.metadata.tags))].sort()
    }
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { 
    name,
    description,
    type,
    fileType,
    size,
    confidential,
    accessControl,
    metadata
  } = body;
  
  if (!name || !type || !fileType) {
    return NextResponse.json({ 
      error: 'Name, type, and file type are required' 
    }, { status: 400 });
  }

  // Validate access control
  const validAccessTypes = ['public', 'restricted', 'private'];
  if (accessControl && !validAccessTypes.includes(accessControl.type)) {
    return NextResponse.json({ 
      error: 'Invalid access control type' 
    }, { status: 400 });
  }

  const newDocument = {
    id: `doc_${Date.now()}`,
    name,
    description: description || '',
    type,
    fileType,
    size: size || 0,
    uploadedBy: session.user.id,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    confidential: confidential || false,
    accessControl: accessControl || {
      type: 'private',
      allowedUsers: [],
      allowedRoles: [],
      expiresAt: null,
    },
    metadata: {
      opportunityId: metadata?.opportunityId || null,
      applicationId: metadata?.applicationId || null,
      tags: metadata?.tags || [],
      version: metadata?.version || '1.0',
    },
    downloadCount: 0,
    lastAccessed: new Date().toISOString(),
  };

  documents.push(newDocument);
  
  return NextResponse.json({ document: newDocument }, { status: 201 });
}