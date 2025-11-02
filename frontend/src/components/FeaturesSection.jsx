import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bot, Compass, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    gsap.to(sectionRef.current, {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  const features = [
    {
      icon: BarChart,
      title: "Personalized Assessments",
      description:
        "Understand your strengths, weaknesses, and interests through comprehensive assessments powered by analytics.",
      color: "bg-primary",
      href: "/assessments",
    },
    {
      icon: Bot,
      title: "AI-Powered Recommendations",
      description:
        "Leverage cutting-edge AI to get personalized career and skill path suggestions tailored to your goals.",
      color: "bg-accent",
      href: "/recommendations",
    },
    {
      icon: Compass,
      title: "Explore Career Paths",
      description:
        "Discover diverse career options, understand requirements, and navigate toward the right one for you.",
      color: "bg-secondary",
      href: "/explore",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empower your career journey with intelligent tools, AI insights, and guided learning paths.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <CardHeader>
                  <div
                    className={`inline-flex w-12 h-12 rounded-lg ${feature.color} items-center justify-center mb-4`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto text-primary hover:text-primary/80"
                    asChild
                  >
                    <Link to={feature.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" asChild>
            <Link to="/profile">
              Start Your Career Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
