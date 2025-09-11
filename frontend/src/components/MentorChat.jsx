import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../services/api';
import { Send } from 'lucide-react';

const MentorChat = ({ roadmapContext }) => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: `Hi! I'm Satori. Ask me anything about your roadmap for becoming a ${roadmapContext.role_title}.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/mentor/chat', {
                user_input: input,
                roadmap_context: roadmapContext
            });
            
            const aiMessage = { sender: 'ai', text: response.data.data.reply };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Failed to get response from mentor:", error);
            const errorMessage = { sender: 'ai', text: "I'm sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col h-[70vh]">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start"><div className="max-w-lg px-4 py-2 rounded-xl bg-slate-700 text-slate-200"><p className="animate-pulse">Satori is thinking...</p></div></div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a specific week or resource..." className="w-full bg-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white" disabled={isLoading} />
                <button type="submit" className="p-3 bg-violet-600 rounded-lg hover:bg-violet-700 disabled:bg-slate-600" disabled={isLoading}><Send className="w-5 h-5 text-white"/></button>
            </form>
        </div>
    );
};

export default MentorChat;