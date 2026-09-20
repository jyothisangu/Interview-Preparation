import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Target, Zap, Loader2, ArrowRight } from 'lucide-react';

const ScoreGauge = ({ score }) => {
  const color = score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';
  const bg = score >= 75 ? 'bg-green-50' : score >= 50 ? 'bg-yellow-50' : 'bg-red-50';
  return (
    <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full ${bg} border border-current ${color}`}>
      <span className="text-3xl font-bold">{score}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest">ATS Score</span>
    </div>
  );
};

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [role, setRole] = useState('SDE');

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith('.pdf')) setFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);
    try {
      const res = await axios.post(`http://localhost:8000/api/resume/upload?role=${role}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 text-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume Analyzer</h1>
        <p className="mt-1 text-gray-500 font-medium italic">Instant ATS evaluation and AI-powered skill mapping</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="ts-card space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Career Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="ts-input font-bold"
              >
                <option value="SDE">Software Engineer (SDE)</option>
                <option value="ML">ML Engineer</option>
                <option value="PM">Product Manager</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('resume-file-input').click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-purple-400 bg-purple-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-purple-300 bg-gray-50/50'
              }`}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Drop your PDF resume here</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">or click to browse local files</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="ts-btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg shadow-xl shadow-purple-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
              {loading ? 'Analyzing Profile...' : 'Begin AI Analysis'}
            </button>
            
            {error && (
              <div className="p-3 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="ts-card flex flex-col md:flex-row items-center gap-8 border-none shadow-xl bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-600" />
                <ScoreGauge score={Math.round(result.score)} />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
                  <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                    {result.score >= 75
                      ? 'Excellent match! Your profile is highly competitive for the current industry landscape.'
                      : 'Good foundation detected. Adding the missing keywords below will significantly boost your visibility.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ts-card">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Zap className="w-3 h-3 text-yellow-500" /> Skills Detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skills?.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-tight border border-purple-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ts-card">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Target className="w-3 h-3 text-red-500" /> Missing Gaps
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords?.map((kw) => (
                      <span key={kw} className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-tight border border-red-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ts-card">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Actionable Improvements</h3>
                 <div className="space-y-4">
                    {result.feedback?.map((fb, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        {fb}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] ts-card border-dashed border-2 flex flex-col items-center justify-center text-center p-12 bg-gray-50/20">
               <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 text-gray-300 shadow-inner">
                  <FileText className="w-10 h-10" />
               </div>
               <h3 className="text-xl font-bold text-gray-400">Analysis Pending</h3>
               <p className="text-sm text-gray-300 mt-2 max-w-xs mx-auto font-medium">Upload your resume to see how you rank against the latest industry benchmarks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
