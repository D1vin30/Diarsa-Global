import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Services from './components/Services';
import About from './components/About';
import Industries from './components/Industries';
import FeaturedWork from './components/FeaturedWork';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import LandingConceptCivicSignal from './components/LandingConceptCivicSignal';

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <About />
      <FeaturedWork />
      <Services />
      <Industries />
      <CtaBand />
    </>
  );
}

function App() {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isConcept = location.pathname.startsWith('/concept');

  if (isConcept) {
    return (
      <>
        <Header />
        <Routes location={location}>
          <Route path="/concept/civic-signal" element={<LandingConceptCivicSignal />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
