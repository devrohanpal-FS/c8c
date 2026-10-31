import { NextResponse } from 'next/server';
import { ContactService } from '@/lib/services/contactService';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { AuditService } from '@/lib/audit';
import { sanitizePayload } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // 1. Cross-Site Request Forgery (CSRF) protection
    const secFetchSite = req.headers.get('sec-fetch-site');
    if (secFetchSite === 'cross-site') {
      return NextResponse.json(
        { error: 'Forbidden: Cross-origin form submission blocked.' },
        { status: 403 }
      );
    }

    // 2. Safe IP extraction and strict rate limiting (5 inquiries per 10 minutes)
    const ip = getClientIp(req);
    const limitCheck = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);

    if (!limitCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a few minutes before submitting another inquiry.' },
        { status: 429 }
      );
    }

    // 3. Payload size check & parsing
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as Record<string, unknown>;

    // 4. Honeypot bot protection
    if (body.website_url || body.honeypot || body.hp_field) {
      // Silently accept honeypot bot trap without storing
      return NextResponse.json(
        { success: true, message: 'Inquiry received successfully.' },
        { status: 200 }
      );
    }

    // 5. Sanitize all incoming fields against XSS and capture consent
    const isConsentAccepted =
      body.consentGiven === true ||
      body.consentGiven === 'true' ||
      body.consentGiven === 'on' ||
      body.consentGiven === 1 ||
      body.consent === true ||
      body.consent === 'true' ||
      body.consent === 'on' ||
      body.consent === 1;

    const sanitized = sanitizePayload({
      name: typeof body.name === 'string' ? body.name : typeof body.fullName === 'string' ? body.fullName : '',
      email: typeof body.email === 'string' ? body.email : '',
      businessName: typeof body.businessName === 'string' ? body.businessName : typeof body.company === 'string' ? body.company : null,
      helpDetails: typeof body.helpDetails === 'string' ? body.helpDetails : typeof body.message === 'string' ? body.message : '',
      budget: typeof body.budget === 'string' ? body.budget : null,
      consentGiven: isConsentAccepted,
    });

    const submission = await ContactService.createSubmission(sanitized, ip);

    // 6. Security audit log (PII-free)
    await AuditService.log({
      action: 'CONTACT_FORM_SUBMITTED',
      entity: 'ContactSubmission',
      entityId: submission.id,
      details: {
        submissionId: submission.id,
        consentGiven: submission.consentGiven,
        consentVersion: submission.consentVersion,
      },
      ipAddress: ip,
    });

    return NextResponse.json(
      { success: true, message: 'Inquiry received successfully.', submissionId: submission.id },
      { status: 200 }
    );
  } catch (error: unknown) {
    let validationMessage: string | null = null;
    let isValidation = false;

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      isValidation = true;
      const issues = 'issues' in error && Array.isArray(error.issues) ? error.issues : [];
      if (issues.length > 0 && typeof issues[0]?.message === 'string') {
        validationMessage = issues[0].message;
      }
    }

    return NextResponse.json(
      { error: validationMessage || (isValidation ? 'Invalid inquiry data. Please check your inputs.' : 'Failed to process inquiry. Please try again later.') },
      { status: isValidation ? 400 : 500 }
    );
  }
}
