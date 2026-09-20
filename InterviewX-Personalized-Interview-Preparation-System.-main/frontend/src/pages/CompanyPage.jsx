import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Loader2, Lightbulb, Code2, Users, MapPin, Calendar, Globe, Briefcase, ExternalLink, Play, Target } from 'lucide-react';

const COMPANIES = ['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys', 'Wipro', 'Meta', 'Netflix'];

const CompanyPage = () => {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPrep = async (company) => {
    setSelected(company);
    setLoading(true);
    setData(null);
    try {
      const res = await axios.post('http://localhost:8000/api/company', { company_name: company });
      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const startMockInterview = () => {
    navigate('/interview', { state: { targetRole: 'SDE', company: selected } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Preparation</h1>
          <p className="mt-1 text-gray-500 font-medium italic">Detailed company insights, tech stacks, and curated coding questions.</p>
        </div>
      </div>

      {/* Company Selector */}
      <div className="ts-card flex flex-wrap gap-3">
        {COMPANIES.map((c) => (
          <button
            key={c}
            onClick={() => fetchPrep(c)}
            className={`px-6 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
              selected === c 
              ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md shadow-purple-600/10' 
              : 'border-gray-100 bg-white text-gray-500 hover:border-purple-200 hover:text-gray-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
          <p className="text-gray-500 font-bold animate-pulse">Extracting company patterns...</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Company Hero Card */}
          <div className="ts-card p-8">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{data?.name}</h2>
                    <p className="text-purple-600 font-bold flex items-center gap-1.5 text-sm uppercase tracking-wider"><Globe className="w-4 h-4" /> Global Tech Leader</p>
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed text-lg">{data?.details?.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> HQ</p>
                    <p className="text-sm font-bold text-gray-800">{data?.details?.hq}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Founded</p>
                    <p className="text-sm font-bold text-gray-800">{data?.details?.founded}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users className="w-3 h-3" /> Size</p>
                    <p className="text-sm font-bold text-gray-800">{data?.details?.employees}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> Industry</p>
                    <p className="text-sm font-bold text-gray-800">{data?.details?.industry}</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-80 flex flex-col gap-4">
                <button 
                  onClick={startMockInterview}
                  className="ts-btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-lg tracking-widest shadow-xl shadow-purple-600/20"
                >
                  <Play className="w-5 h-5 fill-current" /> Mock Interview
                </button>
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full -mr-12 -mt-12" />
                  <h4 className="text-amber-800 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Interview Tip
                  </h4>
                  <p className="text-sm text-amber-900/80 leading-relaxed font-medium">
                    {data?.tips}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Interview Patterns */}
            <div className="ts-card">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-xl">
                <Target className="w-6 h-6 text-purple-600" /> Focus Areas
              </h3>
              <div className="space-y-3">
                {data?.patterns?.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 group hover:border-purple-200 transition-all">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-md shadow-purple-500/40" />
                    <span className="text-sm font-bold text-gray-700">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coding Questions */}
            <div className="ts-card">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-xl">
                <Code2 className="w-6 h-6 text-purple-600" /> Coding Rounds
              </h3>
              <div className="space-y-3">
                {data?.coding_questions?.map((q, i) => (
                  <a 
                    key={i} 
                    href={q.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-400 group transition-all"
                  >
                    <span className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors">{q.title}</span>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-purple-600" />
                  </a>
                ))}
              </div>
            </div>

            {/* Behavioral Questions */}
            <div className="ts-card">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-xl">
                <Users className="w-6 h-6 text-purple-600" /> Behavioral
              </h3>
              <div className="space-y-4">
                {data?.questions?.map((q, i) => (
                  <div key={i} className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 italic leading-relaxed">"{q}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack Footer */}
          <div className="ts-card bg-gray-50/50 border-dashed">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Preferred Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {data?.details?.tech_stack?.split(',').map((tech, i) => (
                <span key={i} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-600 border border-gray-100 shadow-sm">
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
