import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding C8C 15-Layer Enterprise Database...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@c8c.agency' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'C8C Principal Admin',
      email: 'admin@c8c.agency',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user seeded:', admin.email);

  // Seed Projects
  const projects = [
    {
      title: 'AURA - Kinetic Architectural Experience',
      slug: 'aura-kinetic-architecture',
      client: 'Aura Luxury Estates',
      year: '2026',
      category: '3D & Motion Craft',
      description: 'An immersive kinetic 3D architectural showcase blending procedural spatial audio with real-time web rendering.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-modern-minimalist-architecture-5353/1080p.mp4',
      featured: true,
      order: 1,
    },
    {
      title: 'NEO-NOIR: Cyberpunk Automotive Film',
      slug: 'neo-noir-cyberpunk-automotive',
      client: 'Kuro Motors Tokyo',
      year: '2025',
      category: 'Cinematography & VFX',
      description: 'High-octane commercial film shot on anamorphic optics with custom CGI particle simulations and sound design.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-sports-car-driving-through-city-at-night-8692/1080p.mp4',
      featured: true,
      order: 2,
    },
    {
      title: 'VALKYRIE - High Fashion Digital Runway',
      slug: 'valkyrie-high-fashion-runway',
      client: 'Valkyrie Paris',
      year: '2026',
      category: 'Digital Fashion & Brand Identity',
      description: 'A revolutionary digital haute couture show featuring photorealistic avatar models and dynamic fluid simulation.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-down-the-street-4577/1080p.mp4',
      featured: true,
      order: 3,
    },
    {
      title: 'ORBIT - Spatial Audio & Sound Sculpture',
      slug: 'orbit-spatial-audio-sculpture',
      client: 'Synesthesia Sound Labs',
      year: '2025',
      category: 'Interactive Sound & Light',
      description: 'Interactive generative audio-visual installation commissioned for the Venice Art Biennale.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-abstract-glowing-neon-lights-5674/1080p.mp4',
      featured: true,
      order: 4,
    },
    {
      title: 'CHRONOS - Luxury Horology Film',
      slug: 'chronos-luxury-horology',
      client: 'Vacheron & Sons',
      year: '2026',
      category: 'Commercial Direction',
      description: 'Macro lens journey inside the mechanical heartbeat of a tourbillon watch movement.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-close-up-of-a-watch-mechanism-4286/1080p.mp4',
      featured: false,
      order: 5,
    },
    {
      title: 'SOLARIS - Next-Gen Clean Energy Campaign',
      slug: 'solaris-clean-energy',
      client: 'Solaris Global',
      year: '2025',
      category: 'Brand Strategy & VFX',
      description: 'Global launch video series combining drone cinematography with procedural 3D solar grid visualizations.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-solar-panels-in-the-desert-5412/1080p.mp4',
      featured: false,
      order: 6,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  // Seed Clients
  const clients = [
    { name: 'Aura Luxury Estates', website: 'https://auraluxury.com', order: 1 },
    { name: 'Kuro Motors Tokyo', website: 'https://kuromotors.jp', order: 2 },
    { name: 'Valkyrie Paris', website: 'https://valkyrieparis.com', order: 3 },
    { name: 'Vacheron & Sons', website: 'https://vacheron.ch', order: 4 },
    { name: 'Solaris Global', website: 'https://solarisenergy.io', order: 5 },
    { name: 'Synesthesia Sound Labs', website: 'https://synesthesiasound.com', order: 6 },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { name: client.name },
      update: client,
      create: client,
    });
  }

  console.log(`Seeded ${projects.length} projects & ${clients.length} clients!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
