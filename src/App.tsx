import Nav from './components/Nav';
import SmoothScroll from './components/SmoothScroll';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import About from './components/About';
import CoreExecution from './components/CoreExecution';
import Projects from './components/Projects';
import Philosophy from './components/Philosophy';
import Experience from './components/Experience';
import ArchitecturePlayground from './components/ArchitecturePlayground';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="grain relative min-h-screen bg-ink text-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Nav />
      <main id="main">
        <Hero />
        <TechMarquee />
        <About />
        <CoreExecution />
        <Projects />
        <Philosophy />
        <Experience />
        <ArchitecturePlayground />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}