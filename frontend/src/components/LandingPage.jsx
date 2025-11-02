import Header from "./Header";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "./Footer";

const LandingPage = ({ user, setShowLoginRegisterModal }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header user={user} setShowLoginRegisterModal={setShowLoginRegisterModal} />
      <HeroSection setShowLoginRegisterModal={setShowLoginRegisterModal} id="home" />
      <FeaturesSection id="features" />
      <TestimonialsSection id="testimonials" />
      <Footer />
    </div>
  );
};

export default LandingPage;
