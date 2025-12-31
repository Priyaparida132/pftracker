
import React, { useState } from 'react';
import { Wallet, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { storageService } from '../services/storage';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: isLogin ? (formData.email.split('@')[0]) : formData.name
    };
    storageService.setUser(mockUser);
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-indigo-400/20">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Wallet className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">FinTrack Pro</h1>
            <p className="text-gray-500 mt-2 text-sm">Your simple wealth tracker</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline">
              {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
