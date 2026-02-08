const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { crowdReportValidation } = require('../middleware/validation');
const { calculateDistance } = require('../utils/geoUtils');
const { prisma } = require('../utils/database');

router.get('/', asyncHandler(async (req, res) => {
  const {
    status,
    severity,
    report_type,
    limit = 50,
    offset = 0,
    latitude,
    longitude,
    radius,
  } = req.query;

  const where = {};
  if (status) where.status = status;
  if (severity) where.severity = severity;
  if (report_type) where.report_type = report_type;

  let reports = await prisma.crowdReport.findMany({
    where,
    orderBy: { created_date: 'desc' },
    take: parseInt(limit, 10),
    skip: parseInt(offset, 10),
  });

  if (latitude && longitude && radius) {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const searchRadius = parseFloat(radius);

    reports = reports.filter((report) => {
      const distance = calculateDistance(userLat, userLon, report.latitude, report.longitude);
      return distance <= searchRadius;
    });
  }

  if (latitude && longitude) {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    reports = reports.map((report) => ({
      ...report,
      distance: calculateDistance(userLat, userLon, report.latitude, report.longitude),
    }));
  }

  res.json(reports);
}));

router.get('/nearby', asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 1000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required parameters: latitude, longitude' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);
  const searchRadius = parseFloat(radius);

  const reports = await prisma.crowdReport.findMany({
    where: { status: 'active' },
    orderBy: { created_date: 'desc' },
  });

  const nearbyReports = reports
    .map((report) => ({
      ...report,
      distance: calculateDistance(userLat, userLon, report.latitude, report.longitude),
    }))
    .filter((report) => report.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearbyReports);
}));

router.get('/:id', crowdReportValidation.getId, asyncHandler(async (req, res) => {
  const report = await prisma.crowdReport.findUnique({
    where: { id: req.params.id },
  });

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json(report);
}));

router.post('/', crowdReportValidation.create, asyncHandler(async (req, res) => {
  const { report_type, description, latitude, longitude, severity, status, upvotes } = req.body;

  const report = await prisma.crowdReport.create({
    data: {
      report_type,
      description,
      latitude,
      longitude,
      severity: severity || 'medium',
      status: status || 'active',
      upvotes: upvotes || 0,
    },
  });

  res.status(201).json(report);
}));

router.put('/:id', crowdReportValidation.update, asyncHandler(async (req, res) => {
  const { status, severity, upvotes, description } = req.body;

  const report = await prisma.crowdReport.update({
    where: { id: req.params.id },
    data: {
      ...(status && { status }),
      ...(severity && { severity }),
      ...(upvotes !== undefined && { upvotes }),
      ...(description && { description }),
    },
  });

  res.json(report);
}));

router.post('/:id/upvote', crowdReportValidation.getId, asyncHandler(async (req, res) => {
  const report = await prisma.crowdReport.update({
    where: { id: req.params.id },
    data: { upvotes: { increment: 1 } },
  });

  res.json(report);
}));

router.delete('/:id', crowdReportValidation.getId, asyncHandler(async (req, res) => {
  await prisma.crowdReport.delete({
    where: { id: req.params.id },
  });

  res.json({ message: 'Report deleted successfully' });
}));

module.exports = router;
