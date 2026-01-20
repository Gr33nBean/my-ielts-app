import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleHandleLogin = async () => {
    if (!email) return setError("Vui lòng nhập email!");
    setError('');
    setIsSubmitting(true);

    const result = await login(email);
    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col justify-center px-6 py-12 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Welcome to</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">IELTS 8.0 TEAM</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Hệ thống học tập nội bộ</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-800">
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold leading-6 text-slate-500 dark:text-slate-400 uppercase ml-1">
              Nhập Email của bạn
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border-0 py-4 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 outline-none bg-slate-50 dark:bg-slate-800 transition-all font-medium"
                placeholder="example@gmail.com"
              />
            </div>
          </div>
          
          <button 
            onClick={handleHandleLogin}
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Đang kiểm tra...' : 'Vào App'}
          </button>

          {error && <p className="text-red-500 text-xs mt-4 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginView;