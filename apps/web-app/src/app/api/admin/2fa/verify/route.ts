import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { verify2FACode, verifyBackupCode } from '@/lib/services/adminService';
import { logAdminAction } from '@/lib/services/auditService';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (token.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { code, isBackupCode } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    let result;

    if (isBackupCode) {
      result = await verifyBackupCode(token.sub, code);
      if (result.success) {
        // Log the backup code usage
        await logAdminAction({
          adminId: token.sub,
          action: 'admin.2fa.verify',
          metadata: {
            method: 'backup_code',
            remainingCodes: result.remainingCodes,
          },
          ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        });
      }
    } else {
      result = await verify2FACode(token.sub, code);
      if (result.success) {
        await logAdminAction({
          adminId: token.sub,
          action: 'admin.2fa.verify',
          metadata: { method: 'totp' },
          ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        });
      }
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invalid code' },
        { status: 400 }
      );
    }

    // Return success - client should update session
    return NextResponse.json({
      success: true,
      message: '2FA verified successfully',
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
