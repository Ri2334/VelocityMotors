import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { loginUser, user, error, setError, loading } = useAuth();
  const navigate = useNavigate();

  // Clear errors on page mount
  useEffect(() => {
    setError(null);
    setFormError('');
  }, [setError]);

  // Redirect to landing dashboard if session is already resolved
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both your email and password');
      return;
    }

    const result = await loginUser(email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-brand-100 text-center mb-6">Welcome Back</h2>
      
      {(formError || error) && (
        <div className="mb-5 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm font-semibold animate-pulse">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold text-brand-400 uppercase tracking-widest mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full bg-brand-950/80 border border-brand-800 text-brand-50 px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all text-sm placeholder-brand-600"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-400 uppercase tracking-widest mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full bg-brand-950/80 border border-brand-800 text-brand-50 px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all text-sm placeholder-brand-600"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-600 hover:bg-accent-500 text-brand-50 font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-accent-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-50 border-t-transparent"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-brand-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-400 hover:text-accent-300 font-bold transition-all">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
