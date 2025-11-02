import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HoverEffectButton } from './ui/HoverEffectButton';
import GradientText from './ui/GradientText';
import Orb from './Orb'; // Import Orb component

const HeroSection = ({ setShowLoginRegisterModal, id }) => {
  const paragraphRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      paragraphRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <section id={id} className="relative h-[100vh] min-h-[400px] w-full flex items-center justify-center bg-background text-foreground pt-16">
      <div className="absolute inset-0 z-10"> {/* Orb container */}
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <div className="absolute inset-0 bg-grid-slate-900/[0.04]" /> {/* Grid background */}
      <div className="relative z-20 container mx-auto text-center space-y-6"> {/* Content with higher z-index */}
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          className="text-4xl font-extrabold tracking-tight md:text-6xl"
        >
          Unlock Your Potential <br />Illuminate Your Path
        </GradientText>
        <p ref={paragraphRef} className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          Satori is your AI-powered guide to self-discovery and career fulfillment. Explore your interests, identify your skills, and chart a course to a more meaningful professional life.
        </p>
        <div>
          <HoverEffectButton
            onClick={() => setShowLoginRegisterModal(true)}
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </HoverEffectButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
