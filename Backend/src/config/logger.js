const pino = require('pino');
const env = require('./env');

const transport = env.isDev
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

const logger = pino(
  {
    level: process.env.LOG_LEVEL || (env.isDev ? 'debug' : 'info'),
    // Redact sensitive keys in production logs
    redact: env.isProd
      ? {
          paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token'],
          censor: '[REDACTED]',
        }
      : undefined,
  },
  transport ? pino.transport(transport) : undefined
);

module.exports = logger;
