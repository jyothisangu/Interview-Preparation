import React, { useState } from 'react';
import axios from 'axios';
import { Map, Loader2, CheckCircle, ChevronDown, ChevronUp, Flag, Clock, BookOpen, Target } from 'lucide-react';

const ROLES = ['SDE', 'ML Engineer', 'PM', 'Data Analyst', 'DevOps'];

const RoadmapPage = () => {
  const [role, setRole] = useState('SDE');
  const [weeks, setWeeks] = useState(4);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});

  const generate = async () => {
    setLoading(true);
    setCompleted({});
    setExpandedWeeks({ 0: true }); // Expand first week by default
    try {
      const res = await axios.post('http://localhost:8000/api/roadmap', { role, duration_weeks: weeks });
      setRoadmap(res.data);
    } catch {
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (weekIdx, taskIdx) => {
    const key = `${weekIdx}-${taskIdx}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWeek = (weekIdx) => {
    setExpandedWeeks(prev => ({ ...prev, [weekIdx]: !prev[weekIdx] }));
  };

  const totalTasks = roadmap?.plan.reduce((a, w) => a + w.tasks.length, 0) || 0;
  const doneTasks = Object.values(completed).filter(Boolean).length;
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personalized Roadmap</h1>
          <p className="mt-1 text-gray-500 font-medium italic">Detailed week-by-week preparation plan with daily milestones.</p>
        </div>
        {roadmap && (
          <div className="ts-card flex items-center gap-6 py-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-gray-100" />
                <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-purple-600" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - pct / 100)} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-gray-900">{pct}%</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completion</p>
              <p className="text-xl font-black text-purple-600 leading-none">{doneTasks} / {totalTasks}</p>
              <p className="text-[10px] font-bold text-gray-500 mt-1">Tasks finished</p>
            </div>
          </div>
        )}
      </div>

      <div className="ts-card flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Target Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="ts-input font-bold"
          >
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="w-40">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Duration</label>
          <div className="ts-input flex items-center gap-3">
            <input 
              type="number" 
              min={1} 
              max={12} 
              value={weeks} 
              onChange={(e) => setWeeks(parseInt(e.target.value))} 
              className="w-full bg-transparent text-gray-900 font-black text-center outline-none" 
            />
            <span className="text-xs font-bold text-gray-400 uppercase">Wks</span>
          </div>
        </div>
        <button 
          onClick={generate} 
          disabled={loading} 
          className="ts-btn-primary flex items-center gap-3 px-10 py-4 shadow-xl shadow-purple-600/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
          {loading ? 'Building Path...' : 'Generate Roadmap'}
        </button>
      </div>

      {roadmap && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
          {roadmap.plan.map((week, wi) => (
            <div key={wi} className="ts-card p-0 overflow-hidden group">
              <button 
                onClick={() => toggleWeek(wi)}
                className="w-full flex items-center justify-between p-8 hover:bg-gray-50 transition-all text-left"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-white shadow-lg shadow-purple-600/30">
                    <span className="text-[10px] font-black uppercase opacity-70">Week</span>
                    <span className="text-2xl font-black">{week.week}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{week.focus}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-purple-600 font-bold text-sm flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {week.tasks.length} Daily Tasks</p>
                      <p className="text-gray-400 font-bold text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5-8 Hours Needed</p>
                    </div>
                  </div>
                </div>
                {expandedWeeks[wi] ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
              </button>

              {expandedWeeks[wi] && (
                <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-px bg-gray-100 w-full mb-8" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {week.tasks.map((task, ti) => {
                      const key = `${wi}-${ti}`;
                      return (
                        <div 
                          key={ti} 
                          onClick={() => toggleTask(wi, ti)}
                          className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                            completed[key] 
                            ? 'bg-green-50 border-green-500/30 shadow-inner' 
                            : 'bg-gray-50 border-transparent hover:border-purple-400'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${completed[key] ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                              {completed[key] && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{task.day}</span>
                              </div>
                              <h4 className={`text-lg font-bold leading-tight ${completed[key] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {task.title}
                              </h4>
                              <p className={`mt-2 text-sm leading-relaxed ${completed[key] ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
                                {task.desc}
                              </p>
                              {task.milestone && (
                                <div className={`mt-4 flex items-center gap-2 p-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${completed[key] ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                  <Flag className="w-3 h-3" /> Milestone: {task.milestone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
