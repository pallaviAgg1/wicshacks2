const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

async function disconnect() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

async function cleanupOldData(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const [deletedReports, deletedRequests] = await Promise.all([
    prisma.crowdReport.deleteMany({
      where: { status: 'resolved', updated_date: { lt: cutoffDate } },
    }),
    prisma.sOSRequest.deleteMany({
      where: { status: 'resolved', updated_date: { lt: cutoffDate } },
    }),
  ]);

  console.log(
    `Cleaned up ${deletedReports.count} old reports and ${deletedRequests.count} old SOS requests`
  );

  return { reports: deletedReports.count, requests: deletedRequests.count };
}

module.exports = {
  prisma,
  testConnection,
  disconnect,
  cleanupOldData,
};
