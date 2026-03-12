import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/db';
import { XIcon } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate network delay for better UX
    setTimeout(() => {
        if (isLogin) {
            // LOGIN LOGIC
            
            // Special check for admin password
            if (email === 'admin@styleai.com') {
                if (password === 'admin123') {
                     const user = db.loginUser(email);
                     if (user) {
                         onLogin(user);
                         onClose();
                     }
                } else {
                    setError('Mật khẩu quản trị không đúng (Gợi ý: admin123)');
                }
                setLoading(false);
                return;
            }

            const user = db.loginUser(email);
            if (user) {
                onLogin(user);
                onClose();
            } else {
                setError('Email không tồn tại hoặc sai mật khẩu.');
            }
        } else {
            // REGISTER LOGIC
            if (email === 'admin@styleai.com') {
                setError('Không thể đăng ký tài khoản quản trị.');
                setLoading(false);
                return;
            }

            // Check if user exists
            const existingUsers = db.getUsers();
            if (existingUsers.find(u => u.email === email)) {
                setError('Email này đã được sử dụng.');
                setLoading(false);
                return;
            }

            const newUser: User = {
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000000&color=fff`
            };
            
            db.saveUser(newUser);
            onLogin(newUser);
            onClose();
        }
        setLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors z-10"
            >
                <XIcon className="w-6 h-6 text-black" />
            </button>

            <div className="p-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[#ED1C24] flex flex-col items-center justify-center mx-auto mb-6 text-white font-bold leading-none text-[10px] tracking-tighter">
                        <span>NEXA</span><span>MODE</span>
                    </div>
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
                    <p className="text-gray-500 mt-2 text-sm">Trải nghiệm mua sắm tiện lợi hơn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none transition-colors rounded-none placeholder-gray-400"
                                placeholder="Họ tên đầy đủ"
                            />
                        </div>
                    )}
                    <div>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none transition-colors rounded-none placeholder-gray-400"
                            placeholder="Địa chỉ Email"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-gray-300 px-4 py-3 focus:border-black outline-none transition-colors rounded-none placeholder-gray-400"
                            placeholder="Mật khẩu"
                        />
                    </div>

                    {error && (
                        <p className="text-[#ED1C24] text-sm font-medium text-center bg-red-50 py-2">{error}</p>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex justify-center items-center rounded-none"
                    >
                        {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="ml-2 text-black font-bold hover:underline underline-offset-2"
                        >
                            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;