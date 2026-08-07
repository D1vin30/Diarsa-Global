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
            <h4 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white mb-4">Diarsa Global</h4>
            <a className={footerLinkClass} href="/#services">Services</a>
            <a className={footerLinkClass} href="/#work">Projects</a>
            <a className={footerLinkClass} href="/about">About Us</a>
            <a className={footerLinkClass} href="/#contact">Contact</a>
          </div>
          <div>
            <h4 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white mb-4">Contact</h4>
            <a className={footerLinkClass} href="tel:+2348036789325">+234 803 678 9325</a>
            <a className={footerLinkClass} href="tel:+2348073282827">+234 807 328 2827</a>
            <a className={footerLinkClass} href="mailto:diarsaglobal@gmail.com">diarsaglobal@gmail.com</a>
          </div>
          <div>
            <h4 className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-white mb-4">Head Office</h4>
            <span className="block text-[0.9rem] mb-[0.55rem]">7 Akpakpava Road<br />(Ighomo House)</span>
            <span className="block text-[0.9rem] mb-[0.85rem]">Benin City, Edo State</span>
            <a
              className="inline-block text-[0.82rem] text-accent-tint hover:text-white no-underline"
              href="https://maps.google.com/?q=7+Akpakpava+Rd,+Avbiama,+Benin+City+300001,+Edo"
              target="_blank"
              rel="noreferrer"
            >
              Get directions →
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
          <span className="inline-flex items-center gap-2">© 2026 Diarsa Global Integrated Services Ltd. · Est. 2015 <span aria-hidden="true">🇳🇬</span></span>
          <span>Harnessing Engineering Intelligence to Deliver Innovative Solutions</span>
        </div>
      </div>
      <div className="relative overflow-hidden pointer-events-none mt-8 pt-[1.4rem] border-t border-line-dark">
        <div
          className="flex w-max font-display font-extrabold text-[15vw] leading-[0.9] text-white-soft tracking-[-0.02em] select-none animate-[bookend-scroll_64s_linear_infinite] motion-reduce:animate-none"
        >
          <span className="block whitespace-nowrap pr-[2.5em]">ENGINEERING INTELLIGENCE</span>
          <span className="block whitespace-nowrap pr-[2.5em]">ENGINEERING INTELLIGENCE</span>
        </div>
      </div>
    </footer>
  );
}
