import React, { useState } from 'react';
import { XIcon } from './Icons';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@styleai.com' && password === 'admin123') {
      onLoginSuccess();
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-12 shadow-xl w-full max-w-md relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-2 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
                <span className="font-bold text-2xl">A</span>
            </div>
          <h2 className="text-2xl font-bold text-black uppercase tracking-wider">Admin Portal</h2>
          <p className="text-gray-500 mt-2 text-sm">Hệ thống quản trị tập trung</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none transition-all rounded-none"
              placeholder="admin@styleai.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none transition-all rounded-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-[#ED1C24] px-4 py-3 text-sm font-medium border border-red-100 text-center">
                {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-[#ED1C24] transition-colors rounded-none"
          >
            Đăng nhập
          </button>
        </form>
        
        <div className="mt-8 text-center">
             <p className="text-xs text-gray-400 font-medium">
                Gợi ý: admin@styleai.com / admin123
             </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;