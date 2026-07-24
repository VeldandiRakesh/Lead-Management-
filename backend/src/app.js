import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware.js';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import leadRouter from './routes/lead.routes.js';

const app = express();

// Secure application HTTP headers via Helmet
app.use(helmet());

// Enable CORS policy (restricted to client origins)
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));

// Logging HTTP Requests using Morgan
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Compression of outgoing response streams
app.use(compression());

// Parse incoming request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse request cookies
app.use(cookieParser());

// Enforce request rates limit globally
app.use(globalLimiter);

// Bind base api routes
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);

// 404 Route Intercepts
app.use(notFoundHandler);

// Global Error Catch Filters
app.use(globalErrorHandler);

export default app;
