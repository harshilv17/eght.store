import 'dotenv/config';

const required = [
  'JWT_SECRET'
];

// Either DATABASE_URL or individual DB vars must be present
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const hasIndividualDbVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'].every(key => !!process.env[key]);

if (!hasDatabaseUrl && !hasIndividualDbVars) {
  throw new Error('Missing database configuration. Please provide DATABASE_URL or individual DB_* variables.');
}

for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

export const env = {
  port: parseInt(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
