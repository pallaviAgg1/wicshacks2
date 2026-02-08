const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleCrowdReports = [
  {
    report_type: 'crowd_dense',
    description: 'Very crowded near main stage',
    latitude: 30.2672,
    longitude: -97.7431,
    severity: 'high',
    status: 'active',
    upvotes: 15,
  },
  {
    report_type: 'mud',
    description: 'Muddy path near food vendors',
    latitude: 30.2675,
    longitude: -97.7435,
    severity: 'medium',
    status: 'active',
    upvotes: 8,
  },
  {
    report_type: 'uneven_terrain',
    description: 'Watch your step - rocks and holes',
    latitude: 30.267,
    longitude: -97.7428,
    severity: 'low',
    status: 'active',
    upvotes: 3,
  },
  {
    report_type: 'flooding',
    description: 'Water accumulation after rain',
    latitude: 30.2668,
    longitude: -97.7432,
    severity: 'high',
    status: 'resolved',
    upvotes: 12,
  },
  {
    report_type: 'blocked_path',
    description: 'Barrier blocking wheelchair access',
    latitude: 30.2673,
    longitude: -97.7429,
    severity: 'medium',
    status: 'active',
    upvotes: 6,
  },
];

const sampleSOSRequests = [
  {
    emergency_type: 'dehydration',
    description: 'Feeling dizzy and need water',
    latitude: 30.2669,
    longitude: -97.7433,
    status: 'resolved',
    contact_phone: '555-0101',
  },
  {
    emergency_type: 'lost',
    description: 'Lost my group, need help finding them',
    latitude: 30.2671,
    longitude: -97.743,
    status: 'resolved',
    contact_phone: '555-0102',
  },
  {
    emergency_type: 'accessibility_help',
    description: 'Wheelchair stuck in mud',
    latitude: 30.2674,
    longitude: -97.7434,
    status: 'responding',
    contact_phone: '555-0103',
  },
];

async function seed() {
  console.log('Seeding database...');

  try {
    await prisma.sOSRequest.deleteMany();
    await prisma.crowdReport.deleteMany();

    for (const report of sampleCrowdReports) {
      await prisma.crowdReport.create({ data: report });
    }

    for (const request of sampleSOSRequests) {
      await prisma.sOSRequest.create({ data: request });
    }

    const reportCount = await prisma.crowdReport.count();
    const sosCount = await prisma.sOSRequest.count();

    console.log('Seeding complete');
    console.log(`Crowd reports: ${reportCount}`);
    console.log(`SOS requests: ${sosCount}`);
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
