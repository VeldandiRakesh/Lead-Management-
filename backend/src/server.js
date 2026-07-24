import app from './app.js';
import { env } from './config/env.js';
import db from './config/database.js'; // Imports SQLite connection to scaffold database path

// Startup server listener
const server = app.listen(env.port, () => {
  console.log(`[Server] LeadFlow API Service running in [${env.nodeEnv}] mode on port: ${env.port}`);
});

// Process signal listener hooks for graceful server shutdowns
const handleGracefulShutdown = (signal) => {
  console.log(`[Server] Received signal: ${signal}. Shutting down services...`);
  
  server.close(() => {
    console.log('[Server] Express HTTP server listeners closed.');
    
    try {
      db.close();
      console.log('[Database] SQLite connection handle closed.');
      process.exit(0);
    } catch (error) {
      console.error(`[Database] Error shutting down SQLite connection: ${error.message}`);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
