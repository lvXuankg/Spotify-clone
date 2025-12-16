import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

    // Create PostgreSQL connection pool
    const pool = new Pool({
      connectionString: databaseUrl,
    });

    // Create Prisma adapter
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      errorFormat: 'pretty',
      log: [
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
