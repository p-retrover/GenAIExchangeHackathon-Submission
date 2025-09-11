import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginRegister from './components/LoginRegister';
import MentorPage from './components/MentorPage';
import { authService } from './services/authService';
import { apiClient } from './services/api';

function App() {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    const [assessment, setAssessment] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const validateSession = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            if (!currentUser) setToken(null);
            setAuthLoading(false);
        };
        validateSession();
    }, [token]);

    useEffect(() => {
        if (user && !assessment) {
            const fetchLatestAssessment = async () => {
                try {
                    const response = await apiClient.get('/assessments/latest');
                    setAssessment(response.data);
                } catch (err) {
                    setError('Failed to load assessment.');
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
    };

    if (authLoading) {
        return <div className="min-h-screen bg-slate-900" />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!token ? <LoginRegister setToken={setToken} /> : <Navigate to="/dashboard" />} />
                <Route 
                    path="/dashboard" 
                    element={
                        token ? 
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
                        /> 
                        : <Navigate to="/login" />
                    } 
                />
                <Route path="/mentor" element={token ? <MentorPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;