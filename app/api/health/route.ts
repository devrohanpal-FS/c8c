import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';

  try {
    // Ping DB
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'degraded';
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: dbStatus === 'healthy' ? 'pass' : 'warn',
      service: 'C8C Cre8tiveCove Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      latencyMs: responseTimeMs,
      checks: {
        database: {
          status: dbStatus,
        },
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
