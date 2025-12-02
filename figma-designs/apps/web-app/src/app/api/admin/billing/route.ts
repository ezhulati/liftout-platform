import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List transactions and billing stats
export const GET = withAdminAccess(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (type) {
      where.transactionType = type;
    }

    // Get transactions
    const [transactions, transactionTotal] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where }),
    ]);

    // Get user/company details for transactions
    const userIds = transactions.map((t) => t.userId).filter(Boolean) as string[];
    const companyIds = transactions.map((t) => t.companyId).filter(Boolean) as string[];

    const [users, companies] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true, firstName: true, lastName: true },
      }),
      prisma.company.findMany({
        where: { id: { in: companyIds } },
        select: { id: true, name: true },
      }),
    ]);

    const userMap = new Map(users.map((u) => [u.id, u]));
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    // Get billing stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      activeSubscriptions,
      pendingTransactions,
      failedTransactions,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          status: 'completed',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          status: 'completed',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { amount: true },
      }),
      prisma.subscription.count({
        where: { status: 'active' },
      }),
      prisma.transaction.count({
        where: { status: 'pending' },
      }),
      prisma.transaction.count({
        where: { status: 'failed' },
      }),
    ]);

    // Calculate MRR change
    const currentMRR = (monthlyRevenue._sum.amount || 0) / 100;
    const lastMRR = (lastMonthRevenue._sum.amount || 0) / 100;
    const mrrChange = lastMRR > 0 ? ((currentMRR - lastMRR) / lastMRR) * 100 : 0;

    return NextResponse.json({
      transactions: transactions.map((txn) => ({
        id: txn.id,
        userId: txn.userId,
        companyId: txn.companyId,
        type: txn.transactionType,
        amount: txn.amount / 100, // Convert cents to dollars
        currency: txn.currency,
        status: txn.status,
        description: txn.description,
        failureReason: txn.failureReason,
        createdAt: txn.createdAt.toISOString(),
        processedAt: txn.processedAt?.toISOString() || null,
        user: txn.userId ? userMap.get(txn.userId) || null : null,
        company: txn.companyId ? companyMap.get(txn.companyId) || null : null,
      })),
      total: transactionTotal,
      limit,
      offset,
      stats: {
        totalRevenue: (totalRevenue._sum.amount || 0) / 100,
        monthlyRevenue: currentMRR,
        mrrChange: Math.round(mrrChange * 10) / 10,
        activeSubscriptions,
        pendingTransactions,
        failedTransactions,
      },
    });
  } catch (error) {
    console.error('Billing fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
});
