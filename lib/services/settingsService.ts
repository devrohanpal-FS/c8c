import { prisma } from '@/lib/db';

export class SettingsService {
  static async getSiteSettings() {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'CRE8TIVECOVE',
          tagline: 'Lean Mean Storytelling Machine • Weird Energy Since Y2K',
          phone: '+91 9999-659-129',
          email: 'hello@cre8tivecove.com',
          address: 'Delhi, India',
        },
      });
    }
    return settings;
  }
}