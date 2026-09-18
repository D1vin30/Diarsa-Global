import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../motion';
import { services } from '../data/services';
import Slot from '@media/Slot';
import MediaRegion from '@media/MediaRegion';
import EditableText from '@media/EditableText';

const inputClass =
  'w-full bg-slate-2 border border-line-dark rounded-[6px] px-4 py-3 text-white text-[0.92rem] placeholder:text-white-soft focus:outline-none focus:border-accent-tint transition-colors duration-150';

const selectClass = `${inputClass} appearance-none cursor-pointer`;

const budgetRanges = ['Under ₦5M', '₦5M – ₦20M', '₦20M – ₦100M', 'Over ₦100M', 'Not sure yet'];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const el = document.createElement('textarea');
    el.value = value;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — link itself still works
    } finally {
      document.body.removeChild(el);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="text-white-soft hover:text-accent-tint transition-colors duration-150 shrink-0"
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <span className="text-[0.7rem] text-accent-tint">Copied</span>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
          <rect x="9" y="9" width="11" height="11" rx="1.5" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', projectType: '', budget: '', subject: '', message: '', _honey: '' });
  const [status, setStatus] = useState('idle');

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form._honey) {
      // Honeypot tripped — a bot filled a field real users never see. Fake success, send nothing.
      setStatus('success');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@diarsaglobal.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          project_type: form.projectType || 'Not specified',
          budget: form.budget || 'Not specified',
          _subject: form.subject || 'New quote request from diarsaglobal.com',
          message: form.message,
          _template: 'table',
          _honey: form._honey,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', email: '', projectType: '', budget: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <section className="section-shell bg-slate text-white pt-[9rem]" data-nav-theme="dark">
        <div className="section-inner">
          <motion.div
            className="section-head max-w-[62ch]"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.span className="font-sans font-semibold text-[0.9rem] text-accent-tint mb-[0.8rem] block" variants={fadeUp}>
              <EditableText id="contact.eyebrow" as="span">Get In Touch</EditableText>
            </motion.span>
            <motion.h1 className="text-white text-[clamp(2rem,4.2vw,3rem)] mb-[1rem]" variants={fadeUp}>
              <EditableText id="contact.headline" as="span">Contact &amp; Quotes</EditableText>
            </motion.h1>
            <motion.p className="lede text-white-soft mb-6" variants={fadeUp}>
              <EditableText id="contact.body" as="span">Have a project in mind? Tell us about it and the team will scope it and follow up with a quote.</EditableText>
            </motion.p>
            <motion.div className="flex flex-wrap gap-3" variants={fadeUp}>
              <a
                href="mailto:diarsaglobal@gmail.com"
                className="inline-flex items-center gap-2 bg-slate-2 border border-line-dark rounded-full pl-3 pr-4 py-2 text-white text-[0.85rem] font-medium no-underline hover:border-accent-tint transition-colors duration-150"
              >
                <span className="w-7 h-7 rounded-full bg-slate-3 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dd9868" strokeWidth="1.6" className="w-3.5 h-3.5">
                    <path d="M3 6h18v12H3z" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <EditableText id="contact.pill.email" as="span">Email</EditableText>
              </a>
              <a
                href="https://wa.me/2348036789325"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-slate-2 border border-line-dark rounded-full pl-3 pr-4 py-2 text-white text-[0.85rem] font-medium no-underline hover:border-accent-tint transition-colors duration-150"
              >
                <span className="w-7 h-7 rounded-full bg-slate-3 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dd9868" strokeWidth="1.6" className="w-3.5 h-3.5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </span>
                <EditableText id="contact.pill.whatsapp" as="span">WhatsApp</EditableText>
              </a>
              <a
                href="tel:+2348036789325"
                className="inline-flex items-center gap-2 bg-slate-2 border border-line-dark rounded-full pl-3 pr-4 py-2 text-white text-[0.85rem] font-medium no-underline hover:border-accent-tint transition-colors duration-150"
              >
                <span className="w-7 h-7 rounded-full bg-slate-3 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dd9868" strokeWidth="1.6" className="w-3.5 h-3.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <EditableText id="contact.pill.call" as="span">Call</EditableText>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative rounded-[10px] border border-line-dark h-[280px] max-[700px]:h-[200px] mt-14 overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <Slot id="contact.banner" src="/services/civil-structural.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" hasOverlayText />
            <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/50 to-slate/10" />
            <div className="absolute inset-0 flex items-end p-8">
              <p className="text-white text-[clamp(1.1rem,2.4vw,1.5rem)] font-display font-extrabold max-w-[38ch]">
                <EditableText id="contact.banner.text" as="span">Real engineers, on the ground in Edo State — ready to talk through your project.</EditableText>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-[1.15fr_0.85fr] max-[820px]:grid-cols-1 gap-10 mt-14"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.form
              id="message"
              data-nav-label="Send a Message"
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {status === 'success' ? (
                <div className="bg-slate-2 border border-line-dark rounded-[8px] p-8 text-center">
                  <p className="text-white text-[1.05rem] font-semibold mb-2">
                    <EditableText id="contact.form.successTitle" as="span">Message sent.</EditableText>
                  </p>
                  <p className="text-white-soft text-[0.9rem]">
                    <EditableText id="contact.form.successBody" as="span">Thanks for reaching out — we'll be in touch shortly.</EditableText>
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 max-[520px]:grid-cols-1 gap-4">
                    <input
                      className={inputClass}
                      type="text"
                      placeholder="Name"
                      required
                      value={form.name}
                      onChange={updateField('name')}
                    />
                    <input
                      className={inputClass}
                      type="email"
                      placeholder="Email"
                      required
                      value={form.email}
                      onChange={updateField('email')}
                    />
                  </div>
                  <div className="grid grid-cols-2 max-[520px]:grid-cols-1 gap-4">
                    <select
                      className={selectClass}
                      value={form.projectType}
                      onChange={updateField('projectType')}
                    >
                      <option value="">Project type (optional)</option>
                      {services.map((s) => (
                        <option key={s.slug} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    <select
                      className={selectClass}
                      value={form.budget}
                      onChange={updateField('budget')}
                    >
                      <option value="">Budget range (optional)</option>
                      {budgetRanges.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={updateField('subject')}
                  />
                  <textarea
                    className={`${inputClass} min-h-[160px] resize-y`}
                    placeholder="Tell us about the project — scope, location, timeline"
                    required
                    value={form.message}
                    onChange={updateField('message')}
                  />
                  <input
                    type="text"
                    name="_honey"
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
                    value={form._honey}
                    onChange={updateField('_honey')}
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn btn-accent self-start disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? 'Sending…' : <EditableText id="contact.form.submit" as="span">Request a Quote</EditableText>}
                  </button>
                  {status === 'error' && (
                    <p className="text-[0.85rem]" style={{ color: '#e07856' }}>
                      <EditableText id="contact.form.errorText" as="span">Something went wrong — try again, or email us directly at</EditableText>{' '}
                      <a className="text-accent-tint" href="mailto:diarsaglobal@gmail.com">
                        diarsaglobal@gmail.com
                      </a>
                      .
                    </p>
                  )}
                </>
              )}
            </motion.form>

            <motion.div id="office-info" data-nav-label="Office Info" variants={fadeUp} className="flex flex-col gap-6">
              <div className="bg-slate-2 border border-line-dark rounded-[8px] p-6">
                <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white-soft mb-4">
                  <EditableText id="contact.info.officeHeading" as="span">Head Office</EditableText>
                </h3>
                <p className="text-white text-[0.95rem] mb-1">
                  <EditableText id="contact.info.address1" as="span">7 Akpakpava Road (Ighomo House)</EditableText>
                </p>
                <p className="text-white-soft text-[0.9rem] mb-4">
                  <EditableText id="contact.info.address2" as="span">Benin City, Edo State</EditableText>
                </p>

                <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white-soft mb-3 mt-5">
                  <EditableText id="contact.info.phoneHeading" as="span">Phone</EditableText>
                </h3>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <a className="text-white text-[0.95rem] no-underline hover:text-accent-tint" href="tel:+2348036789325">
                    <EditableText id="footer.col2.phone1" as="span">+234 803 678 9325</EditableText>
                  </a>
                  <CopyButton value="+234 803 678 9325" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <a className="text-white text-[0.95rem] no-underline hover:text-accent-tint" href="tel:+2348073282827">
                    <EditableText id="footer.col2.phone2" as="span">+234 807 328 2827</EditableText>
                  </a>
                  <CopyButton value="+234 807 328 2827" />
                </div>

                <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white-soft mb-3 mt-5">
                  <EditableText id="contact.info.emailHeading" as="span">Email</EditableText>
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <a className="text-white text-[0.95rem] no-underline hover:text-accent-tint" href="mailto:diarsaglobal@gmail.com">
                    <EditableText id="footer.col2.email" as="span">diarsaglobal@gmail.com</EditableText>
                  </a>
                  <CopyButton value="diarsaglobal@gmail.com" />
                </div>

                <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white-soft mb-3 mt-5">
                  <EditableText id="contact.info.hoursHeading" as="span">Working Hours</EditableText>
                </h3>
                <p className="text-white-soft text-[0.9rem]">
                  <EditableText id="contact.info.hours" as="span">Monday – Friday, 08:00 – 16:00</EditableText>
                </p>
              </div>

              <div className="rounded-[8px] overflow-hidden border border-line-dark">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.4555846163457!2d5.622705374991306!3d6.3349812936546686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1040d375570d7401%3A0x62e291fc13d2f3a9!2s7%20Akpakpava%20Rd%2C%20Avbiama%2C%20Benin%20City%20300001%2C%20Edo!5e0!3m2!1sen!2sng!4v1713703216362!5m2!1sen!2sng"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Diarsa Global head office location"
                />
              </div>
            </motion.div>
          </motion.div>

          <MediaRegion name="contact.extra" className="mt-10" />
        </div>
      </section>
    </>
  );
}
