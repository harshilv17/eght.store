import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { query } from '../../config/db.js';
import { sendSuccess } from '../../utils/helpers.js';
import { AppError } from '../../middlewares/error.middleware.js';

const router = Router();

const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(10).max(15),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  isDefault: z.boolean().default(false),
});

router.get('/addresses', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC', [req.user.sub]);
    sendSuccess(res, rows);
  } catch (err) { next(err); }
});

router.post('/addresses', authenticate, validate(addressSchema), async (req, res, next) => {
  try {
    const { fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;
    if (isDefault) {
      await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.sub]);
    }
    const { rows } = await query(
      `INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, state, pincode, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.sub, fullName, phone, line1, line2 || null, city, state, pincode, isDefault]
    );
    sendSuccess(res, rows[0], 201);
  } catch (err) { next(err); }
});

router.delete('/addresses/:id', authenticate, async (req, res, next) => {
  try {
    const { rowCount } = await query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.sub]
    );
    if (rowCount === 0) throw new AppError('Address not found', 404);
    sendSuccess(res, { message: 'Address deleted' });
  } catch (err) { next(err); }
});

export default router;
