/**
 * Mock Expressions of Interest (EOI) data for demo/fallback when API server is unavailable
 */

export interface MockEOI {
  id: string;
  fromType: 'team' | 'company';
  fromId: string;
  fromName: string;
  toType: 'team' | 'company';
  toId: string;
  toName: string;
  opportunityId?: string;
  opportunityTitle?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export const mockEOIs: MockEOI[] = [
  {
    id: 'eoi_mock_001',
    fromType: 'company',
    fromId: 'company_gs',
    fromName: 'Goldman Sachs',
    toType: 'team',
    toId: 'team_demo_001',
    toName: 'TechFlow Data Science Team',
    opportunityId: 'opp_mock_001',
    opportunityTitle: 'Strategic FinTech Analytics Team',
    message: 'Your team profile impressed us. We\'d love to discuss how you could contribute to our analytics expansion.',
    status: 'accepted',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-21T14:00:00Z',
    expiresAt: '2025-02-20T10:00:00Z'
  },
  {
    id: 'eoi_mock_002',
    fromType: 'team',
    fromId: 'team_demo_001',
    fromName: 'TechFlow Data Science Team',
    toType: 'company',
    toId: 'company_medtech',
    toName: 'MedTech Innovations',
    opportunityId: 'opp_mock_002',
    opportunityTitle: 'Healthcare AI Research Team',
    message: 'While our background is in fintech, we\'re passionate about applying our ML expertise to healthcare. Would love to discuss further.',
    status: 'accepted',
    createdAt: '2025-01-22T15:00:00Z',
    updatedAt: '2025-01-23T09:00:00Z',
    expiresAt: '2025-02-22T15:00:00Z'
  },
  {
    id: 'eoi_mock_003',
    fromType: 'company',
    fromId: 'company_scale',
    fromName: 'Scale Labs',
    toType: 'team',
    toId: 'team_demo_001',
    toName: 'TechFlow Data Science Team',
    message: 'We noticed your data pipeline experience. Our platform engineering needs could be a great fit.',
    status: 'pending',
    createdAt: '2025-01-30T11:00:00Z',
    updatedAt: '2025-01-30T11:00:00Z',
    expiresAt: '2025-03-01T11:00:00Z'
  },
  {
    id: 'eoi_mock_004',
    fromType: 'team',
    fromId: 'team_demo_001',
    fromName: 'TechFlow Data Science Team',
    toType: 'company',
    toId: 'company_sterling',
    toName: 'Sterling Partners',
    opportunityId: 'opp_mock_005',
    opportunityTitle: 'M&A Advisory Team',
    message: 'Our analytics capabilities could support deal analysis and due diligence.',
    status: 'declined',
    createdAt: '2025-01-25T16:00:00Z',
    updatedAt: '2025-01-27T10:00:00Z',
    expiresAt: '2025-02-25T16:00:00Z'
  }
];

// In-memory storage
let eois = [...mockEOIs];

/**
 * Get EOIs for a team (both sent and received)
 */
export function getMockEOIsByTeam(teamId: string): {
  sent: MockEOI[];
  received: MockEOI[];
} {
  return {
    sent: eois.filter(eoi => eoi.fromType === 'team' && eoi.fromId === teamId),
    received: eois.filter(eoi => eoi.toType === 'team' && eoi.toId === teamId)
  };
}

/**
 * Get EOIs for a company (both sent and received)
 */
export function getMockEOIsByCompany(companyId: string): {
  sent: MockEOI[];
  received: MockEOI[];
} {
  return {
    sent: eois.filter(eoi => eoi.fromType === 'company' && eoi.fromId === companyId),
    received: eois.filter(eoi => eoi.toType === 'company' && eoi.toId === companyId)
  };
}

/**
 * Get all EOIs with optional filtering
 */
export function getAllMockEOIs(filters?: {
  status?: string;
  fromType?: string;
  toType?: string;
}): { eois: MockEOI[]; total: number } {
  let filtered = [...eois];

  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(eoi => eoi.status === filters.status);
    }
    if (filters.fromType) {
      filtered = filtered.filter(eoi => eoi.fromType === filters.fromType);
    }
    if (filters.toType) {
      filtered = filtered.filter(eoi => eoi.toType === filters.toType);
    }
  }

  return {
    eois: filtered,
    total: filtered.length
  };
}

/**
 * Get a single EOI by ID
 */
export function getMockEOIById(id: string): MockEOI | null {
  return eois.find(eoi => eoi.id === id) || null;
}

/**
 * Create a new EOI
 */
export function createMockEOI(data: {
  fromType: 'team' | 'company';
  fromId: string;
  fromName: string;
  toType: 'team' | 'company';
  toId: string;
  toName: string;
  opportunityId?: string;
  opportunityTitle?: string;
  message?: string;
}): MockEOI {
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const newEOI: MockEOI = {
    id: `eoi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expires.toISOString()
  };

  eois.push(newEOI);
  return newEOI;
}

/**
 * Update EOI status
 */
export function updateMockEOIStatus(
  id: string,
  status: MockEOI['status']
): MockEOI | null {
  const eoiIndex = eois.findIndex(eoi => eoi.id === id);
  if (eoiIndex === -1) return null;

  eois[eoiIndex] = {
    ...eois[eoiIndex],
    status,
    updatedAt: new Date().toISOString()
  };

  return eois[eoiIndex];
}

/**
 * Reset EOIs to initial mock data
 */
export function resetMockEOIs(): void {
  eois = [...mockEOIs];
}
