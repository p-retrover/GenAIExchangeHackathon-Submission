import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StickyNavbar } from './ui/StickyNavbar';
import { ScrollActiveLink } from './ui/ScrollActiveLink';

const Header = ({ user, setShowLoginRegisterModal }) => {
  return (
    <StickyNavbar>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Satori</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <ScrollActiveLink href="#home"> {/* Changed to #home */}
            About
          </ScrollActiveLink>
          <ScrollActiveLink href="#features">
            Features
          </ScrollActiveLink>
          <ScrollActiveLink href="#testimonials">
            Testimonials
          </ScrollActiveLink>
        </nav>
        {user ? (
          <Link
            to="/profile"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Profile
          </Link>
        ) : (
          <button
            onClick={() => setShowLoginRegisterModal(true)}
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Sign In
          </button>
        )}
      </div>
    </StickyNavbar>
  );
};

export default Header;
