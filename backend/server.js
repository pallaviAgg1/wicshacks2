require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// ============================================
// CROWD REPORT ROUTES
// ============================================

// GET all crowd reports (with filtering)
app.get('/api/entities/CrowdReport', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const where = status ? { status } : {};
    
    const reports = await prisma.crowdReport.findMany({
      where,
      orderBy: { created_date: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching crowd reports:', error);
    res.status(500).json({ error: 'Failed to fetch crowd reports' });
  }
});

// GET single crowd report
app.get('/api/entities/CrowdReport/:id', async (req, res) => {
  try {
    const report = await prisma.crowdReport.findUnique({
      where: { id: req.params.id },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching crowd report:', error);
    res.status(500).json({ error: 'Failed to fetch crowd report' });
  }
});

// CREATE crowd report
app.post('/api/entities/CrowdReport', async (req, res) => {
  try {
    const { report_type, description, latitude, longitude, severity, status, upvotes } = req.body;

    // Validation
    if (!report_type || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields: report_type, latitude, longitude' });
    }

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
  } catch (error) {
    console.error('Error creating crowd report:', error);
    res.status(500).json({ error: 'Failed to create crowd report' });
  }
});

// UPDATE crowd report
app.put('/api/entities/CrowdReport/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error updating crowd report:', error);
    res.status(500).json({ error: 'Failed to update crowd report' });
  }
});

// DELETE crowd report
app.delete('/api/entities/CrowdReport/:id', async (req, res) => {
  try {
    await prisma.crowdReport.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting crowd report:', error);
    res.status(500).json({ error: 'Failed to delete crowd report' });
  }
});

// ============================================
// SOS REQUEST ROUTES
// ============================================

// GET all SOS requests (with filtering)
app.get('/api/entities/SOSRequest', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const where = status ? { status } : {};
    
    const requests = await prisma.sOSRequest.findMany({
      where,
      orderBy: { created_date: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching SOS requests:', error);
    res.status(500).json({ error: 'Failed to fetch SOS requests' });
  }
});

// GET single SOS request
app.get('/api/entities/SOSRequest/:id', async (req, res) => {
  try {
    const request = await prisma.sOSRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!request) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching SOS request:', error);
    res.status(500).json({ error: 'Failed to fetch SOS request' });
  }
});

// CREATE SOS request
app.post('/api/entities/SOSRequest', async (req, res) => {
  try {
    const { emergency_type, description, latitude, longitude, status, contact_phone } = req.body;

    // Validation
    if (!emergency_type || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields: emergency_type, latitude, longitude' });
    }

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
  } catch (error) {
    console.error('Error creating SOS request:', error);
    res.status(500).json({ error: 'Failed to create SOS request' });
  }
});

// UPDATE SOS request
app.put('/api/entities/SOSRequest/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error updating SOS request:', error);
    res.status(500).json({ error: 'Failed to update SOS request' });
  }
});

// DELETE SOS request
app.delete('/api/entities/SOSRequest/:id', async (req, res) => {
  try {
    await prisma.sOSRequest.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'SOS request deleted successfully' });
  } catch (error) {
    console.error('Error deleting SOS request:', error);
    res.status(500).json({ error: 'Failed to delete SOS request' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Manage DB: npm run prisma:studio`);
});
