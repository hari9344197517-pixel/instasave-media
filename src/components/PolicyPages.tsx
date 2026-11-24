import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  AlertTriangle,
  Info,
  Mail,
  Check,
  MessageCircle,
  Lock,
  Scale,
  Globe,
  Flag,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PolicyPages: React.FC = () => {
  const { currentPage, navigateTo, showToast, setCookieSettingsOpen } = useApp();

  // Contact Support form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactRefId, setContactRefId] = useState<string | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // DMCA / Report Content form state
  const [dmcaName, setDmcaName] = useState('');
  const [dmcaEmail, setDmcaEmail] = useState('');
  const [dmcaTargetUrl, setDmcaTargetUrl] = useState('');
  const [dmcaWorkDesc, setDmcaWorkDesc] = useState('');
  const [dmcaGoodFaith, setDmcaGoodFaith] = useState(false);
  const [dmcaRefId, setDmcaRefId] = useState<string | null>(null);
  const [dmcaSubmitting, setDmcaSubmitting] = useState(false);

  if (currentPage === 'home') return null;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('Please complete all required contact fields.');
      return;
    }

    setContactSubmitting(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'support',
          name: contactName.trim(),
          email: contactEmail.trim(),
          details: `[${contactSubject}] ${contactMessage.trim()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Please check your form details and try again.');
        setContactSubmitting(false);
        return;
      }
      setContactRefId(data.referenceId);
      showToast(`Support ticket reference ${data.referenceId} prepared.`);
    } catch {
      showToast('Unable to validate request. You can reach us directly at support@instasavemedia.com.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleOpenWhatsAppSupport = () => {
    const formattedMessage =
      `InstaSave Media - Support Notification\n\n` +
      `Reference: ${contactRefId || 'Direct Inquiry'}\n` +
      `Name: ${contactName.trim()}\n` +
      `Email: ${contactEmail.trim()}\n` +
      `Subject: ${contactSubject}\n` +
      `Message:\n${contactMessage.trim()}\n\n` +
      `Origin: https://instasavemedia.com`;

    const whatsappUrl = `https://wa.me/917092145312?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDmcaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmcaName.trim() || !dmcaEmail.trim() || !dmcaTargetUrl.trim() || !dmcaWorkDesc.trim()) {
      showToast('Please fill out all required DMCA / Content Removal fields.');
      return;
    }
    if (!dmcaGoodFaith) {
      showToast('Please confirm the good-faith authorization statement before submitting.');
      return;
    }

    setDmcaSubmitting(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dmca',
          name: dmcaName.trim(),
          email: dmcaEmail.trim(),
          targetUrl: dmcaTargetUrl.trim(),
          details: dmcaWorkDesc.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Please provide a valid URL and description.');
        setDmcaSubmitting(false);
        return;
      }
      setDmcaRefId(data.referenceId);
      showToast(`DMCA request reference ${data.referenceId} generated.`);
    } catch {
      showToast('Please send your DMCA notice directly to dmca@instasavemedia.com.');
    } finally {
      setDmcaSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Back Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>

        {/* Quick Page Switcher for Legal & Support Pages */}
        <nav aria-label="Policy and Information Navigation" className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {[
            { id: 'about', label: 'About' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms' },
            { id: 'dmca', label: 'DMCA & Report' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <a
              key={item.id}
              href={item.id === 'privacy' ? '/privacy-policy' : `/${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(item.id as 'about' | 'privacy' | 'terms' | 'dmca' | 'contact');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <article className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-6">
        {/* ============================================================== */}
        {/* 1. PRIVACY POLICY                                              */}
        {/* ============================================================== */}
        {currentPage === 'privacy' && (
          <>
            <header className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Shield className="w-3.5 h-3.5" />
                <span>Legal & Compliance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Effective Date: November 24, 2026 • Domain: <span className="font-mono">https://instasavemedia.com</span>
              </p>
            </header>

            <section className="space-y-4 text-sm leading-relaxed">
              <p>
                InstaSave Media (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) respects your privacy and is committed to protecting visitor data with transparent practices. This Privacy Policy describes what technical information is processed when you visit <strong>https://instasavemedia.com</strong>, how URLs are handled, how cookies and browser storage work, and how you can exercise your privacy rights.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                1. Information Collection and Usage
              </h2>
              <p>
                InstaSave Media does not require account registration, login credentials, passwords, payment details, or social media authentication tokens. We only process:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Public Media URLs:</strong> Links you voluntarily paste into the URL input box so our serverless backend can locate publicly accessible media streams.</li>
                <li><strong>Voluntary Support &amp; DMCA Communications:</strong> Name, email address, and message details you choose to provide when contacting support or submitting a copyright removal request.</li>
                <li><strong>Local Browser Preferences:</strong> Theme mode, language selection, cookie consent settings, and optional local download history stored strictly on your own device.</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                2. IP Addresses and Transient Server Logs
              </h2>
              <p>
                Our application is hosted on Vercel Serverless Infrastructure. When your browser requests a webpage or API endpoint, standard network metadata—such as your IP address, request timestamp, HTTP method, and endpoint path—is processed transiently in memory to enforce rate limiting (preventing automated abuse), prevent server-side request forgery (SSRF), and maintain platform security. Full query strings and submitted Instagram URLs are omitted from application logs.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                3. Cookies, Local Storage, and Consent Controls
              </h2>
              <p>
                We distinguish between strictly necessary browser storage and optional non-essential categories:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Necessary Storage:</strong> Used to remember your dark/light theme, language preference, optional local history setting, and your saved cookie consent decision (<span className="font-mono text-xs">instasavemedia_cookie_consent_v1</span>).</li>
                <li><strong>Analytics &amp; Advertising Categories:</strong> Disabled by default until you provide explicit consent. You can update or withdraw your consent at any time using our{' '}
                  <button
                    type="button"
                    onClick={() => setCookieSettingsOpen(true)}
                    className="text-pink-600 dark:text-pink-400 underline font-semibold cursor-pointer"
                  >
                    Cookie Settings
                  </button>{' '}
                  panel.
                </li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                4. Analytics Services Actually Used
              </h2>
              <p>
                At this time, InstaSave Media does <strong>not</strong> run Google Analytics, Meta Pixel, session-recording tools, or third-party behavioral tracking scripts. Should we adopt privacy-respecting analytics in the future, such scripts will remain blocked unless Analytics Cookies are enabled in your consent preferences.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                5. Google Advertising and Cookie Disclosures
              </h2>
              <p>
                InstaSave Media does not currently inject live advertising scripts prior to consent or AdSense approval. If Google AdSense is enabled on this website in the future:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Third-party vendors, including Google, may use cookies (such as the DoubleClick/DART cookie or modern equivalents) to serve ads based on your prior visits to this website or other websites.</li>
                <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 dark:text-pink-400 underline"
                  >
                    Google Ads Settings
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 dark:text-pink-400 underline"
                  >
                    www.aboutads.info
                  </a>, or by rejecting Advertising Cookies in our Cookie Settings.
                </li>
                <li>Before serving Google ads to visitors in the European Economic Area (EEA), the UK, or Switzerland, a Google-certified Consent Management Platform (CMP) will be deployed in compliance with Google&apos;s EU User Consent Policy.</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                6. Third-Party Services
              </h2>
              <p>
                To deliver functionality safely, the Service interacts with limited external providers strictly when triggered by your action:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Vercel:</strong> Cloud hosting and serverless execution of web assets and API routes.</li>
                <li><strong>Google Fonts:</strong> Delivers typography stylesheets (<span className="font-mono text-xs">Plus Jakarta Sans</span> and <span className="font-mono text-xs">JetBrains Mono</span>).</li>
                <li><strong>Public Media CDNs &amp; Resolution Services:</strong> Resolves publicly accessible Instagram post metadata and streams authorized files without storing copies on our infrastructure.</li>
                <li><strong>QR Code Generation (<span className="font-mono text-xs">api.qrserver.com</span>):</strong> Invoked only if you explicitly click the &quot;Mobile QR&quot; button to transfer a link to your phone.</li>
                <li><strong>WhatsApp Support:</strong> Opened only when you explicitly click a WhatsApp support link on the Contact page.</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                7. URL Processing, Data Storage, and Retention
              </h2>
              <p>
                Submitted URLs are processed ephemerally in server memory for the duration of the HTTP request and discarded immediately after streaming completes. InstaSave Media maintains <strong>no database of user download histories</strong> and does <strong>not store, cache, or host</strong> downloaded media files on its servers. Optional download history exists solely in your browser&apos;s <span className="font-mono text-xs">localStorage</span> and can be turned off or deleted at any time.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                8. Data Protection Measures
              </h2>
              <p>
                We apply industry-standard safeguards including forced HTTPS/TLS encryption (HSTS), Content Security Policy (CSP), strict CORS origin checks, rate limiting, SSRF network-boundary validation, and active MIME-type verification to prevent malicious script execution.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                9. User Data Deletion Requests &amp; International Privacy Rights
              </h2>
              <p>
                Depending on your jurisdiction (including the GDPR in the EEA/UK, CCPA/CPRA in California, and applicable international privacy laws), you may have the right to access, correct, or delete personal information you sent to us (such as support emails), object to processing, or withdraw consent. You can clear all locally stored browser data directly via the History modal or browser settings, and you may email <span className="font-mono text-pink-600 dark:text-pink-400">privacy@instasavemedia.com</span> to request deletion of any support correspondence.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                10. Children&apos;s Privacy
              </h2>
              <p>
                InstaSave Media is intended for general audiences and is not directed at children under 13 years of age (or the applicable age of digital consent in your region). We do not knowingly collect personal information from children. If you believe a child has submitted personal data through our support channel, please contact us for prompt deletion.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                11. Privacy Contact Information
              </h2>
              <p>
                For privacy inquiries or data deletion requests, contact our Privacy Team at{' '}
                <a href="mailto:privacy@instasavemedia.com" className="font-mono text-pink-600 dark:text-pink-400 underline">
                  privacy@instasavemedia.com
                </a>{' '}
                or visit our{' '}
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('contact');
                  }}
                  className="text-pink-600 dark:text-pink-400 underline font-semibold"
                >
                  Contact Support
                </a>{' '}
                page.
              </p>
            </section>
          </>
        )}

        {/* ============================================================== */}
        {/* 2. TERMS & CONDITIONS                                          */}
        {/* ============================================================== */}
        {currentPage === 'terms' && (
          <>
            <header className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Scale className="w-3.5 h-3.5" />
                <span>Terms of Service</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Last Updated: November 24, 2026 • Applies to <span className="font-mono">https://instasavemedia.com</span>
              </p>
            </header>

            <section className="space-y-4 text-sm leading-relaxed">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using InstaSave Media (<strong>https://instasavemedia.com</strong>), you agree to be bound by these Terms and Conditions and our Privacy and DMCA Policies. If you do not agree with any provision, please stop using the Service immediately.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                2. Disclaimer of Affiliation with Instagram and Meta
              </h2>
              <p>
                <strong>InstaSave Media is an independent web utility and is NOT affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of their subsidiaries or affiliates.</strong> The names Instagram and Meta, as well as related marks, emblems, and images, are registered trademarks of their respective owners.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                3. Acceptable Use &amp; Copyright Protection
              </h2>
              <p>
                Publicly accessible media on Instagram is <strong>not automatically copyright-free</strong>. Copyright and intellectual property rights always remain with the original creators or rights holders. You may use InstaSave Media strictly for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Downloading or archiving your own original media posts, reels, stories, photos, or audio tracks.</li>
                <li>Accessing public content for which you have obtained explicit written permission or an applicable license from the copyright holder, or where strictly permitted under applicable fair use / statutory exceptions.</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                4. User Responsibilities
              </h2>
              <p>
                You represent and warrant that you own the rights to, or hold valid authorization from the rights holder for, any URL submitted to InstaSave Media. You accept sole legal responsibility for how downloaded files are stored, used, or shared, and agree to indemnify InstaSave Media against claims resulting from unauthorized use.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                5. Prohibited Activities
              </h2>
              <p>You agree strictly NOT to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Download, redistribute, re-upload, or monetize copyrighted third-party material without permission.</li>
                <li>Attempt to access private Instagram accounts, bypass login walls, circumvent authentication, or defeat Digital Rights Management (DRM) or technical protection measures.</li>
                <li>Run automated bots, bulk scrapers, denial-of-service floods, or attempt to probe or bypass API rate limits and SSRF protections.</li>
                <li>Misrepresent InstaSave Media as an official Meta or Instagram product.</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                6. Service Limitations &amp; Warranty Disclaimer
              </h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, express or implied. We do not guarantee uninterrupted uptime, extraction compatibility for every public post, or continuous availability of third-party network resources, and we reserve the right to restrict or block access at our sole discretion.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                7. Privacy Disclosures &amp; Content Removal
              </h2>
              <p>
                InstaSave Media does not host user-submitted media files permanently. Handling of transient URLs and browser preferences is governed by our{' '}
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('privacy');
                  }}
                  className="text-pink-600 dark:text-pink-400 underline font-semibold"
                >
                  Privacy Policy
                </a>
                . Copyright owners requesting takedown or URL blocking may follow the procedure outlined in our{' '}
                <a
                  href="/dmca"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('dmca');
                  }}
                  className="text-pink-600 dark:text-pink-400 underline font-semibold"
                >
                  DMCA &amp; Copyright Policy
                </a>
                .
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                8. Contact Information
              </h2>
              <p>
                Questions regarding these Terms may be sent to{' '}
                <a href="mailto:support@instasavemedia.com" className="font-mono text-pink-600 dark:text-pink-400 underline">
                  support@instasavemedia.com
                </a>{' '}
                or submitted through our{' '}
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('contact');
                  }}
                  className="text-pink-600 dark:text-pink-400 underline font-semibold"
                >
                  Contact Support
                </a>{' '}
                page.
              </p>
            </section>
          </>
        )}

        {/* ============================================================== */}
        {/* 3. DMCA & COPYRIGHT POLICY + REPORT CONTENT FORM               */}
        {/* ============================================================== */}
        {currentPage === 'dmca' && (
          <>
            <header className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Intellectual Property Protection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                DMCA &amp; Copyright Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Copyright Contact: <span className="font-mono text-pink-600 dark:text-pink-400">dmca@instasavemedia.com</span>
              </p>
            </header>

            <section className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
                <strong>Important Notice:</strong> Publicly viewable Instagram content is <strong>not automatically copyright-free</strong>. InstaSave Media strictly supports authorized personal archiving of content you own or have explicit permission to use. We never support private account downloads, login bypass, or circumvention of technical protection measures.
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                1. No Media Hosting &amp; Intellectual Property Protection
              </h2>
              <p>
                InstaSave Media does not host, archive, store, or re-publish video, image, or audio files on its own servers. The tool acts strictly as a user-initiated technical pass-through interface for publicly accessible links. Users remain solely responsible for ensuring they hold the necessary rights or permission before processing any URL.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                2. Copyright Complaint &amp; Takedown Process (17 U.S.C. § 512)
              </h2>
              <p>
                If you are a copyright owner or authorized agent and wish to block a specific Instagram URL, profile, or domain reference from being resolved through InstaSave Media, please submit a written notice containing:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Your full legal name, organization (if applicable), mailing address, phone number, and valid email address.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>The exact Instagram URL(s) or profile path you want blocked from processing.</li>
                <li>A statement that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement under penalty of perjury that the information in your notification is accurate and that you are authorized to act on behalf of the copyright owner, along with your physical or electronic signature.</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                3. Repeat Infringement Handling
              </h2>
              <p>
                In compliance with the DMCA and applicable copyright laws, InstaSave Media maintains a zero-tolerance repeat infringement policy. Specific URLs, accounts, and IP addresses associated with repeated copyright complaints or automated unauthorized scraping are permanently blocked from using the Service.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                4. Report Content / Content Removal Request Form
              </h2>
              <p>
                Use the form below to generate a validated DMCA / Content Removal request or report unauthorized content directly to <span className="font-mono text-pink-600 dark:text-pink-400">dmca@instasavemedia.com</span>.
              </p>

              {dmcaRefId ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                    <Check className="w-5 h-5" />
                    <span>Content Removal Request Validated (Ref: {dmcaRefId})</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800/90 dark:text-emerald-200/90">
                    Please click below to send your signed notice to our Designated Copyright Agent so we can verify ownership and add the URL to our blocklist promptly.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={`mailto:dmca@instasavemedia.com?subject=${encodeURIComponent(
                        `[DMCA Removal ${dmcaRefId}] Copyright Takedown Request`
                      )}&body=${encodeURIComponent(
                        `Reference ID: ${dmcaRefId}\nClaimant Name: ${dmcaName}\nEmail: ${dmcaEmail}\nTarget URL: ${dmcaTargetUrl}\n\nWork & Infringement Description:\n${dmcaWorkDesc}\n\nGood Faith Statement: Confirmed under penalty of perjury.`
                      )}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email (dmca@instasavemedia.com)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setDmcaRefId(null);
                        setDmcaTargetUrl('');
                        setDmcaWorkDesc('');
                        setDmcaGoodFaith(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDmcaSubmit} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <Flag className="w-4 h-4 text-amber-500" />
                    <span>Content Removal &amp; Report Form</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="dmca-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name / Rights Holder *
                      </label>
                      <input
                        id="dmca-name"
                        type="text"
                        required
                        value={dmcaName}
                        onChange={(e) => setDmcaName(e.target.value)}
                        placeholder="Jane Doe / Studio Name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-pink-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="dmca-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Official Email Address *
                      </label>
                      <input
                        id="dmca-email"
                        type="email"
                        required
                        value={dmcaEmail}
                        onChange={(e) => setDmcaEmail(e.target.value)}
                        placeholder="rights@yourdomain.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dmca-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Specific URL to Block / Report *
                    </label>
                    <input
                      id="dmca-url"
                      type="url"
                      required
                      value={dmcaTargetUrl}
                      onChange={(e) => setDmcaTargetUrl(e.target.value)}
                      placeholder="https://www.instagram.com/p/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-pink-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dmca-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Description of Copyrighted Work &amp; Proof of Ownership *
                    </label>
                    <textarea
                      id="dmca-desc"
                      required
                      rows={3}
                      value={dmcaWorkDesc}
                      onChange={(e) => setDmcaWorkDesc(e.target.value)}
                      placeholder="Identify the copyrighted work and explain why access should be restricted..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-pink-500 resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dmcaGoodFaith}
                      onChange={(e) => setDmcaGoodFaith(e.target.checked)}
                      className="mt-0.5 accent-pink-600 rounded"
                    />
                    <span>
                      I state under penalty of perjury that I am the copyright owner or authorized to act on the owner&apos;s behalf, and that I have a good-faith belief the disputed use is unauthorized.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={dmcaSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:from-violet-700 hover:via-pink-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {dmcaSubmitting ? 'Validating Request...' : 'Submit Content Removal Request'}
                  </button>
                </form>
              )}
            </section>
          </>
        )}

        {/* ============================================================== */}
        {/* 4. ABOUT INSTASAVE MEDIA                                       */}
        {/* ============================================================== */}
        {currentPage === 'about' && (
          <>
            <header className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Info className="w-3.5 h-3.5" />
                <span>About Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                About InstaSave Media
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Independent Web Media Utility • <span className="font-mono">https://instasavemedia.com</span>
              </p>
            </header>

            <section className="space-y-4 text-sm leading-relaxed">
              <p>
                InstaSave Media is a web-based utility designed to help creators, educators, and everyday users preview and archive their own or authorized public Instagram media (videos, reels, stories, photos, and audio) safely across desktop and mobile browsers without installing invasive browser extensions or third-party apps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                  <Lock className="w-5 h-5 text-violet-500" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">No Login Required</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Never asks for your Instagram password or account credentials, keeping your account protected.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">Public Media Only</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Strictly respects account privacy settings and never accesses private profiles or bypasses login barriers.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                  <Globe className="w-5 h-5 text-pink-500" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">Zero Server Archive</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Links are processed ephemerally in memory and streamed directly without storing user media on our servers.
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                Independence &amp; Copyright Commitment
              </h2>
              <p>
                InstaSave Media is independently operated and has no affiliation with Meta Platforms, Inc. or Instagram. We actively encourage responsible archiving and remind visitors that public visibility does not equal a copyright waiver—please respect creators and use our{' '}
                <a
                  href="/dmca"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('dmca');
                  }}
                  className="text-pink-600 dark:text-pink-400 underline font-semibold"
                >
                  DMCA &amp; Copyright Policy
                </a>{' '}
                for any removal request.
              </p>
            </section>
          </>
        )}

        {/* ============================================================== */}
        {/* 5. CONTACT SUPPORT                                             */}
        {/* ============================================================== */}
        {currentPage === 'contact' && (
          <>
            <header className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Mail className="w-3.5 h-3.5" />
                <span>Support &amp; Inquiries</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Contact Support
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Email: <span className="font-mono text-pink-600 dark:text-pink-400">support@instasavemedia.com</span> • WhatsApp: <span className="font-mono">+91 7092145312</span>
              </p>
            </header>

            <div className="space-y-6">
              {/* WhatsApp Live Support Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                    <MessageCircle className="w-6 h-6 fill-white stroke-none" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>WhatsApp Support Channel</span>
                    </h2>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                      +91 7092145312 • Support Inquiries
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/917092145312?text=${encodeURIComponent(
                    'Hello InstaSave Media Support team, I need assistance with instasavemedia.com.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold tracking-wide text-center transition-all shadow-md shadow-emerald-500/25 shrink-0 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {contactRefId ? (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Support Message Prepared (Ref: {contactRefId})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Your inquiry passed validation. Choose how you would like to transmit your message to our team:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`mailto:support@instasavemedia.com?subject=${encodeURIComponent(
                        `[${contactRefId}] ${contactSubject}`
                      )}&body=${encodeURIComponent(
                        `Reference ID: ${contactRefId}\nName: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`
                      )}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleOpenWhatsAppSupport}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                      <span>Send via WhatsApp (+91 7092145312)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContactRefId(null);
                        setContactName('');
                        setContactEmail('');
                        setContactMessage('');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-pink-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-pink-500"
                    >
                      <option>General Inquiry</option>
                      <option>Download Issue / Bug Report</option>
                      <option>Privacy / Data Deletion Request</option>
                      <option>DMCA / Copyright Removal</option>
                      <option>Partnership / Advertising</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Describe your inquiry, technical issue, or privacy request..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-pink-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:from-violet-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {contactSubmitting ? 'Validating...' : 'Prepare Support Message'}
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white">General Support</div>
                  <div className="font-mono text-pink-600 dark:text-pink-400 mt-0.5">support@instasavemedia.com</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white">Privacy &amp; Data Requests</div>
                  <div className="font-mono text-pink-600 dark:text-pink-400 mt-0.5">privacy@instasavemedia.com</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white">Copyright / DMCA</div>
                  <div className="font-mono text-pink-600 dark:text-pink-400 mt-0.5">dmca@instasavemedia.com</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* 6. 404 PAGE NOT FOUND                                          */}
        {/* ============================================================== */}
        {currentPage === 'not-found' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              404 — Page Not Found
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              The page you requested does not exist or may have been moved. Return to the InstaSave Media homepage to use our media tools.
            </p>
            <div className="pt-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('home');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-pink-500/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Homepage</span>
              </a>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
