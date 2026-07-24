import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiActivity, FiArrowRight } from 'react-icons/fi';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedEmail, selectedPassword) => {
    setEmail(selectedEmail);
    setPassword(selectedPassword);
    try {
      setError('');
      setLoading(true);
      await login(selectedEmail, selectedPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Brand/Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-650 text-white shadow-xl shadow-indigo-600/35 mb-4">
            <FiActivity className="text-2xl animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Welcome to LeadFlow</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your dashboard and manage pipelines
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs font-semibold">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={FiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={FiLock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <div className="flex items-center justify-between text-xs font-medium">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-700 bg-slate-800 text-indigo-650 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3"
            >
              Sign In
              <FiArrowRight className="ml-2" />
            </Button>
          </form>

          {/* Quick Login Section for Review */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Demo Accounts Shortcut
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@leadflow.com', 'Admin123')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-750 transition-all text-center cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200">Sarah Jenkins</span>
                <span className="text-[9px] font-semibold text-indigo-400 uppercase tracking-wide mt-1">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('member@leadflow.com', 'Member123')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-750 transition-all text-center cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200">Alex Rivera</span>
                <span className="text-[9px] font-semibold text-emerald-450 uppercase tracking-wide mt-1">Member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          LeadFlow CRM v1.0.0 &bull; Secure SSL Encryption
        </p>
      </div>
    </div>
  );
};

export default Login;
