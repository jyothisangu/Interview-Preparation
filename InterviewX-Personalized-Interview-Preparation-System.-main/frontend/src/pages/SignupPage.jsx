import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, Loader2, Sparkles, ArrowRight, Brain, Rocket } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/auth/signup', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f0f4f8] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-20 opacity-10"><Rocket className="w-20 h-20 text-blue-900" /></div>
      <div className="absolute bottom-20 right-20 opacity-10"><Brain className="w-24 h-24 text-blue-900" /></div>
      <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-10"><Sparkles className="w-16 h-16 text-blue-900" /></div>

      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-16 relative z-10 border border-blue-50/50">
        <div className="flex flex-col items-center">
          {/* Vignan's Logo */}
          <div className="mb-8 w-full flex justify-center">
            <img 
              src="/vignan_logo.png" 
              alt="Vignan Logo" 
              className="h-24 object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-black text-[#2e4a9e] tracking-tight uppercase mb-10 text-center">
            INTERVIEW<span className="text-orange-500">X</span> PLATFORM <br />
            <span className="text-sm font-bold text-gray-400">Create Your Workspace</span>
          </h1>

          {/* Form */}
          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-blue-50/30 border-2 border-blue-50/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 placeholder-blue-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                    placeholder="Enter Full Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-blue-50/30 border-2 border-blue-50/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 placeholder-blue-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                      placeholder="Enter Email ID"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-blue-50/30 border-2 border-blue-50/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 placeholder-blue-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                      placeholder="Enter Password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2e4a9e] hover:bg-[#1e3a8e] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-wider"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Join the Platform
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Already have an account? <Link to="/login" className="text-blue-600 font-black hover:underline ml-1">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
