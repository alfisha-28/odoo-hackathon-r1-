const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/config/logger');
const prisma = require('./src/config/prisma');

const server = app.listen(env.port, () => {
  logger.info(`Server successfully started in [${env.nodeEnv}] mode on port [${env.port}]`);
});

/**
 * Handles graceful shutdown by stopping the server from accepting new requests,
 * closing open connections, disconnecting Prisma, and exiting the process.
 */
async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database client disconnected.');
      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, 'Error disconnecting Prisma during shutdown.');
      process.exit(1);
    }
  });

  // Force shutdown after timeout (e.g. 10s)
  setTimeout(() => {
    logger.error('Forceful shutdown triggered: server failed to close connections within timeout.');
    process.exit(1);
  }, 10000);
}

// Intercept exit signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Log uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught Exception detected! Shutting down process...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'Unhandled Rejection at Promise');
});
