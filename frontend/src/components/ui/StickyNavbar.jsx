import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function StickyNavbar({ children, threshold = 80 }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 w-full z-50 px-6 py-3 
          transition-all duration-500 backdrop-blur-lg will-change-[background-color,backdrop-filter]
          ${isSticky
            ? "bg-card/70 border-b border-border/60 shadow-[0_6px_30px_-10px_rgba(139,92,246,0.35)]"
            : "bg-background/60 border-b border-transparent"
          }`}
        
      >
        {children}
      </motion.nav>
    </AnimatePresence>
  );
}
