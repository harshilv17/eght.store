import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import userRoutes from './modules/user/user.routes.js';
import configRoutes from './modules/config/config.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));

// Raw body needed for Razorpay webhook signature verification
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/config', configRoutes);
app.use('/api/admin/uploads', uploadRoutes);

app.use(errorMiddleware);

export default app;
