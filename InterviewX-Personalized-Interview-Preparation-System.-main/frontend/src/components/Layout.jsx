import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Mic,
  Code2,
  Building2,
  Map,
  BarChart3,
  MessageSquare,
  LogOut,
  User,
  Bell,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"full_name": "Mohammed Rawhan Ramzi", "email": "rawhan@interviewx.ai"}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analysis', path: '/resume', icon: FileText },
    { name: 'AI Interview', path: '/interview', icon: Mic },
    { name: 'Coding Practice', path: '/coding', icon: Code2 },
    { name: 'Company Prep', path: '/company', icon: Building2 },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
    { name: 'Skill Development', path: '/skillforge', icon: Zap },
  ];

  const location = useLocation();
  const isSkillForge = location.pathname === '/skillforge';

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col relative z-20">
        <div className="h-20 flex items-center px-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 leading-none tracking-tighter uppercase">Interview<span className="text-purple-600">X</span></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">AI Career Ecosystem</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-8">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `ts-sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="ts-sidebar-item w-full text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 text-gray-500">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">InterviewX Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-bold text-gray-700">{user?.full_name || 'User'}</span>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto ${isSkillForge ? 'p-4' : 'p-8'}`}>
          <div className={isSkillForge ? 'w-full h-full' : 'max-w-7xl mx-auto'}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
