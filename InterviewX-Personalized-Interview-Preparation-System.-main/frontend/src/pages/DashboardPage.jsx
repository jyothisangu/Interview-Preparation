import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Bell,
  ArrowRight,
  MoreVertical,
  MessageSquare,
  Target,
  Zap,
  TrendingUp,
  BrainCircuit,
  Code2,
  FileText
} from 'lucide-react';

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{"full_name": "Mohammed Rawhan Ramzi"}');

  const STATS = [
    { label: 'Interview Readiness', value: `${user.readiness_score || 0}%`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Coding Accuracy', value: '75%', icon: Code2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resume Score', value: user.resume_score ? `${user.resume_score}/100` : '0/100', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Practice Hours', value: '12.4', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 text-gray-900">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-3xl p-10 relative overflow-hidden shadow-2xl border-none">
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
              AI Powered Ecosystem
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            Welcome Back, <span className="text-yellow-300">{user.full_name || 'Innovator'}</span>! ✨
          </h1>
          <p className="text-indigo-100 max-w-lg font-medium opacity-90">Your agentic preparation journey is in full swing. Let's tackle your next interview session today.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/interview" className="px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-3">
              Start Mock Interview <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/skillforge" className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl shadow-lg hover:bg-white/20 transition-all flex items-center gap-3">
              Practice Skills <Zap className="w-5 h-5 text-yellow-300" />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full -ml-32 -mb-32 blur-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="ts-card flex flex-col gap-4 group hover:border-purple-200 transition-all cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-800 tracking-tighter">{stat.value}</p>
                <div className="p-1 bg-green-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Feed */}
        <div className="lg:col-span-2 ts-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Preparation Progress</h2>
            <select className="bg-gray-50 border-none text-[10px] font-bold uppercase tracking-widest text-gray-500 rounded-lg px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Data Structures & Algorithms', progress: 75, color: 'bg-indigo-500 shadow-indigo-500/20' },
              { name: 'System Design Patterns', progress: 45, color: 'bg-purple-500 shadow-purple-500/20' },
              { name: 'Company Specific Preparation', progress: 90, color: 'bg-emerald-500 shadow-emerald-500/20' },
            ].map(item => (
              <div key={item.name} className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-tight">
                  <span>{item.name}</span>
                  <span className="text-purple-600">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="ts-card bg-gradient-to-br from-gray-900 to-[#1e293b] text-white border-none shadow-2xl relative overflow-hidden">
           <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                   <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold">AI Insights</h2>
             </div>
             <div className="space-y-4">
                {[
                  'Refine your "Trie" implementation logic',
                  'Practice more behavioral questions for Google',
                  'Update your project section on resume',
                ].map((rec, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-4 items-start hover:bg-white/10 transition-colors">
                     <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                     <p className="text-[11px] font-medium leading-relaxed text-gray-300">{rec}</p>
                  </div>
                ))}
             </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
