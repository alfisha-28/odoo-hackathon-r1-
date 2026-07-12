const { PrismaClient } = require('@prisma/client');
const env = require('./env');
const logger = require('./logger');

let prisma;

if (env.isProd) {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // In development, prevent multiple instances of Prisma Client from being
  // created due to hot reloading (or multiple require actions).
  if (!global.globalPrisma) {
    global.globalPrisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    // Log query details in development
    global.globalPrisma.$on('query', (e) => {
      logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
    });
  }
  prisma = global.globalPrisma;
}

module.exports = prisma;
