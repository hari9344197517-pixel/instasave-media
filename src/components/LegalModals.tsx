import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  AlertTriangle,
  Info,
  Mail,
  Send,
  Check,
  Copy,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalModals: React.FC = () => {
  const { openModal, setOpenModal, showToast } = useApp();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Share link copied state
  const [shareCopied, setShareCopied] = useState(false);

  if (!openModal || openModal === 'history') return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('Please fill out all contact fields.');
      return;
    }

    const formattedMessage =
      `🔔 *InstaSave Media - Support Notification*\n\n` +
      `👤 *Name:* ${contactName.trim()}\n` +
      `📧 *Email:* ${contactEmail.trim()}\n` +
      `📌 *Subject:* ${contactSubject}\n` +
      `💬 *Message:*\n${contactMessage.trim()}\n\n` +
      `🕒 *Time:* ${new Date().toLocaleString()}\n` +
      `🌐 *Origin:* ${typeof window !== 'undefined' ? window.location.href : 'InstaSave Media'}`;

    const whatsappUrl = `https://wa.me/917092145312?text=${encodeURIComponent(formattedMessage)}`;

    setContactSubmitted(true);
    showToast('Redirecting notification to WhatsApp (+91 7092145312)...');

    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = whatsappUrl;
    }

    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setOpenModal(null);
    }, 4000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin).then(() => {
      setShareCopied(true);
      showToast('Website link copied to clipboard!');
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {openModal === 'privacy' && <Shield className="w-5 h-5 text-violet-500" />}
            {openModal === 'terms' && <FileText className="w-5 h-5 text-pink-500" />}
            {openModal === 'dmca' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {openModal === 'about' && <Info className="w-5 h-5 text-indigo-500" />}
            {openModal === 'contact' && <Mail className="w-5 h-5 text-emerald-500" />}
            {openModal === 'share' && <Share2 className="w-5 h-5 text-pink-500" />}

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
              {openModal === 'privacy' && 'Privacy Policy'}
              {openModal === 'terms' && 'Terms and Conditions'}
              {openModal === 'dmca' && 'DMCA & Copyright Policy'}
              {openModal === 'about' && 'About InstaSave Media'}
              {openModal === 'contact' && 'Contact Support'}
              {openModal === 'share' && 'Share InstaSave Media'}
            </h3>
          </div>
          <button
            onClick={() => setOpenModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
          {/* Privacy Policy */}
          {openModal === 'privacy' && (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Last updated: November 2026
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                1. No Account or Personal Data Collection
              </h4>
              <p>
                InstaSave Media does not require user registration, passwords, credit card information, or account credentials. You can use all public Instagram media downloading tools anonymously.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                2. Server Logs and URLs
              </h4>
              <p>
                We temporarily process requested public media URLs solely for the purpose of resolving video, image, or audio stream locations and relaying the direct download to your browser. We do not store or sell user browsing history or media files on our servers.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                3. Local Storage
              </h4>
              <p>
                Your download history and theme/language preferences are stored exclusively on your local device via standard browser localStorage. You have complete control to toggle history off or clear it at any time.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                4. Third-Party Integrations
              </h4>
              <p>
                We do not inject adware, spyware, or trackers into downloaded files. Any future display advertising conforms to Google AdSense publisher policies.
              </p>
            </>
          )}

          {/* Terms & Conditions */}
          {openModal === 'terms' && (
            <>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                1. Acceptance of Terms
              </h4>
              <p>
                By accessing and using InstaSave Media (instasave), you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part, please discontinue using the service immediately.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                2. Lawful Personal Use Only
              </h4>
              <p>
                InstaSave Media is designed strictly for personal, non-commercial, and lawful archiving or offline viewing of public content. You agree not to use this service to infringe intellectual property rights, harass creators, or violate Meta Platforms / Instagram terms of service.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                3. Security Boundaries & Private Accounts
              </h4>
              <p>
                InstaSave Media strictly respects privacy. We do not support scraping private profiles, circumventing authentication walls, or bypassing encryption or digital rights management (DRM) mechanisms.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                4. Disclaimer of Warranty
              </h4>
              <p>
                The service is provided "as is" and "as available" without warranties of any kind. InstaSave Media is not responsible for interruptions, changes in third-party API availability, or content hosted on third-party servers.
              </p>
            </>
          )}

          {/* DMCA & Copyright Policy */}
          {openModal === 'dmca' && (
            <>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Digital Millennium Copyright Act (DMCA) Notice
              </h4>
              <p>
                InstaSave Media respects the intellectual property rights of creators, photographers, videographers, and musicians. InstaSave Media does not host, store, or re-upload any media files on its servers; all downloaded content is fetched in real-time from Instagram's public content delivery networks.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                Takedown Requests
              </h4>
              <p>
                If you are a copyright owner or an authorized agent and believe that content accessible through our platform infringes your copyright, please submit a formal notification with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>The specific Instagram URL or account in question.</li>
                <li>Your contact information including name, address, phone number, and email.</li>
                <li>A statement that you have a good-faith belief that the disputed use is not authorized.</li>
              </ul>
              <p className="mt-2">
                Send DMCA notifications to: <span className="font-mono text-pink-600 dark:text-pink-400">dmca@snapsave.app</span>
              </p>
            </>
          )}

          {/* About Us */}
          {openModal === 'about' && (
            <>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Welcome to InstaSave Media (InstaSave Media)
              </h4>
              <p>
                InstaSave Media is a premier worldwide online web utility built for creators, marketers, educators, and social media enthusiasts who want to archive their favorite memories, viral reels, educational videos, and beautiful photography.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-2">
                Our Core Principles:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-slate-800 dark:text-slate-200">Zero Slop, Zero Watermarks:</strong> We extract pristine, untouched 1080p and 4K streams with original audio tracks.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Privacy First:</strong> We do not ask for your Instagram password, we don't track your identity, and we never scrape private profiles.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">100% Free Everywhere:</strong> Engineered to work seamlessly across iPhone, iPad, Android, Mac, and Windows with lightning-fast cloud conversion.</li>
              </ul>
            </>
          )}

          {/* Contact Support Form with WhatsApp Integration */}
          {openModal === 'contact' && (
            <div className="space-y-5">
              {/* WhatsApp Live Support Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                    <MessageCircle className="w-6 h-6 fill-white stroke-none" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>WhatsApp Live Support</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                      +91 7092145312 • Fast Notification
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/917092145312?text=${encodeURIComponent(
                    'Hello InstaSave Media Support team (+91 7092145312), I need assistance with the downloader.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold tracking-wide text-center transition-all shadow-md shadow-emerald-500/25 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    WhatsApp Notification Dispatched!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been compiled and sent to our official WhatsApp support number at{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+91 7092145312</strong>.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/917092145312?text=${encodeURIComponent(
                        `Support Notification from ${contactName || 'User'}: ${contactMessage || 'Need assistance'}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25"
                    >
                      <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                      <span>Re-open WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    <span>Or send a direct notification message via WhatsApp:</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-emerald-500"
                    >
                      <option>General Inquiry</option>
                      <option>Download Issue / Bug Report</option>
                      <option>Feature Request</option>
                      <option>DMCA / Copyright</option>
                      <option>Partnership / Advertising</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Describe your inquiry, issue, or feedback..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Send Notification to WhatsApp (+91 7092145312)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Share Website Modal */}
          {openModal === 'share' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share InstaSave Media with friends, family, and colleagues to let them download Instagram media in 1080p Full HD for free!
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://snapsave.app'}
                </span>
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-bold shrink-0 hover:bg-pink-700 transition-colors"
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{shareCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'Check out InstaSave Media to download Instagram Reels, Videos and Stories in 1080p: ' +
                      window.location.origin
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    'Download Instagram Reels, Videos, Photos and DP in 1080p Full HD for free with InstaSave Media: ' +
                      window.location.origin
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold text-center transition-colors"
                >
                  Twitter / X
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    window.location.origin
                  )}&text=${encodeURIComponent('Download Instagram Media in HD')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold text-center transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.origin
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold text-center transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
