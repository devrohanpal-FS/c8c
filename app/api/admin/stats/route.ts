import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalProjects, featuredProjects, totalClients, totalUsers] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.client.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      totalProjects,
      featuredProjects,
      totalClients,
      totalUsers,
      systemUptime: process.uptime(),
      dbConnected: true,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin metrics' }, { status: 500 });
  }
}
