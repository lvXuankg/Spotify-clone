import { defineConfig, env } from 'prisma/config';
import dotenv from 'dotenv';
import path from 'node:path';

// Load environment variables from the project's .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
