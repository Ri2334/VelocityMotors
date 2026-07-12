import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-brand-950 text-brand-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="bg-brand-900/60 border-b border-brand-800/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-extrabold tracking-wider text-brand-100 flex items-center gap-1">
              VELOCITY <span className="text-accent-500 font-black">MOTORS</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/') 
                    ? 'bg-brand-800 text-brand-100 shadow-md' 
                    : 'text-brand-400 hover:text-brand-100 hover:bg-brand-800/40'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/search') 
                    ? 'bg-brand-800 text-brand-100 shadow-md' 
                    : 'text-brand-400 hover:text-brand-100 hover:bg-brand-800/40'
                }`}
              >
                Search Inventory
              </Link>
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/admin') 
                      ? 'bg-brand-800 text-accent-400 shadow-md' 
                      : 'text-brand-400 hover:text-accent-400 hover:bg-brand-800/40'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-brand-100 leading-tight">{user?.name}</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                {user?.role === 'admin' ? (
                  <span className="bg-accent-500/10 text-accent-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Admin
                  </span>
                ) : (
                  <span className="bg-brand-500/10 text-brand-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Client
                  </span>
                )}
                <span className="text-xs text-brand-400 font-medium">{user?.email}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-brand-800 hover:bg-accent-600/20 hover:text-accent-400 border border-brand-700/60 hover:border-accent-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
