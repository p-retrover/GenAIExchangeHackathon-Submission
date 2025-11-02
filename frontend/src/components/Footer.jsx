import { BrainCircuit, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* --- Brand & About --- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Satori</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your AI-powered career co-pilot — designed to help you learn smarter, grow faster,
            and stay ahead in your professional journey.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* --- Contact Details --- */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contact</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@satori.ai</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Bengaluru, India</li>
          </ul>
        </div>

        {/* --- Social / Feedback --- */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Connect With Us</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Have ideas or feedback? We’d love to hear from you.
          </p>
          <Link
            to="/feedback"
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition"
          >
            Share Feedback
          </Link>

          {/* --- Social Media Icons --- */}
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      {/* --- Bottom Section --- */}
      <div className="border-t border-border mt-10 py-6 text-center text-sm text-muted-foreground">
        © 2025 Satori. All rights reserved. | 
        <Link to="/privacy" className="ml-1 hover:text-primary transition-colors">Privacy Policy</Link> · 
        <Link to="/terms" className="ml-1 hover:text-primary transition-colors">Terms of Service</Link>
      </div>
    </footer>
  );
};

export default Footer;
