import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import SkeletonCard from './SkeletonCard';
import { ChevronDown, Code, BarChart3, Palette, BrainCircuit, Video, BookOpen, FileCode2 } from 'lucide-react';

const CareerCompass = ({ assessment, recommendations, roadmap, setRoadmap, isSubmitting, error, handleSubmit }) => {
    const [answers, setAnswers] = useState({});
    const [loadingRoadmapFor, setLoadingRoadmapFor] = useState(null);
    const [openWeek, setOpenWeek] = useState(1);

    const handleAnswerChange = (questionId, choiceId) => {
        setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
    };
    
    const handleGetRoadmap = async (roleTitle) => {
        setLoadingRoadmapFor(roleTitle);
        try {
            const roadmapResponse = await apiClient.post('/ai/roadmaps', { role_title: roleTitle });
            setRoadmap(roadmapResponse.data.data);
        } catch (err) {
            // Future improvement: pass setError prop down as well
        } finally {
            setLoadingRoadmapFor(null);
        }
    };
    
    const getIconForCareer = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('developer') || lowerTitle.includes('engineer')) return <Code className="w-8 h-8 text-violet-400" />;
        if (lowerTitle.includes('analyst')) return <BarChart3 className="w-8 h-8 text-violet-400" />;
        if (lowerTitle.includes('designer')) return <Palette className="w-8 h-8 text-violet-400" />;
        return <BrainCircuit className="w-8 h-8 text-violet-400" />;
    };
  
    const getResourceIcon = (type) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('video')) return <Video className="w-4 h-4 mr-2 text-sky-400 flex-shrink-0" />;
        if (lowerType.includes('article')) return <BookOpen className="w-4 h-4 mr-2 text-sky-400 flex-shrink-0" />;
        if (lowerType.includes('documentation')) return <FileCode2 className="w-4 h-4 mr-2 text-sky-400 flex-shrink-0" />;
        if (lowerType.includes('project')) return <Code className="w-4 h-4 mr-2 text-sky-400 flex-shrink-0" />;
        return <Link className="w-4 h-4 mr-2 text-sky-400 flex-shrink-0" />;
    };

    if (!assessment && !recommendations) {
        return <div className="text-center p-8 bg-slate-800 rounded-2xl"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-violet-400 mx-auto"></div><p className="mt-4 text-slate-400">Loading Your Compass...</p></div>;
    }

    if (isSubmitting) {
        return (
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-violet-400 mb-2">Analyzing Your Profile</h2>
                <p className="text-slate-400 mb-8 max-w-2xl">Our AI is crafting your personalized recommendations...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
            </div>
        );
    }

    if (roadmap) {
        return (
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <button onClick={() => setRoadmap(null)} className="mb-6 text-violet-400 hover:text-violet-300">← Back to Recommendations</button>
                <h2 className="text-3xl font-bold text-violet-400 mb-2">Roadmap: {roadmap.role_title}</h2>
                <p className="text-slate-400 mb-6">{roadmap.overview}</p>
                <div className="space-y-2 overflow-y-auto pr-2 h-[calc(70vh - 160px)]">
                    {roadmap.weekly_plan.map(week => (
                        <div key={week.week} className="bg-slate-900/50 rounded-lg border border-slate-700">
                            <button onClick={() => setOpenWeek(openWeek === week.week ? null : week.week)} className="w-full flex justify-between items-center text-left p-4">
                                <h3 className="text-xl font-bold text-white">Week {week.week}: {week.theme}</h3>
                                <ChevronDown className={`w-6 h-6 text-violet-400 transition-transform duration-300 ${openWeek === week.week ? 'rotate-180' : ''}`} />
                            </button>
                            {openWeek === week.week && (
                                <div className="px-4 pb-4">
                                    <h4 className="font-semibold text-slate-200">Objectives:</h4>
                                    <ul className="list-disc list-inside mt-2 text-slate-300 space-y-2">{(week.objectives || []).map((task, index) => <li key={index}>{task}</li>)}</ul>
                                    {week.resources && week.resources.length > 0 && <><h4 className="font-semibold text-slate-200 mt-4">Resources:</h4><ul className="mt-2 space-y-2">{(week.resources || []).map((resource, index) => (<li key={index}><a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sky-400 hover:text-sky-300 hover:underline transition-colors">{getResourceIcon(resource.type)}<span>{resource.title}</span></a></li>))}</ul></>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link to="/mentor" state={{ roadmapContext: roadmap }} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"><BrainCircuit className="w-5 h-5 mr-2" />Ask Mentor About This Roadmap</Link>
                </div>
            </div>
        );
    }

    if (recommendations) {
        return (
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-violet-400 mb-4">Your AI-Powered Recommendations</h2>
                <p className="text-slate-400 mb-8">Based on your answers, here are a few paths that might be a great fit.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                        <div key={rec.title} className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-900/50">
                            <div>
                                <div className="flex items-center space-x-4 mb-4">{getIconForCareer(rec.title)}<h3 className="text-xl font-bold text-white">{rec.title}</h3></div>
                                <p className="text-slate-400 mt-2 text-sm">{rec.fit_reason}</p>
                                <h4 className="font-semibold text-slate-200 mt-4">Pros:</h4><ul className="list-disc list-inside text-slate-400 text-sm space-y-1 mt-1">{rec.pros.map((pro, i) => <li key={i}>{pro}</li>)}</ul>
                                <h4 className="font-semibold text-slate-200 mt-4">Cons:</h4><ul className="list-disc list-inside text-slate-400 text-sm space-y-1 mt-1">{rec.cons.map((con, i) => <li key={i}>{con}</li>)}</ul>
                            </div>
                            <button onClick={() => handleGetRoadmap(rec.title)} disabled={loadingRoadmapFor !== null} className="mt-6 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50">{loadingRoadmapFor === rec.title ? 'Generating...' : 'Get Roadmap'}</button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link to="/mentor" state={{ roadmapContext: { role_title: 'your career options' } }} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"><BrainCircuit className="w-5 h-5 mr-2" />Chat with AI Mentor</Link>
                </div>
            </div>
        );
    }

    // Default view: Questionnaire
    return (
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-3xl font-bold text-violet-400 mb-2">{assessment?.title || 'Career Compass'}</h2>
            <p className="text-slate-400 mb-8 max-w-2xl">{assessment?.description || 'Answer these questions to find your path.'}</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(answers);
            }}>
                <div className="space-y-8">
                    {(assessment?.questions || []).map((question, index) => (
                        <div key={question.id} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                            <p className="font-semibold text-lg text-slate-200 mb-4"><span className="text-violet-400 mr-2">Q{index + 1}.</span>{question.text}</p>
                            <div className="space-y-3 pl-6">{question.choices.map(choice => (<label key={choice.id} className="flex items-center space-x-3 cursor-pointer text-slate-300 hover:text-white transition-colors"><input type="radio" name={`question-${question.id}`} value={choice.id} checked={answers[question.id] === choice.id} onChange={() => handleAnswerChange(question.id, choice.id)} className="w-4 h-4 text-violet-600 bg-slate-700 border-slate-600 focus:ring-violet-500 ring-offset-slate-800 focus:ring-2" /><span>{choice.text}</span></label>))}</div>
                        </div>
                    ))}
                </div>
                {error && <p className="text-red-400 text-center mt-6">{error}</p>}
                <div className="mt-8 text-center"><button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">Submit & Discover Your Path</button></div>
            </form>
        </div>
    );
};

export default CareerCompass;