import { query } from '../../config/db.js';
import { hashToken } from '../../utils/helpers.js';

export async function findUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await query(
    'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function createUser({ email, passwordHash, firstName, lastName }) {
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, role, created_at`,
    [email, passwordHash, firstName, lastName]
  );
  return rows[0];
}

export async function saveRefreshToken(userId, token, expiresAt) {
  const tokenHash = hashToken(token);
  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenHash, expiresAt]
  );
}

export async function findRefreshToken(token) {
  const tokenHash = hashToken(token);
  const { rows } = await query(
    `SELECT rt.*, u.role FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1 AND rt.revoked = false AND rt.expires_at > NOW()`,
    [tokenHash]
  );
  return rows[0] || null;
}

export async function revokeRefreshToken(token) {
  const tokenHash = hashToken(token);
  await query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);
}

export async function revokeAllUserTokens(userId) {
  await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);
}
