import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { registerUser, user, error, setError, loading } = useAuth();
  const navigate = useNavigate();

  // Clear errors on page mount
  useEffect(() => {
    setError(null);
    setFormError('');
  }, [setError]);

  // Redirect to landing dashboard if session is already active
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password) {
      setFormError('Please fill in all input fields');
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setFormError('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character');
      return;
    }

    const result = await registerUser(name, email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-brand-100 text-center mb-6">Create Account</h2>
      
      {(formError || error) && (
        <div className="mb-5 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-400 text-sm font-semibold animate-pulse">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold text-brand-400 uppercase tracking-widest mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full bg-brand-950/80 border border-brand-800 text-brand-50 px-4 py-3 rounded-xl focus:border-accent-500 focus:outline-none transition-all text-sm placeholder-brand-600"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            Password (min 8 chars, uppercase, lowercase, special)
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-brand-400">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-400 hover:text-accent-300 font-bold transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
