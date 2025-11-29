import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, AdminUser } from '@/lib/admin-middleware';
import { getAdminNotes, createAdminNote } from '@/lib/services/adminService';

export const dynamic = 'force-dynamic';

// GET /api/admin/users/[id]/notes - Get admin notes for user
export const GET = withAdminAccess(
  async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
    try {
      const userId = params?.id;
      if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      }

      const notes = await getAdminNotes('user', userId);
      return NextResponse.json({ notes });
    } catch (error) {
      console.error('Get notes error:', error);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
  }
);

// POST /api/admin/users/[id]/notes - Add admin note for user
export const POST = withAdminAccess(
  async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
    try {
      const userId = params?.id;
      if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      }

      const body = await req.json();
      const { note } = body;

      if (!note || note.trim().length === 0) {
        return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
      }

      const newNote = await createAdminNote('user', userId, note, admin.id);
      return NextResponse.json({ note: newNote }, { status: 201 });
    } catch (error) {
      console.error('Create note error:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
  }
);
