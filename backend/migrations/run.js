import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

function createClient() {
  return process.env.DATABASE_URL
    ? new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
    : new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
}

async function connectWithRetry() {
  let retries = 5;
  while (retries > 0) {
    // pg Client is one-shot: a failed connect cannot be reused, so make a fresh one each attempt.
    const client = createClient();
    try {
      await client.connect();
      console.log('🐘 Connected to database for migrations');
      return client;
    } catch (err) {
      await client.end().catch(() => {});
      retries -= 1;
      console.log(`⏳ Database not ready, retrying... (${retries} attempts left): ${err.message}`);
      if (retries === 0) throw err;
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    }
  }
}

async function run() {
  const client = await connectWithRetry();

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = readdirSync(__dirname)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const { rows } = await client.query(
      'SELECT id FROM _migrations WHERE filename = $1',
      [file]
    );
    if (rows.length > 0) {
      console.log(`⏭  Skipping ${file} (already applied)`);
      continue;
    }

    const sql = readFileSync(join(__dirname, file), 'utf8');
    await client.query(sql);
    await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
    console.log(`✅ Applied ${file}`);
  }

  await client.end();
  console.log('Migrations complete.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
