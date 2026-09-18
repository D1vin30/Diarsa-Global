import EditableText from '@media/EditableText';

export default function Footer() {
  const footerLinkClass = "block text-white-soft no-underline text-[0.9rem] mb-[0.55rem] hover:text-white";
  return (
    <footer className="bg-slate text-white-soft px-6 pt-14 pb-[1.6rem] relative overflow-hidden" data-nav-theme="dark">
      <div className="max-w-[1180px] mx-auto relative z-[2]">
        <div className="flex flex-wrap gap-[2.4rem] justify-between pb-[2.6rem] border-b border-line-dark">
          <div>
            <div className="logo-frame mb-5">
              <img
                src="/dgis-logo-mark.png"
                alt="Diarsa Global Integrated Services Ltd."
                className="h-[46px] w-auto"
              />
            </div>
            <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white mb-4">
              <EditableText id="footer.col1.heading" as="span">Diarsa Global</EditableText>
            </h3>
            <a className={footerLinkClass} href="/#services"><EditableText id="footer.col1.link1" as="span">Services</EditableText></a>
            <a className={footerLinkClass} href="/#work"><EditableText id="footer.col1.link2" as="span">Projects</EditableText></a>
            <a className={footerLinkClass} href="/about"><EditableText id="footer.col1.link3" as="span">About Us</EditableText></a>
            <a className={footerLinkClass} href="/contact"><EditableText id="footer.col1.link4" as="span">Contact</EditableText></a>
          </div>
          <div>
            <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white mb-4">
              <EditableText id="footer.col2.heading" as="span">Contact</EditableText>
            </h3>
            <a className={footerLinkClass} href="tel:+2348036789325"><EditableText id="footer.col2.phone1" as="span">+234 803 678 9325</EditableText></a>
            <a className={footerLinkClass} href="tel:+2348073282827"><EditableText id="footer.col2.phone2" as="span">+234 807 328 2827</EditableText></a>
            <a className={footerLinkClass} href="mailto:diarsaglobal@gmail.com"><EditableText id="footer.col2.email" as="span">diarsaglobal@gmail.com</EditableText></a>
          </div>
          <div>
            <h3 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white mb-4">
              <EditableText id="footer.col3.heading" as="span">Head Office</EditableText>
            </h3>
            <span className="block text-[0.9rem] mb-[0.55rem]">
              <EditableText id="footer.col3.address1a" as="span">7 Akpakpava Road</EditableText><br />
              <EditableText id="footer.col3.address1b" as="span">(Ighomo House)</EditableText>
            </span>
            <span className="block text-[0.9rem] mb-[0.85rem]"><EditableText id="footer.col3.address2" as="span">Benin City, Edo State</EditableText></span>
            <a
              className="inline-block text-[0.82rem] text-accent-tint hover:text-white no-underline"
              href="https://maps.google.com/?q=7+Akpakpava+Rd,+Avbiama,+Benin+City+300001,+Edo"
              target="_blank"
              rel="noreferrer"
            >
              <EditableText id="footer.col3.directions" as="span">Get directions</EditableText> →
            </a>
          </div>
        </div>
        <div className="rounded-[4px] overflow-hidden border border-line-dark mt-6">
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
        <div className="flex justify-between items-center pt-6 flex-wrap gap-[0.8rem] text-[0.8rem]">
          <span className="inline-flex items-center gap-2">
            <EditableText id="footer.copyright" as="span">© 2026 Diarsa Global Integrated Services Ltd. · Est. 2015</EditableText>
            <svg
              aria-label="Nigeria"
              role="img"
              width="18"
              height="12"
              viewBox="0 0 6 4"
              className="rounded-[2px] shrink-0 ring-1 ring-white/15"
            >
              <rect width="2" height="4" fill="#008751" />
              <rect x="2" width="2" height="4" fill="#ffffff" />
              <rect x="4" width="2" height="4" fill="#008751" />
            </svg>
          </span>
          <span><EditableText id="footer.tagline" as="span">Harnessing Engineering Intelligence to Deliver Innovative Solutions</EditableText></span>
        </div>
      </div>
      <div className="relative overflow-hidden pointer-events-none mt-8 pt-[1.4rem] border-t border-line-dark">
        <div
          className="flex w-max font-display font-extrabold text-[15vw] leading-[0.9] text-white-soft tracking-[-0.02em] select-none animate-[bookend-scroll_64s_linear_infinite] motion-reduce:animate-none"
        >
          <span className="block whitespace-nowrap pr-[2.5em]"><EditableText id="footer.marquee" as="span">ENGINEERING INTELLIGENCE</EditableText></span>
          <span className="block whitespace-nowrap pr-[2.5em]" aria-hidden="true">ENGINEERING INTELLIGENCE</span>
        </div>
      </div>
    </footer>
  );
}
