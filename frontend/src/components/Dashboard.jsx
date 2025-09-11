import React from 'react';
import CareerCompass from '../components/CareerCompass';
import { BrainCircuit, LogOut } from 'lucide-react';

const DashboardPage = (props) => {
  const { user, handleLogout } = props;


  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2"><BrainCircuit className="text-violet-400 w-7 h-7" /><h1 className="text-xl font-bold text-white">Project Satori</h1></div>
            <div className="flex items-center space-x-4">
                <span className="text-slate-300 hidden sm:block">Welcome, {(user && user.full_name) || 'Explorer'}!</span>
                <button onClick={handleLogout} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><LogOut className="w-5 h-5" /><span className="hidden sm:block">Logout</span></button>
            </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <CareerCompass {...props} />
      </main>
    </div>
  );
};

export default DashboardPage;