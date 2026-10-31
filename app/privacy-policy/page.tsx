import { Metadata } from 'next';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { ShieldCheck, Mail, Phone, MapPin, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & DPDP Data Protection — CRE8TIVECOVE',
  description:
    'Comprehensive statutory privacy notice and data protection commitments under the Digital Personal Data Protection Act, 2023 (DPDP Act 2023).',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 30, 2026';
  const grievanceEmail = 'hello@cre8tivecove.com';
  const grievancePhone = '+91 9999-659-129';
  const registeredAddress = 'Delhi, India';

  return (
    <PageWrapper>
      <div className="w-full bg-[#0a0a0a] text-[#f5f0e6] pt-32 pb-24 px-6 md:px-16 font-sans">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* BACK LINK */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ffd700] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contact</span>
          </Link>

          {/* HEADER */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Statutory Policy</span>
            </div>
            <h1 className="font-condensed text-5xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-[0.95]">
              PRIVACY & DATA PROTECTION POLICY
            </h1>
            <p className="text-sm font-mono text-gray-400">
              Notice Version: 2026-10-v1 • Last Updated: {lastUpdated}
            </p>
          </div>

          {/* EXECUTIVE COMMITMENT */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#ffd700]/20 space-y-3">
            <h2 className="text-lg font-bold text-[#ffd700] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#ffd700]" />
              Our Data Protection Commitment
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              CRE8TIVECOVE (&ldquo;C8C&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates as a Data Fiduciary under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. We respect your autonomy and privacy. We strictly collect only the minimum personal data necessary to evaluate commercial requirements, provide project estimates, and communicate directly with you. We do not engage in data brokering, marketing profiling, or unauthorized third-party disclosure.
            </p>
          </div>

          {/* STATUTORY CLAUSES */}
          <div className="space-y-10 text-sm leading-relaxed text-gray-300">

            {/* 1. DATA FIDUCIARY */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                1. Identity of the Data Fiduciary (§5(1))
              </h2>
              <p>
                <strong>CRE8TIVECOVE Digital Studio</strong><br />
                Address: {registeredAddress}<br />
                Contact Email: <a href={`mailto:${grievanceEmail}`} className="text-[#ffd700] underline">{grievanceEmail}</a><br />
                Telephone: {grievancePhone}
              </p>
            </section>

            {/* 2. DATA COLLECTED */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                2. Personal Data We Collect
              </h2>
              <p>When you contact us through our website, we collect the following personal data points:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-300">
                <li><strong>Identification Details:</strong> Full Name.</li>
                <li><strong>Contact Details:</strong> Work Email Address, optional Phone Number.</li>
                <li><strong>Professional Details:</strong> Company / Organization Name (optional).</li>
                <li><strong>Project Context:</strong> Project requirements, services selected, and estimated budget scope.</li>
                <li><strong>Consent Metadata:</strong> Authoritative server timestamp of consent, notice version acknowledged, and non-PII submission hash.</li>
              </ul>
            </section>

            {/* 3. PURPOSE OF PROCESSING */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                3. Specified Purpose of Processing (§5 &amp; §6)
              </h2>
              <p>
                Your personal data is collected and processed exclusively for the following specified, legitimate commercial purpose:
              </p>
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-[#ffd700]">
                COMMERCIAL_ENQUIRY_HANDLING: Project assessment, scope feasibility analysis, commercial proposal generation, and direct correspondence in response to your explicit inquiry.
              </div>
              <p className="text-xs text-gray-400">
                We do not sell, license, lease, or distribute your personal data to any third-party marketing networks, advertising exchanges, or external data brokers.
              </p>
            </section>

            {/* 4. DATA PRINCIPAL RIGHTS */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                4. Your Rights as a Data Principal (§12)
              </h2>
              <p>Under the DPDP Act 2023, you retain full ownership of your personal data and may exercise the following rights at any time:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                    Right to Access &amp; Summary
                  </h3>
                  <p className="text-xs text-gray-400">Request a summary of personal data being processed and identities of any data processors involved.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                    Right to Correction &amp; Erasure
                  </h3>
                  <p className="text-xs text-gray-400">Request correction of inaccurate information, completion of incomplete records, or complete erasure of your personal data.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                    Right of Grievance Redressal
                  </h3>
                  <p className="text-xs text-gray-400">Lodge a complaint with our Grievance Officer regarding any act or omission by us regarding your data.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                    Right to Withdraw Consent (§6(4))
                  </h3>
                  <p className="text-xs text-gray-400">Withdraw your consent easily at any time by emailing us. Past lawful processing remains unaffected.</p>
                </div>
              </div>
            </section>

            {/* 5. DATA RETENTION */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                5. Data Retention &amp; Storage Limitation (§8(7))
              </h2>
              <p>
                Inquiry submissions are retained for up to <strong>180 days</strong> from the date of submission to maintain active commercial dialogue. If an inquiry does not result in an active commercial engagement or ongoing client relationship, the record is flagged for secure erasure.
              </p>
            </section>

            {/* 6. GRIEVANCE REDRESSAL OFFICER */}
            <section className="space-y-4 p-6 rounded-2xl bg-[#141414] border border-white/10">
              <h2 className="text-xl font-bold text-[#ffd700] uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ffd700]" />
                6. Grievance Redressal Officer Contact Details (§13)
              </h2>
              <p className="text-xs text-gray-300">
                To exercise any of your statutory rights, withdraw consent, or file a privacy inquiry, please contact our designated Grievance Redressal Officer:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/60 border border-white/10">
                  <Mail className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <a href={`mailto:${grievanceEmail}`} className="text-gray-200 hover:text-[#ffd700] truncate">
                    {grievanceEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/60 border border-white/10">
                  <Phone className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <a href={`tel:${grievancePhone}`} className="text-gray-200 hover:text-[#ffd700]">
                    {grievancePhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/60 border border-white/10">
                  <MapPin className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span className="text-gray-200 truncate">Delhi, India</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                <strong>Statutory Escalation:</strong> If any grievance remains unresolved within the statutory timeframe, you have the right to escalate your complaint to the <strong>Data Protection Board of India (DPBI)</strong>.
              </p>
            </section>

          </div>

          {/* BOTTOM CTA */}
          <div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-gray-400">
            <span>© 2026 CRE8TIVECOVE. All rights reserved.</span>
            <Link href="/contact" className="text-[#ffd700] underline hover:text-white">
              Return to Contact Form
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
