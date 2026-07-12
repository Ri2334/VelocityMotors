import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPlaceholder = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 font-sans">
      <header className="mb-4">
        <h2 className="text-3xl font-extrabold text-brand-100">Welcome Back, {user?.name}!</h2>
        <p className="text-brand-400 mt-1">Here is a summary of your account authentication status.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-905 bg-brand-900 border border-brand-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-brand-100 mb-4 pb-2 border-b border-brand-800/80">Profile Overview</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex justify-between items-center py-1">
              <span className="text-brand-400 font-semibold">Name:</span>
              <span className="text-brand-100 font-bold">{user?.name}</span>
            </li>
            <li className="flex justify-between items-center py-1">
              <span className="text-brand-400 font-semibold">Email:</span>
              <span className="text-brand-100 font-bold">{user?.email}</span>
            </li>
            <li className="flex justify-between items-center py-1">
              <span className="text-brand-400 font-semibold">Access Level:</span>
              <span>
                {user?.role === 'admin' ? (
                  <span className="bg-accent-500/10 text-accent-400 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Administrator
                  </span>
                ) : (
                  <span className="bg-brand-500/10 text-brand-300 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Standard Client
                  </span>
                )}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-brand-900 border border-brand-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-accent-500 mb-2">Portal Status</h3>
            <p className="text-sm text-brand-300 leading-relaxed">
              Authentication has succeeded and your login session is fully active.
            </p>
            <p className="text-xs text-brand-400 mt-4 leading-relaxed bg-brand-950/80 p-3 rounded-xl border border-brand-800/60">
              ℹ️ **Upcoming Integration**: The interactive vehicle inventory grid, sliders, filters, and purchase endpoints will be wired in **Milestone 6 (Vehicle Dashboard)**.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlaceholder;
