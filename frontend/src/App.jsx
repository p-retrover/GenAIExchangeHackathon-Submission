import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import OnboardingFlow from './components/OnboardingFlow';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';
import { authService } from './services/authService';
import { apiClient } from './services/api';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);
    
    const [assessment, setAssessment] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const validateSession = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            // For demonstration, assume profile is incomplete if user exists but no assessment
            // In a real app, this would be a specific user profile check
            if (currentUser && !assessment) {
                setIsProfileComplete(false);
            } // Removed: else if (currentUser && assessment) { setIsProfileComplete(true); }
            if (!currentUser) setToken(null);
            setAuthLoading(false);
        };
        validateSession();
    }, [token, assessment]); // Added assessment to dependency array

    useEffect(() => {
        if (user && !assessment) {
            const fetchLatestAssessment = async () => {
                try {
                    const response = await apiClient.get('/assessments/latest');
                    setAssessment(response.data);
                    // If assessment exists, profile is considered complete
                    // Temporarily commented out to ensure OnboardingFlow is always shown for demonstration
                    // if (response.data) setIsProfileComplete(true);
                } catch (err) {
                    // If no assessment, profile is incomplete
                    if (err.response && err.response.status === 404) {
                        setIsProfileComplete(false);
                    } else {
                        setError('Failed to load assessment.');
                    }
                }
            };
            fetchLatestAssessment();
        }
    }, [user, assessment]);

    const handleSubmit = async (answers) => {
        // --- THIS IS THE FIX ---
        if (!assessment || !assessment.id) {
            setError("Cannot submit: Assessment data is not loaded. Please refresh.");
            return;
        }
        // --- END OF FIX ---

        setIsSubmitting(true);
        setError(null);
        try {
            const answersPayload = { answers: Object.entries(answers).map(([qid, cid]) => ({ question_id: parseInt(qid), choice_id: cid })) };
            await apiClient.post(`/assessments/${assessment.id}/submit`, answersPayload);
            const recsResponse = await apiClient.post('/ai/recommendations');
            setRecommendations(recsResponse.data.data.roles || []);
        } catch (err) {
            setError("An error occurred fetching recommendations.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleLogout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
        setIsProfileComplete(false); // Reset profile complete status on logout
    };

    if (authLoading) {
        return <div className="min-h-screen bg-slate-900" />;
    }

    return (
        <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes 
                token={token}
                user={user}
                setShowLoginRegisterModal={setShowLoginRegisterModal}
                isProfileComplete={isProfileComplete}
                handleLogout={handleLogout}
                assessment={assessment}
                recommendations={recommendations}
                roadmap={roadmap}
                setRoadmap={setRoadmap}
                isSubmitting={isSubmitting}
                error={error}
                handleSubmit={handleSubmit}
            />

            <AnimatePresence>
      {showLoginRegisterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center 
                     bg-gradient-to-br from-[#0a0014]/80 via-[#120025]/70 to-[#1a0030]/80 
                     backdrop-blur-2xl overflow-hidden"
        >
          {/* glowing animated background layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#8b5cf6,transparent_60%),radial-gradient(circle_at_80%_70%,#c084fc,transparent_60%)] blur-3xl"
          />

          {/* modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white/10 border border-violet-400/30 
                       shadow-[0_0_20px_rgba(168,85,247,0.4)] 
                       backdrop-blur-2xl p-8 rounded-3xl max-w-md w-full mx-4
                       text-white font-sans"
          >
            {/* close button */}
            <button
              onClick={() => setShowLoginRegisterModal(false)}
              className="absolute top-4 right-4 text-violet-300 hover:text-violet-100 
                         transition-transform hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>

            {/* neon header */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 , ease:"easeIn" }}
              className="text-center text-2xl font-semibold mb-6 
                         bg-gradient-to-r from-violet-300 via-fuchsia-400 to-violet-200 
                         bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_8px_rgba(139,92,246,0.6) text-violet text-center animate-pulse mt-2]"
            >
            Empowering your next move
            </motion.h2>

            {/* login/register content */}
            <LoginRegister
              setToken={setToken}
              onClose={() => setShowLoginRegisterModal(false)}
            />

            {/* bottom glow accent */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-40 
                            bg-violet-500/30 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

            {token && !isProfileComplete && (
                <OnboardingFlow onComplete={() => setIsProfileComplete(true)} />
            )}
        </BrowserRouter>
    );
}

export default App;