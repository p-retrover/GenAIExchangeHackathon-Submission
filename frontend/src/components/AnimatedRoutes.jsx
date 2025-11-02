import React from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import Profile from './Profile';
import MentorPage from './MentorPage';

const AnimatedRoutes = ({ token, user, setShowLoginRegisterModal, isProfileComplete, handleLogout, assessment, recommendations, roadmap, setRoadmap, isSubmitting, error, handleSubmit }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <motion.div
                        className="bg-slate-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {!token ? <LandingPage user={user} setShowLoginRegisterModal={setShowLoginRegisterModal} /> : <Navigate to="/dashboard" />}
                    </motion.div>
                } />
                <Route path="/profile" element={
                    <motion.div
                        className="bg-slate-900"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {token ? <Profile /> : <Navigate to="/" />}
                    </motion.div>
                } />
                <Route 
                    path="/dashboard" 
                    element={
                        <motion.div
                            className="bg-slate-900"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -100 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            {token ? 
                            <Dashboard 
                                user={user} 
                                handleLogout={handleLogout}
                                assessment={assessment}
                                recommendations={recommendations}
                                roadmap={roadmap}
                                setRoadmap={setRoadmap}
                                isSubmitting={isSubmitting}
                                error={error}
                                handleSubmit={handleSubmit}
                                isProfileComplete={isProfileComplete}
                            /> 
                            : <Navigate to="/" />}
                        </motion.div>
                    } 
                />
                <Route path="/mentor" element={
                    <motion.div
                        className="bg-slate-900"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {token ? <MentorPage /> : <Navigate to="/" />}
                    </motion.div>
                } />
                <Route path="*" element={<Navigate to={token ? (isProfileComplete ? "/dashboard" : "/profile") : "/"} />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
