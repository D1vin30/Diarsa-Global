import { Link } from 'react-router-dom';

export default function MaintenancePage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-slate text-center px-6" data-nav-theme="dark">
      <div className="max-w-[52ch]">
        <span className="inline-block font-sans font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-accent-tint mb-[0.8rem]">
          Under Maintenance
        </span>
        <h1 className="text-white text-[2rem] mb-[1rem]">
          This page is being updated
        </h1>
        <p className="text-white-soft text-[1rem] leading-[1.6] mb-[1.8rem]">
          We're refreshing our services pages right now. Check back shortly, or get in touch directly and we'll help right away.
        </p>
        <Link to="/contact" className="btn btn-accent">
          Contact Us
        </Link>
      </div>
    </section>
  );
}
