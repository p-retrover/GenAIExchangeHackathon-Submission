import React, { useState } from 'react';
import CareerCompass from '../components/CareerCompass';
import { BrainCircuit, LogOut, UserCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardFooter from './DashboardFooter';
import { HoverEffectButton } from './ui/HoverEffectButton';
import { motion, AnimatePresence } from 'framer-motion';
import SlidingTabs from './ui/SlidingTabs';

const DashboardPage = (props) => {
  const { user, handleLogout, isProfileComplete } = props;
  const [showProfileIncompleteNotification, setShowProfileIncompleteNotification] = useState(!isProfileComplete);

  const tabs = [
    { name: "Overview", content: <div>Overview Content</div> },
    { name: "Career Compass", content: <CareerCompass {...props} /> },
    { name: "Mentor", content: <div>Mentor Content</div> },
    { name: "Settings", content: <div>Settings Content</div> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2"><BrainCircuit className="text-primary w-7 h-7" /><h1 className="text-xl font-bold text-foreground">Project Satori</h1></div>
            <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                    <UserCircle className="w-6 h-6" />
                    <span className="hidden sm:block">Welcome, {(user && user.full_name) || 'Explorer'}!</span>
                </Link>
                <HoverEffectButton onClick={handleLogout} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><LogOut className="w-5 h-5" /><span className="hidden sm:block">Logout</span></HoverEffectButton>
            </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8 flex-grow">
        <AnimatePresence>
        {showProfileIncompleteNotification && !isProfileComplete && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, type: "spring", damping: 10, stiffness: 100 }}
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 relative" role="alert"
            >
                <p className="font-bold">Profile Incomplete!</p>
                <p>Please complete your profile to get personalized recommendations.</p>
                <div className="mt-4 flex space-x-4">
                    <Link to="/profile" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">Complete Profile</Link>
                    <HoverEffectButton onClick={() => setShowProfileIncompleteNotification(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Later</HoverEffectButton>
                </div>
                <button onClick={() => setShowProfileIncompleteNotification(false)} className="absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900">
                    <X className="h-5 w-5" />
                </button>
            </motion.div>
        )}
        </AnimatePresence>
        <SlidingTabs tabs={tabs}>
          {(activeTab) => {
            const currentTab = tabs.find((tab) => tab.name === activeTab);
            return currentTab ? currentTab.content : null;
          }}
        </SlidingTabs>
      </main>
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;