import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colorStyles = 
    type === 'success' 
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
      : 'bg-accent-500/10 border-accent-500/30 text-accent-400';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 border rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 ${colorStyles}`}>
      <span className="text-sm font-bold tracking-wide">{message}</span>
      <button 
        onClick={onClose} 
        className="text-xs hover:opacity-75 transition-all font-black focus:outline-none ml-2"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
