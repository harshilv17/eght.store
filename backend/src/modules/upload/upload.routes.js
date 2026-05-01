import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { authenticate, requireAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { sendSuccess } from '../../utils/helpers.js';

const router = Router();

const signSchema = z.object({
  folder: z.string().regex(/^[a-z0-9_\-/]+$/i).default('eght/products'),
  publicId: z.string().regex(/^[a-z0-9_\-/]+$/i).optional(),
});

// Cloudinary signed-upload signature.
// Frontend uses { cloudName, apiKey, signature, timestamp, folder, publicId? }
// to POST directly to https://api.cloudinary.com/v1_1/<cloudName>/auto/upload.
router.post('/sign', authenticate, requireAdmin, validate(signSchema), (req, res, next) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new AppError('Cloudinary not configured', 503);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const { folder, publicId } = req.body;

    const params = { folder, timestamp };
    if (publicId) params.public_id = publicId;

    const toSign = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    const signature = crypto
      .createHash('sha1')
      .update(toSign + apiSecret)
      .digest('hex');

    sendSuccess(res, {
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      publicId: publicId || null,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    });
  } catch (err) { next(err); }
});

export default router;
