import React, { useEffect, useState } from "react";

export function ScrollActiveLink({ href, children }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = document.querySelector(href);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.6 }
    );

    observer.observe(section);
    return () => observer.unobserve(section);
  }, [href]);

  return (
    <a
      href={href}
      className={`relative text-sm font-medium transition-all duration-300 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <span
        className={`absolute left-0 bottom-[-4px] h-[2px] bg-primary transition-all duration-300 ${
          active ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </a>
  );
}
