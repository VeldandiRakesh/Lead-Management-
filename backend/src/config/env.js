import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root backend folder .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = ['PORT', 'NODE_ENV', 'DB_PATH', 'JWT_SECRET', 'CLIENT_URL'];

// Verify that all required variables are present
requiredEnv.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`[CRITICAL] Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

export const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV,
  dbPath: process.env.DB_PATH,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,
  isProduction: process.env.NODE_ENV === 'production',
};
