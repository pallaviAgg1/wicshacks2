const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { sosRequestValidation } = require('../middleware/validation');
const { calculateDistance } = require('../utils/geoUtils');
const { prisma } = require('../utils/database');

router.get('/', asyncHandler(async (req, res) => {
  const {
    status,
    emergency_type,
    limit = 50,
    offset = 0,
    latitude,
    longitude,
    radius,
  } = req.query;

  const where = {};
  if (status) where.status = status;
  if (emergency_type) where.emergency_type = emergency_type;

  let requests = await prisma.sOSRequest.findMany({
    where,
    orderBy: { created_date: 'desc' },
    take: parseInt(limit, 10),
    skip: parseInt(offset, 10),
  });

  if (latitude && longitude && radius) {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const searchRadius = parseFloat(radius);

    requests = requests.filter((request) => {
      const distance = calculateDistance(userLat, userLon, request.latitude, request.longitude);
      return distance <= searchRadius;
    });
  }

  if (latitude && longitude) {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    requests = requests.map((request) => ({
      ...request,
      distance: calculateDistance(userLat, userLon, request.latitude, request.longitude),
    }));
  }

  res.json(requests);
}));

router.get('/nearby', asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 1000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required parameters: latitude, longitude' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);
  const searchRadius = parseFloat(radius);

  const requests = await prisma.sOSRequest.findMany({
    where: { status: { in: ['pending', 'responding'] } },
    orderBy: { created_date: 'desc' },
  });

  const nearbyRequests = requests
    .map((request) => ({
      ...request,
      distance: calculateDistance(userLat, userLon, request.latitude, request.longitude),
    }))
    .filter((request) => request.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearbyRequests);
}));

router.get('/:id', sosRequestValidation.getId, asyncHandler(async (req, res) => {
  const request = await prisma.sOSRequest.findUnique({
    where: { id: req.params.id },
  });

  if (!request) {
    return res.status(404).json({ error: 'SOS request not found' });
  }

  res.json(request);
}));

router.post('/', sosRequestValidation.create, asyncHandler(async (req, res) => {
  const { emergency_type, description, latitude, longitude, status, contact_phone } = req.body;

  const sosRequest = await prisma.sOSRequest.create({
    data: {
      emergency_type,
      description,
      latitude,
      longitude,
      status: status || 'pending',
      contact_phone,
    },
  });

  res.status(201).json(sosRequest);
}));

router.put('/:id', sosRequestValidation.update, asyncHandler(async (req, res) => {
  const { status, description, contact_phone } = req.body;

  const sosRequest = await prisma.sOSRequest.update({
    where: { id: req.params.id },
    data: {
      ...(status && { status }),
      ...(description && { description }),
      ...(contact_phone && { contact_phone }),
    },
  });

  res.json(sosRequest);
}));

router.post('/:id/respond', sosRequestValidation.getId, asyncHandler(async (req, res) => {
  const sosRequest = await prisma.sOSRequest.update({
    where: { id: req.params.id },
    data: { status: 'responding' },
  });

  res.json(sosRequest);
}));

router.post('/:id/resolve', sosRequestValidation.getId, asyncHandler(async (req, res) => {
  const sosRequest = await prisma.sOSRequest.update({
    where: { id: req.params.id },
    data: { status: 'resolved' },
  });

  res.json(sosRequest);
}));

router.delete('/:id', sosRequestValidation.getId, asyncHandler(async (req, res) => {
  await prisma.sOSRequest.delete({
    where: { id: req.params.id },
  });

  res.json({ message: 'SOS request deleted successfully' });
}));

module.exports = router;
