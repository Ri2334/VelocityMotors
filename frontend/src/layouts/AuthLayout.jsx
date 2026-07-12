import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-950 px-4 relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-accent-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-brand-900/60 border border-brand-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-wider text-brand-100">
            VELOCITY <span className="text-accent-500 font-black">MOTORS</span>
          </h1>
          <p className="text-brand-400 text-xs mt-1 uppercase tracking-widest font-semibold">Premium Inventory Management</p>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
