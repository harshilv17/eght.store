import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const client = process.env.DATABASE_URL
  ? new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
  : new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

async function run() {
  await client.connect();

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
