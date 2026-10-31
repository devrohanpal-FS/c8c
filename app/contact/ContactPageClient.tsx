'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, Lock, FileText, AlertCircle } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import './Contact.css';

export interface SiteSettingsContactInfo {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  siteName?: string | null;
}

interface ContactPageClientProps {
  siteSettings?: SiteSettingsContactInfo | null;
}

const SERVICE_GROUPS = [
  {
    label: 'Creative Services',
    options: [
      'Brand Identity & Creative Strategy',
      'CGI & 3D Motion Design',
      'Video Production & Commercial Shoots',
      'AI Ads & Creatives',
      'Event Coverage & Content Production',
      'Digital Content & Campaign Strategy',
    ],
  },
  {
    label: 'Technology Services',
    options: [
      'Web Development (Websites, SaaS, Apps)',
      'Mobile App Development (iOS & Android)',
      'AI Solutions (RAG, LLM & AI Integration)',
      'AI Agents (Sales, Support, Business Bots)',
      'WhatsApp Solutions (API & Chatbots)',
      'Automation (n8n & Workflow Automation)',
      'Software & SaaS Development (ERP, CRM)',
      'API & Integrations (Payment, Webhooks)',
      'Digital Experience & Virtual Tours',
      '360° Panorama & Virtual Tours',
      'Maintenance & Support (24/7 Monitoring)',
    ],
  },
  {
    label: 'Other Inquiries',
    options: [
      'Full-Service Retainer (Creative + Tech)',
      'Custom Project / Multiple Services',
    ],
  },
] as const;

export default function ContactPageClient({ siteSettings }: ContactPageClientProps = {}) {
  const contactEmail = siteSettings?.email || 'hello@cre8tivecove.com';
  const contactAddress = siteSettings?.address || 'Delhi, India';
  const [contactImg, setContactImg] = useState('/uploads/media_1793098928568_299c025bf8c66802.png');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    helpDetails: '',
    budget: '',
  });

  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showFullNotice, setShowFullNotice] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentGiven) {
      setConsentError(true);
      setStatus('ERROR');
      setErrorMessage('Please review and acknowledge the DPDP Data Protection Notice before submitting your inquiry.');
      const noticeEl = document.getElementById('contactPrivacyNotice');
      if (noticeEl) {
        noticeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setStatus('SUBMITTING');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          consentGiven,
        }),
      });

      if (res.ok) {
        setStatus('SUCCESS');
        setFormData({
          name: '',
          email: '',
          businessName: '',
          helpDetails: '',
          budget: '',
        });
        setConsentGiven(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('ERROR');
        setErrorMessage(data?.error || 'Unable to submit inquiry. Please check your inputs and try again.');
      }
    } catch {
      setStatus('ERROR');
      setErrorMessage('Network connection error. Please check your internet connection.');
    }
  };

  const channelLinks = [
    { label: 'Media & Press', href: 'mailto:press@cre8tivecove.com?subject=Media/Press Inquiry' },
    { label: 'Careers & Talent', href: 'mailto:careers@cre8tivecove.com?subject=Careers Inquiry' },
    { label: 'General Inquiries', href: `mailto:${contactEmail}?subject=General Info Inquiry` },
  ];

  return (
    <PageWrapper>
      <div className="contact-page w-full font-sans text-black selection:bg-[#ffd700] selection:text-black">

        {/* HERO INTRO */}
        <section data-color="#FFFEF2" className="bg-[#f5f0e6] pt-32 sm:pt-40 pb-20 md:pb-28 px-6 md:px-16 text-left border-b border-black/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="pb-4 border-b border-black/20 mb-12">
              <span className="font-mono text-xs sm:text-sm text-black/60 font-bold uppercase tracking-widest block">
                CONTACT US
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* LEFT TEXT COLUMN */}
              <div className="lg:col-span-7 flex flex-col">
                <h1 className="font-condensed text-[11vw] sm:text-[9.5vw] lg:text-[7.8rem] font-black uppercase text-[#0a0a0a] leading-[0.92] tracking-tight select-none mb-3">
                  REACH
                  <br />
                  OUT
                </h1>
                <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#0a0a0a] font-normal leading-[1.05] tracking-tight mt-2 sm:mt-4">
                  and let&apos;s build something iconic.
                </h2>
                <p className="font-sans text-base sm:text-xl text-black/85 font-normal leading-relaxed max-w-2xl mt-8">
                  Whether you&apos;re launching a nationwide commercial campaign, crafting an immersive digital flagship, producing cinematic visual storytelling, or scaling cutting-edge tech — we&apos;re the creative powerhouse that turns bold ideas into work people can&apos;t stop talking about.
                </p>
              </div>

              {/* RIGHT IMAGE COLUMN */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[520px] aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/10 bg-black">
                  <Image
                    src={contactImg}
                    alt="Cre8tiveCove Creative Studio"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                    priority
                    onError={() => setContactImg('/images/stock/stock-work.jpg')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 right-8 z-10">
                    <div className="px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-black font-mono text-xs font-bold uppercase tracking-widest shadow-xl border border-black/10">
                      LET&apos;S CREATE TOGETHER
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT INQUIRY SECTION */}
        <section className="bg-[#0a0a0a] text-[#f5f0e6] py-28 px-6 md:px-16 border-b border-white/10">
          <div className="max-w-[1600px] mx-auto">
            <h2 className="font-serif text-6xl sm:text-8xl md:text-9xl text-white font-normal leading-[0.95] tracking-tight mb-16">
              Start a Project
            </h2>

            {status === 'SUCCESS' ? (
              <div className="py-20 text-center flex flex-col items-center gap-6 max-w-xl mx-auto bg-[#121212] p-12 rounded-3xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-[#ffd700] text-black flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-condensed text-4xl uppercase text-white font-bold tracking-tight">
                  TRANSMISSION RECEIVED
                </h3>
                <p className="text-base font-sans text-gray-300">
                  Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('IDLE')}
                  className="mt-4 px-8 py-3.5 rounded-full bg-white text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-[#ffd700] transition-colors cursor-pointer"
                >
                  Submit Another Project
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                  {/* LEFT COLUMN */}
                  <div className="lg:col-span-6 flex flex-col gap-8">
                    {/* NAME */}
                    <div>
                      <label htmlFor="contactName" className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-widest block mb-3">
                        WHAT&apos;S YOUR NAME?
                      </label>
                      <input
                        id="contactName"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full bg-[#f5f0e6] text-black px-6 py-4 rounded-2xl sm:rounded-full font-sans text-base outline-none border border-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-[#ffd700] transition-all"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label htmlFor="contactEmail" className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-widest block mb-3">
                        HOW ABOUT YOUR EMAIL?
                      </label>
                      <input
                        id="contactEmail"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full bg-[#f5f0e6] text-black px-6 py-4 rounded-2xl sm:rounded-full font-sans text-base outline-none border border-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-[#ffd700] transition-all"
                      />
                    </div>

                    {/* BUSINESS NAME */}
                    <div>
                      <label htmlFor="contactBusinessName" className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-widest block mb-3">
                        WHAT&apos;S YOUR BUSINESS CALLED?
                      </label>
                      <input
                        id="contactBusinessName"
                        name="businessName"
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Company or Brand Name"
                        className="w-full bg-[#f5f0e6] text-black px-6 py-4 rounded-2xl sm:rounded-full font-sans text-base outline-none border border-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-[#ffd700] transition-all"
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="lg:col-span-6 flex flex-col gap-8">
                    {/* HELP DETAILS */}
                    <div>
                      <label htmlFor="contactHelpDetails" className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-widest block mb-3">
                        HOW CAN WE HELP YOU?
                      </label>
                      <textarea
                        id="contactHelpDetails"
                        name="helpDetails"
                        required
                        rows={5}
                        value={formData.helpDetails}
                        onChange={(e) => setFormData({ ...formData, helpDetails: e.target.value })}
                        placeholder="Tell us about your project goals, scope, timeline, or what you're looking to create..."
                        className="w-full bg-[#f5f0e6] text-black p-6 rounded-3xl font-sans text-base outline-none border border-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-[#ffd700] transition-all resize-none min-h-[200px]"
                      />
                    </div>

                    {/* SERVICES DROPDOWN */}
                    <div>
                      <label htmlFor="contactService" className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-widest block mb-3">
                        SELECT A SERVICE
                      </label>
                      <div className="relative">
                        <select
                          id="contactService"
                          name="budget"
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-[#f5f0e6] text-black px-6 py-4 rounded-2xl sm:rounded-full font-sans text-base outline-none border border-white/10 focus:ring-2 focus:ring-[#ffd700] transition-all cursor-pointer appearance-none pr-12"
                        >
                          <option value="" disabled>
                            -- Choose a Service --
                          </option>
                          {SERVICE_GROUPS.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.options.map((service) => (
                                <option key={service} value={service}>
                                  {service}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-black">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DPDP ACT 2023 STATUTORY DATA PROTECTION & CONSENT FORM */}
                <div
                  id="contactPrivacyNotice"
                  tabIndex={-1}
                  className={`p-6 sm:p-7 rounded-2xl bg-[#141414] border transition-all duration-300 font-sans space-y-4 ${
                    consentError && !consentGiven
                      ? 'border-amber-500/80 ring-2 ring-amber-500/40 bg-amber-950/10'
                      : consentGiven
                      ? 'border-[#ffd700]/40 bg-[#161616]'
                      : 'border-white/10'
                  }`}
                >
                  {/* Notice Header & Statutory Version */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-white font-mono text-xs font-bold uppercase tracking-wider block">
                          DPDP Act 2023 Data Protection Notice
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 block">
                          Notice Version: 2026-10-v1 • Purpose: COMMERCIAL_ENQUIRY_HANDLING
                        </span>
                      </div>
                    </div>
                    {consentGiven ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Consent Acknowledged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wide">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        Acknowledgment Required
                      </span>
                    )}
                  </div>

                  {/* Summary Terms (Readable Directly in Form) */}
                  <div className="space-y-2.5 text-xs text-gray-300 leading-relaxed">
                    <p>
                      In compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, CRE8TIVECOVE collects your name, email, optional phone/company, and project specifications solely to evaluate your requirements, provide price estimates, and correspond directly regarding your inquiry.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                      <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                        <span className="text-[#ffd700] font-bold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          Zero Third-Party Sale
                        </span>
                        <p className="text-gray-400">Your personal details are treated strictly confidentially and are never sold or shared with third-party advertisers.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                        <span className="text-[#ffd700] font-bold flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          Data Principal Rights (§12)
                        </span>
                        <p className="text-gray-400">You retain statutory rights to access, correct, or request complete erasure of your submitted data at any time.</p>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Full Legal Provisions */}
                  {showFullNotice && (
                    <div className="pt-3 border-t border-white/10 space-y-2.5 text-xs text-gray-400 leading-relaxed animate-fadeIn">
                      <p>
                        <strong>Data Fiduciary:</strong> CRE8TIVECOVE Digital Studio, {contactAddress}.
                      </p>
                      <p>
                        <strong>Retention Limitation (§8(7)):</strong> Submissions are retained for up to 180 days solely for commercial dialogue, after which uncontracted records are safely purged.
                      </p>
                      <p>
                        <strong>Grievance Redressal (§13):</strong> You may withdraw consent or submit an erasure request at any time by emailing{' '}
                        <a href={`mailto:${contactEmail}`} className="text-[#ffd700] underline font-mono">
                          {contactEmail}
                        </a>. If unresolved, complaints may be escalated to the Data Protection Board of India (DPBI).
                      </p>
                      <p>
                        Review our complete{' '}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ffd700] underline hover:text-white"
                        >
                          DPDP Privacy &amp; Data Protection Policy Page
                        </a>.
                      </p>
                    </div>
                  )}

                  {/* Toggle Full Notice Button */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowFullNotice(!showFullNotice)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#ffd700] hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{showFullNotice ? 'Collapse Full Terms' : 'Read Full DPDP Terms & Grievance Info'}</span>
                      {showFullNotice ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-gray-400 hover:text-white underline"
                    >
                      Open Full Policy ↗
                    </a>
                  </div>

                  {/* Explicit Mandatory Acknowledgment Checkbox */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    consentGiven
                      ? 'bg-emerald-950/25 border-emerald-500/40 ring-1 ring-emerald-500/20'
                      : consentError
                      ? 'bg-amber-950/30 border-amber-500/70'
                      : 'bg-black/50 border-white/10 hover:border-white/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="privacyConsent"
                        name="consentGiven"
                        checked={consentGiven}
                        onChange={(e) => {
                          setConsentGiven(e.target.checked);
                          if (e.target.checked) {
                            setConsentError(false);
                            if (errorMessage.includes('DPDP') || errorMessage.includes('consent') || errorMessage.includes('Consent')) {
                              setErrorMessage('');
                              setStatus('IDLE');
                            }
                          }
                        }}
                        required
                        aria-required="true"
                        aria-describedby="contactPrivacyNotice"
                        className="mt-1 h-5 w-5 shrink-0 accent-[#ffd700] cursor-pointer rounded focus:ring-2 focus:ring-[#ffd700]"
                      />
                      <label
                        htmlFor="privacyConsent"
                        className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans cursor-pointer select-none"
                      >
                        <strong className="text-white block font-medium mb-0.5">
                          I have read and acknowledge the DPDP Data Protection Notice (Mandatory)
                        </strong>
                        I give explicit consent to CRE8TIVECOVE to collect and process my submitted details solely for evaluating and responding to this inquiry in accordance with the{' '}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ffd700] underline hover:text-white transition-colors"
                        >
                          Privacy Policy
                        </a>.
                      </label>
                    </div>
                  </div>
                </div>

                {/* Honeypot Anti-Bot Hidden Field */}
                <input
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                  aria-hidden="true"
                />

                {/* Error Banner */}
                {status === 'ERROR' && (
                  <div role="alert" className="p-4 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-200 text-sm font-sans flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span>{errorMessage || 'Failed to submit inquiry. Please try again.'}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === 'SUBMITTING' || !consentGiven}
                    className="inline-flex items-center gap-4 bg-white text-black pl-3 pr-8 py-3.5 rounded-full font-sans font-bold text-sm uppercase tracking-wider hover:bg-[#ffd700] transition-all hover:scale-105 shadow-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white group"
                  >
                    <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center bg-white group-hover:bg-[#ffd700] transition-colors">
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span>{status === 'SUBMITTING' ? 'Submitting...' : 'Get Started'}</span>
                  </button>

                  {!consentGiven && (
                    <span className="text-xs font-mono text-amber-400/90 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Please acknowledge the DPDP notice above to unlock submission.
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

        {/* BOTTOM INQUIRIES */}
        <section className="bg-[#0a0a0a] text-[#f5f0e6] py-28 px-6 md:px-16">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-12">
            <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl text-white font-normal leading-[1.02] tracking-tight">
              Interested in something else?
              <br />
              Shoot us a note.
            </h2>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-2">
              {channelLinks.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="inline-flex items-center gap-3 bg-white text-black pl-2.5 pr-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffd700] transition-all hover:scale-105 shadow-lg group"
                >
                  <div className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center bg-white group-hover:bg-[#ffd700] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span>{channel.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
