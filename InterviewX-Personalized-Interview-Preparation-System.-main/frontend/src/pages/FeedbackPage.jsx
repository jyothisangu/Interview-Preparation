import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Zap, Loader2, Star, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const MOCK_FEEDBACK = {
  strengths: [
    'Strong understanding of core data structures.',
    'Clear and articulate communication style.',
    'Good problem-decomposition skills shown in mock sessions.',
  ],
  weaknesses: [
    'System design answers need more concrete scalability details.',
    'Dynamic programming solutions could be more optimized.',
    'Behavioral answers sometimes lack specific impact metrics (STAR format).',
  ],
  communication_tips: [
    'Use the STAR method explicitly: Situation, Task, Action, Result.',
    'Pause before answering to organize your thoughts — it shows composure.',
    'Ask clarifying questions before diving into a solution.',
  ],
  readiness_score: 72,
};

const FeedbackPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const generateFeedback = async () => {
    setLoading(true);
    try {
      // Try to get history from local storage or use session state if available
      // For this demo, we'll try to find any recent session data
      const history = JSON.parse(localStorage.getItem('interview_history') || '[]');
      
      const res = await axios.post('http://localhost:8000/api/interview/report', {
        user_id: user.id,
        qa_history: history
      });
      
      setData({
        ...res.data,
        previous_score: user.previous_readiness_score || 0
      });
    } catch (err) {
      console.error("Error generating report:", err);
      // Fallback
      setData({
        ...MOCK_FEEDBACK,
        readiness_score: user.readiness_score || 72,
        previous_score: user.previous_readiness_score || 0,
        weaknesses: (user.weak_areas && user.weak_areas.length > 0) ? user.weak_areas : MOCK_FEEDBACK.weaknesses
      });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = data?.readiness_score >= 75 ? 'text-green-600' : data?.readiness_score >= 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = data?.readiness_score >= 75 ? 'bg-green-100' : data?.readiness_score >= 50 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-gray-900">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Feedback Report</h1>
        <p className="mt-1 text-gray-500 font-medium italic">Get a holistic interview readiness assessment from the perspective of a senior interviewer.</p>
      </div>

      {!data ? (
        <div className="ts-card p-16 flex flex-col items-center gap-6 text-center border-dashed border-2">
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center shadow-inner">
            <MessageSquare className="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ready for your feedback?</h2>
            <p className="text-gray-500 mt-2 max-w-md">Our Feedback Agent will analyze your mock interview history, resume score, and coding attempts to generate a personalized report.</p>
          </div>
          <button onClick={generateFeedback} disabled={loading} className="ts-btn-primary flex items-center gap-3 px-8 py-4 shadow-xl shadow-purple-600/20 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
            {loading ? 'Analyzing Data...' : 'Generate My Report'}
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Readiness Score Card */}
          <div className={`ts-card border-none shadow-xl ${scoreBg} flex flex-col sm:flex-row items-center gap-8 p-10 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16" />
            <div className={`w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center flex-shrink-0 shadow-lg border-4 ${scoreColor === 'text-green-600' ? 'border-green-500' : scoreColor === 'text-yellow-600' ? 'border-yellow-500' : 'border-red-500'}`}>
              <span className={`text-5xl font-black ${scoreColor}`}>{data.readiness_score}</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${scoreColor} opacity-60`}>Score</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <p className={`text-3xl font-black ${scoreColor}`}>
                  {data.readiness_score >= 75 ? '🎉 Interview Ready!' : data.readiness_score >= 50 ? '📈 Good Progress' : '📚 More Practice Needed'}
                </p>
                {data.previous_score > 0 && (
                  <span className="text-xs font-bold px-2 py-1 bg-white/30 rounded-lg text-gray-700">
                    Previous: {data.previous_score}% → Now: {data.readiness_score}%
                  </span>
                )}
              </div>
              <p className="text-gray-700 font-medium leading-relaxed max-w-lg">
                Your readiness has been updated live based on your latest performance. 
                {data.readiness_score < data.previous_score ? " We've detected some new weak areas that need attention." : " You're showing great improvement!"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="ts-card">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ThumbsUp className="w-6 h-6 text-green-500" /> Key Strengths
              </h3>
              <ul className="space-y-4">
                {data.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-4 p-3 bg-green-50 rounded-xl border border-green-100/50">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="ts-card">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ThumbsDown className="w-6 h-6 text-red-500" /> Focus Areas
              </h3>
              <ul className="space-y-4">
                {data.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-4 p-3 bg-red-50 rounded-xl border border-red-100/50">
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Session Summary */}
            <div className="ts-card bg-slate-50 border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-slate-600" /> Session Summary
              </h3>
              <ul className="space-y-4">
                {data.session_summary?.map((s, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Trend */}
            <div className="ts-card bg-amber-50 border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-600" /> Improvement Trend
              </h3>
              <div className="p-6 bg-white rounded-2xl border border-amber-100 text-center">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-3">Last 3 Sessions</p>
                <div className="flex items-center justify-center gap-4">
                  {(user.score_history?.slice(-3) || [5.5, 6.8, 7.2]).map((score, i, arr) => (
                    <React.Fragment key={i}>
                      <span className="text-2xl font-black text-amber-900">{score}</span>
                      {i < arr.length - 1 && <ArrowRight className="w-5 h-5 text-amber-300" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Tips */}
          <div className="ts-card border-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-600/20">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300 fill-current" /> Expert Advice
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.communication_tips.map((t, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner">
                  <p className="text-sm font-medium leading-relaxed italic text-indigo-50">"{t}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button onClick={() => setData(null)} className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors uppercase tracking-widest">
              Reset and re-generate assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
