import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MentorChat from './MentorChat';
import { BrainCircuit } from 'lucide-react';

const MentorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const roadmapContext = location.state?.roadmapContext || { role_title: 'your career' };

    // --- THIS IS THE DEBUGGING STEP ---
    useEffect(() => {
        console.log("Roadmap context received on Mentor Page:", roadmapContext);
    }, [roadmapContext]);
    // --- END OF DEBUGGING STEP ---

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <header className="bg-card shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <BrainCircuit className="text-primary w-7 h-7" />
                        <h1 className="text-xl font-bold text-foreground">Satori AI Mentor</h1>
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg"
                    >
                        ← Back
                    </button>
                </nav>
            </header>
            <main className="container mx-auto px-6 py-8 flex justify-center">
                <div className="w-full max-w-3xl">
                    <MentorChat roadmapContext={roadmapContext} />
                </div>
            </main>
        </div>
    );
};

export default MentorPage;