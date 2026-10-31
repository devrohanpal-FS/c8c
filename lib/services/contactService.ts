import { prisma } from '@/lib/db';
import { z } from 'zod';
import { contactSubmissionSchema } from '@/lib/validation';

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

export const PRIVACY_NOTICE_VERSION = '2026-10-v1';
export const CONSENT_PURPOSE_ENQUIRY = 'COMMERCIAL_ENQUIRY_HANDLING';

export class ContactService {
  static async createSubmission(data: unknown, ipAddress?: string) {
    const validated = contactSubmissionSchema.parse(data);
    const serverTimestamp = new Date();

    return await prisma.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        businessName: validated.businessName,
        helpDetails: validated.helpDetails,
        budget: validated.budget,
        consentGiven: true,
        consentAt: serverTimestamp,
        consentVersion: PRIVACY_NOTICE_VERSION,
        consentPurpose: CONSENT_PURPOSE_ENQUIRY,
        ipAddress,
        status: 'NEW',
      },
    });
  }

  static async getAllSubmissions() {
    return await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}