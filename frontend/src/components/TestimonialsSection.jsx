// ✅ Enhanced TestimonialsSection.jsx
// Combines your gradient-card style with GSAP parallax scroll animation.
// Changes are commented inline for clarity.

import React, { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = ({ id = "testimonials" }) => {
  const sectionRef = useRef(null);

  // 🌟 Added GSAP scroll-based animation for parallax effect
  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { y: 0 },
      {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at TCS",
      content:
        "Satori helped me transition from engineering to tech. The AI recommendations were spot-on and the skills roadmap guided me perfectly!",
      rating: 5,
      avatar: "PS",
    },
    {
      name: "Arjun Patel",
      role: "UX Designer at Flipkart",
      content:
        "The career insights and personalized recommendations opened my eyes to design thinking. Now I'm living my dream as a UX designer!",
      rating: 5,
      avatar: "AP",
    },
    {
      name: "Sneha Singh",
      role: "Data Scientist at Zomato",
      content:
        "From confusion to clarity! Satori showed me the exact path to become a data scientist. The resources were incredibly helpful.",
      rating: 5,
      avatar: "SS",
    },
  ];

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 bg-background text-foreground"
    >
      <div className="container mx-auto px-4">
        {/* 🟣 Updated heading tone to match your violet gradient brand */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our{" "}
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Learners Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thousands have built their careers with{" "}
            <span className="text-primary font-semibold">Satori</span> — here’s
            what they say.
          </p>
        </div>

        {/* 🟣 Your gradient cards + hover animation retained */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* ⭐ Rating */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-violet-400 text-violet-400"
                    />
                  ))}
                </div>

                {/* 💬 Testimonial Content */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                {/* 👤 Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* ✨ Subtle overlay to make the card feel dynamic */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
