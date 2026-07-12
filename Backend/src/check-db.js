const prisma = require('./config/prisma');
const logger = require('./config/logger');

async function checkConnection() {
  logger.info('Database Sanity Check: Attempting to connect via Prisma...');
  try {
    // Simple raw query to verify the connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database Sanity Check: Connection successful!');

    // Check if models exist (i.e. migrations run)
    try {
      const count = await prisma.organization.count();
      logger.info(`Database Sanity Check: Organization table accessible. Row count: ${count}`);
    } catch (dbError) {
      logger.warn(
        { err: dbError.message },
        'Database Sanity Check: Connection works, but HealthCheck table could not be queried. Have you run "npx prisma migrate dev"?'
      );
    }
  } catch (error) {
    logger.error({ err: error }, 'Database Sanity Check: Failed to connect to the database!');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
