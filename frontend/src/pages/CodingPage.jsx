import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play, CheckCircle, XCircle, ExternalLink, Loader2, Code2, BookOpen, Filter, ChevronRight, Search } from 'lucide-react';
import DSA_TOPICS from '../data/dsaProblems';

const DIFF_COLOR = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const STARTER = `def solution():
    # Write your solution here
    pass
`;

const CodingPage = () => {
  const [activeTab, setActiveTab] = useState('dsa'); // 'dsa' | 'ide'
  const [selectedTopic, setSelectedTopic] = useState(DSA_TOPICS[0].id);
  const [diffFilter, setDiffFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);

  const topic = DSA_TOPICS.find(t => t.id === selectedTopic);
  const filtered = topic?.problems.filter(p => {
    const matchDiff = diffFilter === 'All' || p.difficulty === diffFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  }) || [];

  const countByDiff = (diff) => topic?.problems.filter(p => p.difficulty === diff).length || 0;
  const totalProblems = DSA_TOPICS.reduce((acc, t) => acc + t.problems.length, 0);

  const openLeetCode = (url) => window.open(url, '_blank');

  const runCode = async () => {
    if (!selectedQ) return;
    setLoading(true); setResult(null);
    try {
      const res = await axios.post('http://localhost:8000/api/coding/submit', {
        question_id: selectedQ.id, code, language: 'python',
      });
      setResult(res.data);
    } catch (err) {
      setResult({ passed: false, feedback: err.response?.data?.detail || 'Server error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coding Practice</h1>
          <p className="mt-1 text-gray-500 font-medium italic">{totalProblems} problems across {DSA_TOPICS.length} topics</p>
        </div>
        <div className="interview-mode-tabs min-w-[300px]">
          <button onClick={() => setActiveTab('dsa')} className={`interview-mode-tab ${activeTab === 'dsa' ? 'active' : ''}`}>
            <BookOpen className="w-4 h-4" /> DSA Problems
          </button>
          <button onClick={() => setActiveTab('ide')} className={`interview-mode-tab ${activeTab === 'ide' ? 'active' : ''}`}>
            <Code2 className="w-4 h-4" /> IDE Practice
          </button>
        </div>
      </div>

      {activeTab === 'dsa' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Topic Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="ts-card">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-purple-600" /> Topics</h3>
              <div className="space-y-2">
                {DSA_TOPICS.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTopic(t.id); setDiffFilter('All'); setSearch(''); }}
                    className={`personality-card ${selectedTopic === t.id ? 'selected' : ''}`}
                    style={selectedTopic === t.id ? { borderColor: '#6d28d9', background: '#f5f3ff' } : {}}>
                    <span className="text-2xl">{t.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm text-gray-800">{t.name}</div>
                      <div className="text-[11px] text-gray-500">{t.days} day{t.days > 1 ? 's' : ''} recommended</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedTopic === t.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {t.problems.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problems Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filters */}
            <div className="ts-card flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search problems..."
                  className="ts-input pl-10" />
              </div>
              <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                  <button key={d} onClick={() => setDiffFilter(d)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${diffFilter === d
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'}`}>
                    {d} {d !== 'All' && <span className="ml-1 opacity-60">({countByDiff(d)})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Header Card */}
            <div className="ts-card bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-xl shadow-purple-600/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                    {topic?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{topic?.name}</h2>
                    <p className="text-purple-100 text-sm font-medium">{topic?.problems.length} problems · {topic?.days} day{topic?.days > 1 ? 's' : ''} recommended</p>
                  </div>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="px-3 py-1 bg-white/10 rounded-xl"><p className="text-xl font-black">{countByDiff('Easy')}</p><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Easy</p></div>
                  <div className="px-3 py-1 bg-white/10 rounded-xl"><p className="text-xl font-black">{countByDiff('Medium')}</p><p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Medium</p></div>
                  <div className="px-3 py-1 bg-white/10 rounded-xl"><p className="text-xl font-black">{countByDiff('Hard')}</p><p className="text-[10px] font-bold uppercase tracking-wider text-red-300">Hard</p></div>
                </div>
              </div>
            </div>

            {/* Problem List */}
            <div className="ts-card p-0 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-16 text-center text-gray-400 font-medium italic">No problems match your filters.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filtered.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all group">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-xs text-gray-300 w-6 font-mono">{i + 1}</span>
                        <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{p.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-widest uppercase ${p.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : p.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{p.difficulty}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => openLeetCode(p.url)}
                            className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors" title="LeetCode">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setSelectedQ(p); setActiveTab('ide'); }}
                            className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all">
                            <Code2 className="w-3.5 h-3.5" /> IDE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* IDE Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="ts-card">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-600" /> Select Problem</h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {DSA_TOPICS.map(t => t.problems.map(p => (
                  <button key={p.id} onClick={() => setSelectedQ(p)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${selectedQ?.id === p.id ? 'bg-purple-50 text-purple-700 border-2 border-purple-200' : 'hover:bg-gray-50 text-gray-600 border-2 border-transparent'}`}>
                    <span className="font-semibold truncate">{p.title}</span>
                    <span className={`text-[10px] font-black flex-shrink-0 ${p.difficulty === 'Easy' ? 'text-emerald-500' : p.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>{p.difficulty[0]}</span>
                  </button>
                )))}
              </div>
              {selectedQ && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border tracking-widest uppercase ${selectedQ.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : selectedQ.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{selectedQ.difficulty}</span>
                    <a href={selectedQ.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-orange-600 hover:underline font-bold">
                      <ExternalLink className="w-3.5 h-3.5" /> LeetCode
                    </a>
                  </div>
                  <p className="font-bold text-gray-900 text-lg leading-tight">{selectedQ.title}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="ts-card p-0 overflow-hidden border-none shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-[#1e293b] text-white">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="w-3 h-3 rounded-full bg-yellow-500" /><span className="w-3 h-3 rounded-full bg-green-500" /></div>
                  <div className="h-4 w-px bg-white/20 mx-2" />
                  <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Python 3</span>
                  <span className="text-xs font-medium text-gray-400">— {selectedQ ? selectedQ.title : 'Select a problem'}</span>
                </div>
                <button onClick={runCode} disabled={loading || !selectedQ} className="ts-btn-primary flex items-center gap-2 py-2 px-6 shadow-lg shadow-purple-600/20 disabled:opacity-40">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {loading ? 'Executing...' : 'Run Solution'}
                </button>
              </div>
              <Editor height="450px" language="python" theme="vs-dark" value={code} onChange={val => setCode(val || '')}
                options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbers: 'on', automaticLayout: true, padding: { top: 20 } }} />
            </div>
            {result && (
              <div className={`ts-card animate-in flex items-start gap-5 border-2 ${result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`p-3 rounded-2xl ${result.passed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {result.passed ? <CheckCircle className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xl font-bold mb-1 ${result.passed ? 'text-emerald-900' : 'text-red-900'}`}>
                    {result.passed ? 'Test Passed!' : 'Execution Error'}
                  </h4>
                  <pre className="text-sm font-mono text-gray-700 bg-white/50 p-4 rounded-xl mt-3 border border-current/10 overflow-x-auto whitespace-pre-wrap">
                    {result.test_feedback || result.feedback}
                  </pre>
                  
                  {result.ai_review && (
                    <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-100 flex gap-3 items-start">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white fill-current" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-1">AI Code Review</p>
                        <p className="text-sm font-bold text-purple-900 leading-relaxed italic">"{result.ai_review}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingPage;
