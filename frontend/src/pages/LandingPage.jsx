import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, Code2, Sparkles, Building2, BrainCircuit } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300">
    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">InterviewX</span>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-48 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-12">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Agentic AI Powered Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">
            Master your interview with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Personalized AI</span>
          </h1>
          
          <p className="mt-4 max-w-2xl text-lg text-gray-400 mx-auto mb-14 font-medium leading-relaxed">
            InterviewX orchestrates specialized AI agents to analyze your resume, conduct mock interviews, test your coding skills, and craft a roadmap guaranteed to get you hired.
          </p>
          
          <div className="flex justify-center gap-6">
            <Link to="/signup" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 text-lg flex items-center gap-3">
              Start Free Trial <BrainCircuit className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            { icon: FileText, title: 'Resume Analyzer', desc: 'ATS scoring & AI keyword mapping', color: 'text-blue-400' },
            { icon: Bot, title: 'Mock Interviews', desc: 'Real-time NLP voice & text sessions', color: 'text-indigo-400' },
            { icon: Code2, title: 'Monaco IDE', desc: 'Built-in environment with test cases', color: 'text-purple-400' },
            { icon: Sparkles, title: 'AI Roadmap', desc: 'Customized career path & goals', color: 'text-orange-400' },
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all group">
              <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feat.color}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
