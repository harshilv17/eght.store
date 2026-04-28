import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import app from './app.js';

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    logger.info(`EGHT Backend running on port ${env.port} [${env.nodeEnv}]`);
  });
}

start().catch(err => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
