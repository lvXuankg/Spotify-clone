import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * CORS Configuration - Production Grade
 * Follows security best practices for different environments
 */
export const getCorsConfig = (nodeEnv: string): CorsOptions => {
  // Allowed origins based on environment
  const allowedOrigins: string[] = [];

  if (nodeEnv === 'development') {
    // Development: Allow localhost and common dev ports
    allowedOrigins.push(
      'http://localhost:3000', // Frontend dev server
      'http://localhost:3001',
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
    );
  } else if (nodeEnv === 'production') {
    // Production: Only allow specified frontend domain
    const frontendUrl =
      process.env.FRONTEND_URL || 'https://spotify.example.com';
    allowedOrigins.push(frontendUrl);
  } else {
    // Staging/Testing: Allow multiple frontend URLs
    allowedOrigins.push(
      process.env.FRONTEND_URL || 'https://staging.example.com',
      'http://localhost:3000', // Allow local testing on staging
    );
  }

  return {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow cookies to be sent
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
    ],
    exposedHeaders: ['Content-Length', 'X-Content-Type-Options'],
    maxAge: 86400, // 24 hours - how long browsers cache CORS preflight response
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };
};
