const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = ['DATABASE_URL', 'PORT', 'NODE_ENV', 'JWT_SECRET'];
const missingEnvVars = [];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    missingEnvVars.push(key);
  }
});

if (missingEnvVars.length > 0) {
  throw new Error(
    `Configuration Error: Missing required environment variable(s): ${missingEnvVars.join(', ')}. Please check your .env file.`
  );
}

const env = {
  databaseUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Quick validation on PORT structure
if (isNaN(env.port)) {
  throw new Error('Configuration Error: PORT must be a valid number.');
}

module.exports = env;
