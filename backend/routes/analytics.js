const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../utils/database');

router.get('/summary', asyncHandler(async (req, res) => {
  const [
    totalReports,
    activeReports,
    resolvedReports,
    totalSOS,
    pendingSOS,
    respondingSOS,
    resolvedSOS,
  ] = await Promise.all([
    prisma.crowdReport.count(),
    prisma.crowdReport.count({ where: { status: 'active' } }),
    prisma.crowdReport.count({ where: { status: 'resolved' } }),
    prisma.sOSRequest.count(),
    prisma.sOSRequest.count({ where: { status: 'pending' } }),
    prisma.sOSRequest.count({ where: { status: 'responding' } }),
    prisma.sOSRequest.count({ where: { status: 'resolved' } }),
  ]);

  res.json({
    crowdReports: {
      total: totalReports,
      active: activeReports,
      resolved: resolvedReports,
    },
    sosRequests: {
      total: totalSOS,
      pending: pendingSOS,
      responding: respondingSOS,
      resolved: resolvedSOS,
    },
  });
}));

router.get('/crowd-reports', asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(days, 10));

  const [byType, bySeverity, byStatus, recentTrends] = await Promise.all([
    prisma.crowdReport.groupBy({
      by: ['report_type'],
      _count: true,
      orderBy: { _count: { report_type: 'desc' } },
    }),
    prisma.crowdReport.groupBy({
      by: ['severity'],
      _count: true,
    }),
    prisma.crowdReport.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.crowdReport.findMany({
      where: { created_date: { gte: daysAgo } },
      select: { created_date: true, report_type: true, severity: true },
      orderBy: { created_date: 'asc' },
    }),
  ]);

  const topReports = await prisma.crowdReport.findMany({
    where: { status: 'active' },
    orderBy: { upvotes: 'desc' },
    take: 10,
  });

  res.json({
    byType: byType.map((item) => ({ type: item.report_type, count: item._count })),
    bySeverity: bySeverity.map((item) => ({ severity: item.severity, count: item._count })),
    byStatus: byStatus.map((item) => ({ status: item.status, count: item._count })),
    recentTrends: processTrends(recentTrends, parseInt(days, 10)),
    topReports,
  });
}));

router.get('/sos-requests', asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(days, 10));

  const [byType, byStatus, recentTrends] = await Promise.all([
    prisma.sOSRequest.groupBy({
      by: ['emergency_type'],
      _count: true,
      orderBy: { _count: { emergency_type: 'desc' } },
    }),
    prisma.sOSRequest.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.sOSRequest.findMany({
      where: { created_date: { gte: daysAgo } },
      select: { created_date: true, emergency_type: true, status: true },
      orderBy: { created_date: 'asc' },
    }),
  ]);

  const pendingRequests = await prisma.sOSRequest.findMany({
    where: { status: 'pending' },
  });

  const avgResponseTime = calculateAvgResponseTime(pendingRequests);

  res.json({
    byType: byType.map((item) => ({ type: item.emergency_type, count: item._count })),
    byStatus: byStatus.map((item) => ({ status: item.status, count: item._count })),
    recentTrends: processTrends(recentTrends, parseInt(days, 10)),
    avgResponseTimeMinutes: avgResponseTime,
  });
}));

function processTrends(data, days) {
  const trendMap = new Map();

  for (let i = 0; i < days; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    trendMap.set(dateKey, 0);
  }

  data.forEach((item) => {
    const dateKey = item.created_date.toISOString().split('T')[0];
    if (trendMap.has(dateKey)) {
      trendMap.set(dateKey, trendMap.get(dateKey) + 1);
    }
  });

  return Array.from(trendMap.entries())
    .map(([date, count]) => ({ date, count }))
    .reverse();
}

function calculateAvgResponseTime(requests) {
  if (requests.length === 0) return 0;

  const now = new Date();
  const totalMinutes = requests.reduce((sum, req) => {
    const minutes = (now - req.created_date) / (1000 * 60);
    return sum + minutes;
  }, 0);

  return Math.round(totalMinutes / requests.length);
}

module.exports = router;
