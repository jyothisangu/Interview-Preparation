import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Code2, FileText, Mic } from 'lucide-react';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

const interviewScores = [
  { day: 'Mon', score: 4.5 },
  { day: 'Tue', score: 6.2 },
  { day: 'Wed', score: 5.8 },
  { day: 'Thu', score: 7.1 },
  { day: 'Fri', score: 7.9 },
  { day: 'Sat', score: 8.4 },
  { day: 'Sun', score: 8.0 },
];

const codingProgress = [
  { topic: 'Arrays', solved: 12 },
  { topic: 'Trees', solved: 7 },
  { topic: 'DP', solved: 5 },
  { topic: 'Graphs', solved: 3 },
  { topic: 'Strings', solved: 9 },
];

const activityData = [
  { name: 'Interviews', value: 35 },
  { name: 'Coding', value: 40 },
  { name: 'Resume', value: 10 },
  { name: 'Company Prep', value: 15 },
];

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="ts-card flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 mt-1">{sub}</p>
    </div>
  </div>
);

const AnalyticsPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="mt-1 text-gray-500 font-medium italic">Track your progress and readiness across all modules.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Mic} label="Interview Avg" value="7.2" sub="Last 7 sessions" color="bg-purple-600 shadow-purple-600/20" />
        <StatCard icon={Code2} label="Problems" value="36" sub="This month" color="bg-indigo-600 shadow-indigo-600/20" />
        <StatCard icon={FileText} label="Resume Score" value="78" sub="Latest ATS check" color="bg-blue-600 shadow-blue-600/20" />
        <StatCard icon={TrendingUp} label="Readiness" value="72%" sub="Overall estimate" color="bg-pink-600 shadow-pink-600/20" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="ts-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" /> Interview Score Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={interviewScores}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ts-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" /> Progress by Topic
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={codingProgress} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="solved" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="ts-card col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Activity Split</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={activityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                {activityData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="ts-card col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Readiness</h3>
          <div className="space-y-6">
            {[
              { label: 'Data Structures & Algorithms', pct: 72, color: 'bg-indigo-500' },
              { label: 'System Design', pct: 45, color: 'bg-purple-500' },
              { label: 'Communication & Behavioral', pct: 80, color: 'bg-blue-500' },
              { label: 'Domain Knowledge (SDE)', pct: 68, color: 'bg-pink-500' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-600 uppercase tracking-wider">{s.label}</span>
                  <span className="text-purple-600">{s.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`${s.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
