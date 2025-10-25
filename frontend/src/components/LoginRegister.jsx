import React, { useState } from 'react';
import axios from 'axios';
import { apiClient } from '../services/api';
import { User, Lock, BrainCircuit } from 'lucide-react';

const LoginRegister = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLogin) {
                const params = new URLSearchParams();
                params.append('username', email);
                params.append('password', password);
                const response = await axios.post('/api/v1/auth/login', params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                const accessToken = response.data.access_token;
                localStorage.setItem('authToken', accessToken);
                setToken(accessToken);
            } else {
                await apiClient.post('/users/', { email, password });
                setIsLogin(true);
                setEmail('');
                setPassword('');
                alert('Registration successful! Please log in.');
            }
        } catch (err) {
            const errorMessage = (err.response?.data?.detail) || err.message || 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center font-sans p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <BrainCircuit className="mx-auto h-12 w-12 text-violet-400" />
                    <h1 className="text-4xl font-bold text-white mt-4">Project Satori</h1>
                    <p className="text-slate-400 mt-2">Your AI-Powered Career Co-Pilot</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-2xl shadow-xl">
                    <div className="flex border-b border-slate-700 mb-6">
                        <button onClick={() => { setIsLogin(true); setError(''); }} className={`w-1/2 py-3 font-semibold text-center transition-colors duration-300 ${isLogin ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-white'}`}>Login</button>
                        <button onClick={() => { setIsLogin(false); setError(''); }} className={`w-1/2 py-3 font-semibold text-center transition-colors duration-300 ${!isLogin ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-white'}`}>Register</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
                        <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500" /></div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition">{isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;